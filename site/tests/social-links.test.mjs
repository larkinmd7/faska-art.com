import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const footer = readFileSync(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8')

test('Instagram and Telegram are both available on the contacts page', () => {
  assert.match(data, /instagram:\s*'https:\/\/www\.instagram\.com\/alinarrt'/)
  assert.match(app, /bio\.contacts\.instagram/)
  assert.match(app, /bio\.contacts\.telegram/)
})

test('Instagram and Telegram are both available in the footer', () => {
  assert.match(footer, /bio\.contacts\.instagram/)
  assert.match(footer, /bio\.contacts\.telegram/)
})

test('the referenced favicon exists in the public build inputs', () => {
  assert.equal(existsSync(new URL('../public/favicon.svg', import.meta.url)), true)
})
