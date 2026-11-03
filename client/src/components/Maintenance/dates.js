// Date locale au format AAAA-MM-JJ (format d'échange avec le serveur, sans passer par l'UTC)
export function toLocalISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const j = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${j}`
}

// Affichage uniquement : AAAA-MM-JJ → JJ/MM/AAAA
export function toFrenchDate(isoDate) {
  const [y, m, j] = isoDate.split('-')
  return `${j}/${m}/${y}`
}

// Semaine du lundi au vendredi.
// Samedi et dimanche → semaine qui vient de se terminer.
export function getWeekRange(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday)
  const friday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4)
  return {
    firstday: toLocalISODate(monday),
    lastday: toLocalISODate(friday),
  }
}
