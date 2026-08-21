import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')
const cname = readFileSync(new URL('../public/CNAME', import.meta.url), 'utf8').trim()
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('the custom-domain build uses the domain root', () => {
  assert.match(viteConfig, /base:\s*['"]\/["']/)
  assert.doesNotMatch(viteConfig, /larkinmd7-content|alina-ceramics/)
})

test('the GitHub Pages artifact carries the canonical domain', () => {
  assert.equal(cname, 'faska-art.com')
})

test('the page metadata identifies the FASKA site', () => {
  assert.match(html, /<title>FASKA — керамика ручной работы<\/title>/)
  assert.match(html, /<meta name="description"/)
})
