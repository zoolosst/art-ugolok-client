export function dateFormat(date: `${string}-${string}-${string}`) {
  const [y, m, d] = date.split('-')
  return `${d}.${m}.${y}`
}
