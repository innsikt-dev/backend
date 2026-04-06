type AnalyticsHeatMap = {
  day: number
  time: number
  amount: number
}

type AnalyticsTrends = {
  date: Date
  category: string
  amount: number
}

type AnalyticsTopMunicipalities = {
  municipality_name: string
  amount: number
}

type AnalyticsCategoryDistribution = {
  category: string
  amount: number
}

export type AnalyticsQueryResult = {
  heatMap: AnalyticsHeatMap[]
  trends: AnalyticsTrends[]
  topMunicipalities: AnalyticsTopMunicipalities[]
  categoryDistribution: AnalyticsCategoryDistribution[]
}
