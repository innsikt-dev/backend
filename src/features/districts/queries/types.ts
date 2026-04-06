export type DistrictKPIQueryResult = {
  district_name: string
  total_incidents: number
  active: number
  top_category: string
}

export type DistrictTrend = {
  district_name: string
  amount: number
  date: string
}
export type CategoryDistribution = {
  category: string
  amount: number
}

export type DistrictAnalyticsQueryResult = {
  trends: DistrictTrend[]
  categoryDistribution: CategoryDistribution[]
}
