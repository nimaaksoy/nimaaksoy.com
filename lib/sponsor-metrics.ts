export function formatSponsorMetric(value: number | null | undefined) {
  const number = Number(value || 0);

  if (number >= 1_000_000) {
    return `${Math.floor(number / 100_000) / 10}m`;
  }

  if (number >= 1_000) {
    return `${Math.floor(number / 100) / 10}k`;
  }

  return String(number);
}
