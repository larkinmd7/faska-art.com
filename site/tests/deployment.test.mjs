import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')
const nginx = readFileSync(new URL('../deploy/nginx.conf', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const composeUrl = new URL('../../deploy/docker-compose.dokploy.yml', import.meta.url)
const compose = readFileSync(composeUrl, 'utf8')

test('the custom-domain build uses the domain root', () => {
  assert.match(viteConfig, /base:\s*['"]\/["']/)
  assert.doesNotMatch(viteConfig, /larkinmd7-content|alina-ceramics/)
})

test('GitHub Pages metadata is absent', () => {
  assert.equal(existsSync(new URL('../public/CNAME', import.meta.url)), false)
})

test('the production image builds the site and serves it with nginx', () => {
  assert.match(dockerfile, /FROM node:22\.22-alpine AS build/)
  assert.match(dockerfile, /FROM nginxinc\/nginx-unprivileged:1\.28-alpine/)
  assert.match(nginx, /listen 8080/)
  assert.match(nginx, /try_files \$uri \$uri\/ \/index\.html/)
  assert.match(nginx, /location = \/healthz/)
})

test('Dockploy routes the isolated compose service through Traefik', () => {
  assert.match(compose, /services:\s*\n\s*faska-art:/)
  assert.match(compose, /Host\(`faska-art\.com`\)/)
  assert.match(compose, /loadbalancer\.server\.port=8080/)
  assert.doesNotMatch(compose, /ports:/)
})

test('the server build uses host networking while runtime stays isolated', () => {
  const rendered = JSON.parse(execFileSync(
    'docker',
    ['compose', '-f', fileURLToPath(composeUrl), 'config', '--format', 'json'],
    { encoding: 'utf8' },
  ))

  assert.equal(rendered.services['faska-art'].build.network, 'host')
  assert.deepEqual(rendered.services['faska-art'].networks, { 'dokploy-network': null })
  assert.equal(rendered.services['faska-art'].ports, undefined)
})

test('plain HTTP is permanently redirected to HTTPS by Traefik', () => {
  const rendered = JSON.parse(execFileSync(
    'docker',
    ['compose', '-f', fileURLToPath(composeUrl), 'config', '--format', 'json'],
    { encoding: 'utf8' },
  ))
  const labels = rendered.services['faska-art'].labels

  assert.equal(labels['traefik.http.routers.faska-art-http.entrypoints'], 'web')
  assert.equal(labels['traefik.http.routers.faska-art-http.middlewares'], 'faska-art-https')
  assert.equal(labels['traefik.http.middlewares.faska-art-https.redirectscheme.scheme'], 'https')
  assert.equal(labels['traefik.http.middlewares.faska-art-https.redirectscheme.permanent'], 'true')
})

test('the page metadata identifies the FASKA site', () => {
  assert.match(html, /<title>FASKA — керамика ручной работы<\/title>/)
  assert.match(html, /<meta name="description"/)
})

test('the home portrait is optimized without dropping the JPEG fallback', () => {
  assert.equal(existsSync(new URL('../public/images/IMG_9127-home.avif', import.meta.url)), true)
  assert.match(app, /IMG_9127-home\.avif/)
  assert.match(app, /IMG_9127\.JPG/)
  assert.match(app, /width="600"/)
  assert.match(app, /height="800"/)
})

test('interface fonts are local, licensed, and do not block on Google Fonts', () => {
  const fontFiles = [
    'forum-cyrillic.woff2',
    'forum-latin.woff2',
    'roboto-cyrillic.woff2',
    'roboto-latin.woff2',
    'OFL-Forum.txt',
    'OFL-Roboto.txt',
  ]

  for (const fontFile of fontFiles) {
    assert.equal(existsSync(new URL(`../public/fonts/${fontFile}`, import.meta.url)), true)
  }

  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/)
  assert.match(css, /\/fonts\/forum-cyrillic\.woff2/)
  assert.match(css, /\/fonts\/roboto-cyrillic\.woff2/)
})
