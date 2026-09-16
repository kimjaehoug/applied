import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storeFile = path.join(__dirname, 'data', 'site-content.json')

export function normalizeLocale(locale) {
  return locale === 'ko' ? 'ko' : 'en'
}

/** True when value is an { en?, ko? } bag (not a normal content object/array). */
export function isLocaleBag(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  if (!keys.length) return false
  return keys.every((k) => k === 'en' || k === 'ko')
}

export function pickLocaleContent(value, locale) {
  const loc = normalizeLocale(locale)
  if (isLocaleBag(value)) {
    if (value[loc] !== undefined) return value[loc]
    if (value.en !== undefined) return value.en
    if (value.ko !== undefined) return value.ko
    return undefined
  }
  // Legacy flat content: treat as English default
  if (loc === 'en') return value
  return undefined
}

export function setLocaleContent(existing, locale, content) {
  const loc = normalizeLocale(locale)
  const bag = isLocaleBag(existing)
    ? { ...existing }
    : existing === undefined
      ? {}
      : { en: existing }
  bag[loc] = content
  return bag
}

async function readStore() {
  try {
    const raw = await fs.readFile(storeFile, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(storeFile), { recursive: true })
  await fs.writeFile(storeFile, JSON.stringify(store, null, 2), 'utf8')
}

export async function getPageBag(page) {
  const store = await readStore()
  return store[page] || {}
}

export async function getPageContent(page, locale = 'en') {
  const pageData = await getPageBag(page)
  const loc = normalizeLocale(locale)
  const out = {}
  for (const [section, value] of Object.entries(pageData)) {
    const picked = pickLocaleContent(value, loc)
    if (picked !== undefined) out[section] = picked
  }
  return out
}

export async function savePageLocaleBag(page, section, bag) {
  const store = await readStore()
  if (!store[page]) store[page] = {}
  store[page][section] = bag
  await writeStore(store)
  return bag
}

export async function savePageSection(page, section, content, locale = 'en') {
  const store = await readStore()
  if (!store[page]) store[page] = {}
  const nextBag = setLocaleContent(store[page][section], locale, content)
  store[page][section] = nextBag
  await writeStore(store)
  return pickLocaleContent(nextBag, locale)
}
