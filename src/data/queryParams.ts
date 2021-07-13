import { isEmpty, pickBy } from 'lodash'
import { QueryParamConfigMap } from 'serialize-query-params'
import { NumberParam, StringParam } from 'use-query-params'

import { CalculatorData, QueryData, defaultValues } from './calculate'

export const queryConfig: QueryParamConfigMap = {
  riskBudget: NumberParam,

  useManualEntry: NumberParam,
  topLocation: StringParam,
  subLocation: StringParam,
  subSubLocation: StringParam,
  population: StringParam,
  casesPastWeek: NumberParam,
  casesIncreasingPercentage: NumberParam,
  positiveCasePercentage: NumberParam,

  riskProfile: StringParam,
  interaction: StringParam,
  personCount: NumberParam,

  setting: StringParam,
  distance: StringParam,
  duration: NumberParam,
  theirMask: StringParam,
  yourMask: StringParam,
  voice: StringParam,

  yourVaccineDoses: NumberParam,
  yourVaccineType: StringParam,

  theirVaccine: StringParam,

  scenarioName: StringParam,
}

export const filterParams = (data: CalculatorData): QueryData => {
  const filtered = pickBy(data, (v, k) => {
    const fk = k as keyof CalculatorData
    return k in queryConfig && v !== defaultValues[fk]
  })

  if (data.useManualEntry === 0) {
    // Remove data that will be fetched if location is set.
    delete filtered.population
    delete filtered.casesPastWeek
    delete filtered.casesIncreasingPercentage
    delete filtered.positiveCasePercentage
  }

  return filtered
}

// Choose between data from the query params or localstorage.
// This method returns queryData if any valid key exists, otherwise, it returns calcData
export const useQueryDataIfPresent = (
  queryData: QueryData,
  calcData: CalculatorData,
): CalculatorData => {
  const queryDataFiltered = pickBy(queryData, (v) => v !== undefined)
  if (isEmpty(queryDataFiltered)) {
    return calcData
  } else {
    return { ...defaultValues, ...queryDataFiltered }
  }
}
