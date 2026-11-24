const relativeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
})

const units: { unit: Intl.RelativeTimeFormatUnit; milliseconds: number }[] = [
  { unit: "year", milliseconds: 1000 * 60 * 60 * 24 * 365 },
  { unit: "month", milliseconds: 1000 * 60 * 60 * 24 * 30 },
  { unit: "week", milliseconds: 1000 * 60 * 60 * 24 * 7 },
  { unit: "day", milliseconds: 1000 * 60 * 60 * 24 },
  { unit: "hour", milliseconds: 1000 * 60 * 60 },
  { unit: "minute", milliseconds: 1000 * 60 },
  { unit: "second", milliseconds: 1000 },
]

export function formatRelativeTime(date: Date) {
  const difference = date.getTime() - Date.now()
  const absolute = Math.abs(difference)

  for (const { unit, milliseconds } of units) {
    if (absolute >= milliseconds || unit === "second") {
      return relativeFormatter.format(
        Math.round(difference / milliseconds),
        unit
      )
    }
  }

  return "now"
}
