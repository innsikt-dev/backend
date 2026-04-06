export type Payload = {
  id1: string
  id2: string
  period?: string
  perCapita?: string
}

type ExploreKeywordIncidents = {
  municipality_name: string
  category: string
  amount: number
}

type ExploreIncidentsOverTime = {
  municipality_name: string
  date: Date
  amount: number
}

export type ExploreAnalyticsQueryResult = {
  keywordIncidents: ExploreKeywordIncidents[]
  incidentsOverTime: ExploreIncidentsOverTime[]
}

export type Municipality = {
  municipality_name: string
  district_name: string
  total_incidents: number
  most_common_category: 'Trafikk'
  avg_per_day: number
}

export type MunicipalityQueryResult = {
  municipalityOne: MunicipalityQueryResult
  municipalityTwo: MunicipalityQueryResult
}
export type MunicipalityNamesQueryResult = string
