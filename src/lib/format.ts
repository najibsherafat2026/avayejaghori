/** Persian/Dari formatting and search helpers shared by all screens. */

const faNumber = new Intl.NumberFormat('fa-AF')

export const toFaDigits = (value: number | string) =>
  typeof value === 'number'
    ? faNumber.format(value)
    : value.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

/** Solar Hijri (Shamsi) date, e.g. «۲۷ عقرب ۱۴۰۵». */
export function formatShamsi(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fa-AF-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat('fa-AF', { weekday: 'long' }).format(date)
}

/** Lunar Hijri date (Umm al-Qura calculation, approximate by ±1 day). */
export function formatHijri(date: Date) {
  return new Intl.DateTimeFormat('fa-AF-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatGregorian(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Normalises Persian/Arabic text for search: unifies ی/ي/ى and ک/ك,
 * strips diacritics, tatweel and zero-width non-joiners, converts digits.
 */
export function normalizeFa(text: string) {
  return text
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀة]/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/‌/g, ' ')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export const matchesQuery = (query: string, ...fields: string[]) => {
  const q = normalizeFa(query)
  if (!q) return true
  const hay = normalizeFa(fields.join(' '))
  return q.split(' ').every((word) => hay.includes(word))
}

export const heroImage = (width: number) =>
  `/.netlify/images?url=/img/hero.png&w=${width}&fm=webp&q=75`
