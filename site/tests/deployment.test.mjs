import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8')
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8')
const nginx = readFileSync(new URL('../deploy/nginx.conf', import.meta.url), 'utf8')
const compose = readFileSync(new URL('../../deploy/docker-compose.dokploy.yml', import.meta.url), 'utf8')

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

test('the page metadata identifies the FASKA site', () => {
  assert.match(html, /<title>FASKA — керамика ручной работы<\/title>/)
  assert.match(html, /<meta name="description"/)
})
