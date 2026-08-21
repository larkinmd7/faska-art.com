import assert from 'node:assert/strict'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { after, before, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const imagesDirUrl = new URL('../public/images/', import.meta.url)
const optimizedDirUrl = new URL('../public/images/optimized/', import.meta.url)
const originals = readdirSync(imagesDirUrl)
  .filter(file => /\.jpe?g$/i.test(file))

let vite
let CategoryCards
let Gallery
let Lightbox
let categories
let works

before(async () => {
  vite = await createServer({
    root: fileURLToPath(new URL('../', import.meta.url)),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  })

  ;({ default: CategoryCards } = await vite.ssrLoadModule('/src/components/CategoryCards.tsx'))
  ;({ default: Gallery } = await vite.ssrLoadModule('/src/components/Gallery.tsx'))
  ;({ default: Lightbox } = await vite.ssrLoadModule('/src/components/Lightbox.tsx'))
  ;({ categories, works } = await vite.ssrLoadModule('/src/data.ts'))
})

after(async () => {
  await vite?.close()
})

test('every portfolio JPEG has lightweight thumbnail and lightbox AVIF variants', () => {
  assert.ok(originals.length > 0)

  let optimizedBytes = 0
  for (const original of originals) {
    const stem = original.replace(/\.jpe?g$/i, '')
    const variants = [
      { suffix: 'thumb', maxBytes: 100_000 },
      { suffix: 'full', maxBytes: 300_000 },
    ]

    for (const { suffix, maxBytes } of variants) {
      const variantUrl = new URL(`${stem}-${suffix}.avif`, optimizedDirUrl)
      assert.equal(existsSync(variantUrl), true, `${original} is missing ${suffix} AVIF`)

      const size = statSync(fileURLToPath(variantUrl)).size
      assert.ok(size <= maxBytes, `${original} ${suffix} AVIF is ${size} bytes`)
      optimizedBytes += size
    }
  }

  assert.ok(optimizedBytes <= 5_000_000, `optimized image set is ${optimizedBytes} bytes`)
})

test('category cards render AVIF thumbnails with JPEG fallbacks', () => {
  const markup = renderToStaticMarkup(createElement(CategoryCards, {
    categories: [categories[0]],
    onSelect: () => {},
    large: true,
  }))

  assert.match(markup, /srcSet="\/images\/optimized\/IMG_9031-thumb\.avif"/)
  assert.match(markup, /src="\/images\/IMG_9031\.jpg"/)
})

test('gallery renders AVIF thumbnails with JPEG fallbacks', () => {
  const markup = renderToStaticMarkup(createElement(Gallery, {
    items: [works[0]],
    onImageClick: () => {},
  }))

  assert.match(markup, /srcSet="\/images\/optimized\/1-thumb\.avif"/)
  assert.match(markup, /src="\/images\/1\.jpg"/)
})

test('lightbox renders a larger AVIF with a JPEG fallback', () => {
  const markup = renderToStaticMarkup(createElement(Lightbox, {
    items: [works[0]],
    index: 0,
    onClose: () => {},
    onNavigate: () => {},
  }))

  assert.match(markup, /srcSet="\/images\/optimized\/1-full\.avif"/)
  assert.match(markup, /src="\/images\/1\.jpg"/)
})
