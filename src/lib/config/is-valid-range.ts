const validPeriods = ['7d', '30d', '365d'] as const
type validPeriod = (typeof validPeriods)[number]

export function isValidRange(period: string): validPeriod {
  return (validPeriods as readonly string[]).includes(period)
    ? (period as validPeriod)
    : '7d'
}
