const validPeriods = ['7d', '30d', '365d'] as const
type ValidRange = (typeof validPeriods)[number]

export function isValidRange(period: string): ValidRange {
  return (validPeriods as readonly string[]).includes(period)
    ? (period as ValidRange)
    : '7d'
}
