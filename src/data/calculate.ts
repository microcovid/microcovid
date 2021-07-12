import {
  BUDGET_ONE_PERCENT,
  Distance,
  FormValue,
  Interaction,
  PersonRiskValue,
  RiskProfile,
  RiskProfileEnum,
  Setting,
  TheirMask,
  VaccineValue,
  Vaccines,
  Voice,
  YourMask,
  intimateDurationFloor,
  partnerMult,
  personRiskMultiplier,
} from 'data/data'

export interface CalculatorData {
  // Persistence
  persistedAt?: number

  // Budget (in microCOVIDs/year)
  riskBudget: number

  // Prevalence
  useManualEntry: number
  topLocation: string
  subLocation: string
  subSubLocation: string | null // non-US county
  population: string
  casesPastWeek: number
  casesIncreasingPercentage: number
  positiveCasePercentage: number | null
  prevalanceDataDate: Date
  percentFullyVaccinated: number | null
  unvaccinatedPrevalenceRatio: number | null
  averageFullyVaccinatedMultiplier: number | null

  // Person risk
  riskProfile: keyof typeof RiskProfile
  interaction: string
  personCount: number
  symptomsChecked: string

  // Activity risk
  setting: string
  distance: string
  duration: number
  theirMask: string
  yourMask: string
  voice: string

  // Vaccine
  yourVaccineType: string
  yourVaccineDoses: number

  theirVaccine: string

  // Preset scenario name
  scenarioName?: string
}

export const defaultValues: CalculatorData = {
  riskBudget: BUDGET_ONE_PERCENT,

  useManualEntry: 0,
  topLocation: '',
  subLocation: '',
  subSubLocation: '',
  population: '',
  casesPastWeek: 0,
  casesIncreasingPercentage: 0,
  positiveCasePercentage: 0,
  prevalanceDataDate: new Date(),
  percentFullyVaccinated: null,
  unvaccinatedPrevalenceRatio: null,
  averageFullyVaccinatedMultiplier: null,

  riskProfile: '',
  interaction: '',
  personCount: 0,
  symptomsChecked: 'no',

  setting: '',
  distance: '',
  duration: 0,
  theirMask: '',
  yourMask: '',
  voice: '',

  yourVaccineType: '',
  yourVaccineDoses: 0,

  theirVaccine: 'undefined',

  scenarioName: '',
}

interface CalculatorResult {
  expectedValue: number
  lowerBound: number
  upperBound: number
}

const MAX_DELAY_FACTOR = 2

export const DAY_0 = new Date(2020, 1, 12)
const MS_PER_DAY = 1000 * 60 * 60 * 24

// From https://covid19-projections.com/estimating-true-infections-revisited/
const prevalenceRatio = (positivityPercent: number | null, date: Date) => {
  const day_i = (date.getTime() - DAY_0.getTime()) / MS_PER_DAY
  if (positivityPercent === null || positivityPercent > 100) {
    // No positivity data, assume the worst.
    positivityPercent = 100
  }
  const positivityRate = positivityPercent / 100
  return (1000 / (day_i + 10)) * positivityRate ** 0.5 + 2
}

// These are the variables exposed via query parameters
export type QueryData = Partial<CalculatorData>

// Replace any values that no longer exist with empty string (nothing selected).
// This is used when restoring a previous saved scenario, in case we changed
// the model in the meantime.
export const migrateDataToCurrent = (
  incomingData: Record<string, unknown>,
): CalculatorData => {
  const data: Partial<CalculatorData> = { ...incomingData }
  const fixOne = (
    table: { [key: string]: FormValue | PersonRiskValue | VaccineValue },
    prop: keyof CalculatorData,
  ) => {
    const current = data[prop]
    if (typeof current !== 'string' || !(current in table)) {
      delete data[prop]
    }
  }
  fixOne(RiskProfile, 'riskProfile')
  fixOne(Interaction, 'interaction')
  fixOne(Setting, 'setting')
  fixOne(Distance, 'distance')
  fixOne(TheirMask, 'theirMask')
  fixOne(YourMask, 'yourMask')
  fixOne(Voice, 'voice')
  fixOne(Vaccines, 'yourVaccineType')

  if (
    data['yourVaccineDoses'] !== undefined &&
    (data['yourVaccineDoses'] > 2 || data['yourVaccineDoses'] < 0)
  ) {
    delete data['yourVaccineDoses']
  }
  return { ...defaultValues, ...data }
}

export const ONE_MILLION = 1e6 // One 'full' COVID

export const MAX_ACTIVITY_RISK = partnerMult
export const MAX_POINTS = 100000

// --------
// our sheet at https://www.getguesstimate.com/models/16798
// suggests that given known unknowns we could be about 3x off
// in either direction
export const ERROR_FACTOR = 3

export const parsePopulation = (input: string): number =>
  Number(input.replace(/[^0-9.e]/g, ''))

// Convention: all of these functions return null if they determine
// that we have insufficient data filled in to do the calculation.
// We also turn exceptions into null returns, to deal with outdated
// local prevalence data a little more cleanly.

export const calculateLocationReportedPrevalence = (
  data: CalculatorData,
): number | null => {
  try {
    const population = parsePopulation(data.population)
    if (population === 0) {
      return null
    }

    const lastWeek = data.casesPastWeek
    if (data.useManualEntry && lastWeek === 0) {
      // If the data say zero cases, go with it; but if the user
      // entered zero cases, call it incomplete.
      return null
    }

    // Additive smoothing, only relevant for super low case numbers
    const prevalence = (lastWeek + 1) / population
    return prevalence
  } catch (e) {
    return null
  }
}

export const calculateLocationPersonAverage = (
  data: CalculatorData,
): number | null => {
  // Prevalence

  const prevalence = calculateLocationReportedPrevalence(data)
  if (prevalence === null) {
    return null
  }

  try {
    const underreportingFactor = prevalenceRatio(
      data.positiveCasePercentage,
      data.prevalanceDataDate,
    )

    const delayFactor = Math.min(
      1 + Math.max(0, data.casesIncreasingPercentage / 100),
      MAX_DELAY_FACTOR,
    )

    // --------
    // Points for "random person from X location"
    const personRisk = prevalence * underreportingFactor * delayFactor

    return personRisk * ONE_MILLION
  } catch (e) {
    return null
  }
}

export const calculatePersonRiskEach = (
  data: CalculatorData,
): number | null => {
  try {
    const averagePersonRisk = calculateLocationPersonAverage(data)
    if (averagePersonRisk === null) {
      return null
    }

    if (data.riskProfile === RiskProfileEnum.HAS_COVID) {
      return ONE_MILLION
    } else if (data.riskProfile === RiskProfileEnum.ONE_PERCENT) {
      return (ONE_MILLION * 0.01) / 50
    } else if (data.riskProfile === RiskProfileEnum.DECI_PERCENT) {
      return (ONE_MILLION * 0.001) / 50
    } else if (data.riskProfile === '') {
      // If risk profile isn't selected, call it incomplete
      return null
    }

    const isHousemate =
      data.interaction === 'partner' || data.interaction === 'repeated'
    const unadjustedRisk =
      averagePersonRisk *
      personRiskMultiplier({
        riskProfile: RiskProfile[data.riskProfile],
        isHousemate,
        symptomsChecked: data.symptomsChecked,
      })

    if (
      // TODO: Support vaccinated risk for other Risk Profiles.
      data.riskProfile !== 'average' ||
      data.unvaccinatedPrevalenceRatio === null ||
      data.averageFullyVaccinatedMultiplier === null
    ) {
      return unadjustedRisk
    }

    switch (data.theirVaccine) {
      case 'vaccinated':
        return (
          unadjustedRisk *
          data.unvaccinatedPrevalenceRatio *
          data.averageFullyVaccinatedMultiplier
        )
      case 'unvaccinated':
        return unadjustedRisk * data.unvaccinatedPrevalenceRatio
      // falls through
      case 'undefined':
        return unadjustedRisk
      default:
        console.error(`Unrecognized vaccination state: ${data.theirVaccine}`)
        return null
    }
  } catch (e) {
    return null
  }
}

const getVaccineMultiplier = (data: CalculatorData): number | null => {
  if (data.yourVaccineType === '') {
    return 1
  }
  const vaccineMultiplierPerDose =
    Vaccines[data.yourVaccineType].multiplierPerDose
  if (
    data.yourVaccineDoses >= vaccineMultiplierPerDose.length ||
    data.yourVaccineDoses < 0
  ) {
    return null
  }
  return vaccineMultiplierPerDose[data.yourVaccineDoses]
}

export const calculateActivityRisk = (data: CalculatorData): number | null => {
  try {
    if (data.interaction === '') {
      return null
    }

    const vaccineMultiplier = getVaccineMultiplier(data)
    if (vaccineMultiplier === null) {
      return null
    }

    if (data.interaction === 'partner' || data.interaction === 'repeated') {
      return Interaction[data.interaction].multiplier * vaccineMultiplier
    }

    let multiplier = Interaction[data.interaction].multiplier

    if (data.duration === 0) {
      return null
    }
    // If something isn't selected, use the "baseline" value (indoor, unmasked,
    // undistanced, regular conversation)
    const mulFor = (
      table: { [key: string]: FormValue },
      given: string,
    ): number => (given === '' ? 1 : table[given].multiplier)

    let effectiveDuration = data.duration
    multiplier *= mulFor(Distance, data.distance)
    if (data.distance === 'intimate') {
      // Even a brief kiss probably has a non-trivial chance of transmission.
      effectiveDuration = Math.max(effectiveDuration, intimateDurationFloor)
    } else {
      if (data.distance !== 'close') {
        // Being outdoors only helps if you're not literally breathing each
        // others' exhalation.
        multiplier *= mulFor(Setting, data.setting)
      }
      // Talking modifiers not allowed when kissing.
      multiplier *= mulFor(Voice, data.voice)

      // You can't wear a mask if you're kissing!
      multiplier *= mulFor(TheirMask, data.theirMask)
      multiplier *= mulFor(YourMask, data.yourMask)
    }

    multiplier *= effectiveDuration / 60.0
    if (multiplier > MAX_ACTIVITY_RISK) {
      multiplier = MAX_ACTIVITY_RISK
    }

    return multiplier * vaccineMultiplier
  } catch (e) {
    return null
  }
}

export const calculate = (data: CalculatorData): CalculatorResult | null => {
  try {
    const personRiskEach = calculatePersonRiskEach(data)
    if (personRiskEach === null) {
      return null
    }

    // Activity risk
    const activityRisk = calculateActivityRisk(data)
    if (activityRisk === null) {
      return null
    }

    const pointsNaive = personRiskEach * data.personCount * activityRisk
    if (pointsNaive < MAX_POINTS) {
      return {
        expectedValue: pointsNaive,
        lowerBound: pointsNaive / ERROR_FACTOR,
        upperBound: pointsNaive * ERROR_FACTOR,
      }
    }

    const riskEach = personRiskEach * activityRisk * 1e-6
    const expectedValue =
      probabilityEventHappensAtLeastOnce(riskEach, data.personCount) * 1e6
    const lowerBound =
      probabilityEventHappensAtLeastOnce(
        riskEach / ERROR_FACTOR,
        data.personCount,
      ) * 1e6
    const upperBound =
      probabilityEventHappensAtLeastOnce(
        Math.min(1, riskEach * ERROR_FACTOR),
        data.personCount,
      ) * 1e6
    return { expectedValue, lowerBound, upperBound }
  } catch (e) {
    return null
  }
}

// Given an event that happens with probability |probabilityOfOnce| that is repeated |numberOfTimes|,
// return the probability that it happens at least once
// (e.g. an event has |probabilityOfOnce| chance of giving you covid and you do it |numberOfTimes|, how likely are you to get covid?)
const probabilityEventHappensAtLeastOnce = (
  probabilityOfOnce: number,
  numberOfTimes: number,
): number => {
  return 1 - (1 - probabilityOfOnce) ** numberOfTimes
}
