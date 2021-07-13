import { CalculatorData } from './calculate'

export type PartialData = Omit<
  CalculatorData,
  | 'riskBudget'
  | 'useManualEntry'
  | 'topLocation'
  | 'subLocation'
  | 'subSubLocation'
  | 'population'
  | 'casesPastWeek'
  | 'casesIncreasingPercentage'
  | 'positiveCasePercentage'
  | 'prevalanceDataDate'
  | 'percentFullyVaccinated'
  | 'unvaccinatedPrevalenceRatio'
  | 'averageFullyVaccinatedMultiplier'
  | 'yourVaccineType'
  | 'yourVaccineDoses'
>

export const prepopulated: {
  [key: string]: PartialData
} = {
  outdoorMasked2: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 2,
    symptomsChecked: 'no',

    setting: 'outdoor',
    distance: 'normal',
    duration: 60,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'outdoorMasked2',
  },

  indoorUnmasked2: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 2,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'normal',
    duration: 60,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'indoorUnmasked2',
  },

  '1person_15minCarRide': {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 1,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'normal',
    duration: 15,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: '1person_15minCarRide',
  },

  oneNightStand: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 1,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'intimate',
    duration: 600,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'oneNightStand',
  },

  liveInPartner_noContacts: {
    riskProfile: 'livingAlone',
    interaction: 'partner',
    personCount: 1,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'intimate',
    duration: 600,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'liveInPartner_noContacts',
  },

  '60minShopping': {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 5,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 60,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: '60minShopping',
  },

  '60minShoppingFew': {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 3,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 60,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: '60minShoppingFew',
  },

  '60minShoppingCrowded': {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 10,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 60,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: '60minShoppingCrowded',
  },

  planeRide: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 41,
    symptomsChecked: 'no',

    setting: 'plane',
    distance: 'sixFt',
    duration: 360,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: 'planeRide',
  },

  planeRideMiddleSeatEmpty: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 20,
    symptomsChecked: 'no',

    setting: 'plane',
    distance: 'sixFt',
    duration: 360,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: 'planeRideMiddleSeatEmpty',
  },

  restaurantOutdoors: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 15,
    symptomsChecked: 'no',

    setting: 'outdoor',
    distance: 'sixFt',
    duration: 90,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'restaurantOutdoors',
  },

  restaurantIndoors: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 15,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 90,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'restaurantIndoors',
  },

  bar: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 15,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 120,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'loud',
    theirVaccine: 'undefined',
    scenarioName: 'bar',
  },

  largeOutdoorParty: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 80,
    symptomsChecked: 'no',

    setting: 'outdoor',
    distance: 'normal',
    duration: 180,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'largeOutdoorParty',
  },

  smallIndoorParty25: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 25,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'normal',
    duration: 180,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'smallIndoorParty25',
  },

  outdoorMaskedWithCovidPositive: {
    riskProfile: 'hasCovid',
    interaction: 'oneTime',
    personCount: 1,
    symptomsChecked: 'no',

    setting: 'outdoor',
    distance: 'normal',
    duration: 60,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'outdoorMaskedWithCovidPositive',
  },

  indoorUnmaskedWithCovidPositive: {
    riskProfile: 'hasCovid',
    interaction: 'oneTime',
    personCount: 1,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'normal',
    duration: 60,
    theirMask: 'none',
    yourMask: 'none',
    voice: 'normal',
    theirVaccine: 'undefined',
    scenarioName: 'indoorUnmaskedWithCovidPositive',
  },

  votingInPerson: {
    riskProfile: 'average',
    interaction: 'oneTime',
    personCount: 2,
    symptomsChecked: 'no',

    setting: 'indoor',
    distance: 'sixFt',
    duration: 10,
    theirMask: 'basic',
    yourMask: 'basic',
    voice: 'silent',
    theirVaccine: 'undefined',
    scenarioName: 'votingInPerson',
  },
  custom: {
    // This special profile is applied to reset the rest of the calculator.
    // Keep at the end of this list.
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
    theirVaccine: 'undefined',
    scenarioName: 'custom',
  },
}
