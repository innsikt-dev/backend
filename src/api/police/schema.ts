import { z } from 'zod'

export const PoliceLogMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  category: z.string(),
  district: z.string(),
  municipality: z.string(),
  area: z.string(),
  isActive: z.boolean(),
  text: z.string(),
  createdOn: z.string(),
  updatedOn: z.string(),
  isEdited: z.boolean(),
})

export const PoliceLogResponseSchema = z.object({
  data: z.array(PoliceLogMessageSchema),
})

export type PoliceLogMessage = z.infer<typeof PoliceLogMessageSchema>
export type PoliceLogResponse = z.infer<typeof PoliceLogResponseSchema>
