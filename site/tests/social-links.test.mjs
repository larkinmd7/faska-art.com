import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const footer = readFileSync(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8')
const header = readFileSync(new URL('../src/components/Header.tsx', import.meta.url), 'utf8')

test('Instagram and Telegram are both available on the contacts page', () => {
  assert.match(data, /instagram:\s*'https:\/\/www\.instagram\.com\/alinarrt'/)
  assert.match(app, /bio\.contacts\.instagram/)
  assert.match(app, /bio\.contacts\.telegram/)
})

test('Instagram and Telegram are both available in the footer', () => {
  assert.match(footer, /bio\.contacts\.instagram/)
  assert.match(footer, /bio\.contacts\.telegram/)
})

test('Faska Art branding and browser icons exist in the public build inputs', () => {
  assert.match(header, /Faska Art/)
  assert.match(header, /brand\/faska-art-mark\.svg/)
  assert.match(footer, /Faska Art/)
  assert.equal(existsSync(new URL('../public/brand/faska-art-mark.svg', import.meta.url)), true)
  assert.equal(existsSync(new URL('../public/favicon.ico', import.meta.url)), true)
  assert.equal(existsSync(new URL('../public/favicon-32.png', import.meta.url)), true)
  assert.equal(existsSync(new URL('../public/apple-touch-icon.png', import.meta.url)), true)
})
