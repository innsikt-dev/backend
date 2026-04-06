export type DashboardKpiCategoryTotal = {
  category: string
  amount: number
}

export type DashboardKpi = {
  totalIncidents: number
  mostActiveDistrict: string | null
  mostCommonCategory: string | null
  activeIncidents: number
}

export type DashboardIncident = {
  id: number
  municipality_name: string
  lat: number
  lng: number
  thread_id: string
  area: string
  text: string
  type: string
  created_on: string
  updated_on: string
  is_active: boolean
}

export type DashboardQueryResult = {
  totalCategories: DashboardKpiCategoryTotal[]
  kpi: DashboardKpi
  events: DashboardIncident[]
}
