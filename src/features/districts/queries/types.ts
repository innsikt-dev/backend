export type DistrictKPI = {
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

export type DistrictAnalytics = {
  trends: DistrictTrend[]
  categoryDistribution: CategoryDistribution[]
}
