export type Municipality = {
  municipality_name: string
  district_name: string
}

export type Incident = {
  id: string
  thread_id: string
  municipality_name: string
  category_name: string
  area: string
  is_active: boolean
  text: string
  created_on: string
  updated_on: string
  is_edited: boolean
}
