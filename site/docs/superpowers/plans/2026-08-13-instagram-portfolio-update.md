# Faska Art Instagram Portfolio Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить на сайт Алины сильную подборку новых предметных работ из официального Instagram, отдельную категорию интерьерной керамики и правильную ссылку `@faska.art`.

**Architecture:** Оригинальные изображения скачиваются из официальных Instagram-публикаций, проходят ручной визуальный отбор и сохраняются как оптимизированные WebP. Их происхождение фиксируется в JSON-manifest, а отображение подключается через существующие массивы `categories` и `works` в `src/data.ts`, без изменения архитектуры React-приложения.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Tailwind CSS 4, Node.js test runner, macOS `sips`, Playwright/браузерная проверка, GitHub Pages.

## Global Constraints

- Единственный источник новых фотографий — официальный Instagram `https://www.instagram.com/faska.art`.
- Цель — 8–10 визуально сильных предметных фотографий; допускается меньшая подборка только если остальные кандидаты не проходят критерии качества, с явным обоснованием в отчёте.
- Используются оригинальные изображения публикаций без интерфейса Instagram, текстовых плашек, водяных знаков, личных кадров, размытых объектов и визуальных дублей.
- Reels не используются; допустимы самостоятельные фотографии из обычных постов и каруселей.
- Веб-версии: WebP, максимальная сторона 1800 px, качество 84, исходные пропорции сохранены.
- Новая категория: ID `interior`, title `Интерьерная керамика`, slug `interernaya-keramika`.
- Категория содержит 6–8 разных крупных или декоративных предметов; фотографии чашек при необходимости относятся к `mugs`.
- Одна фотография не используется в нескольких категориях.
- Instagram URL в футере и контактах: `https://www.instagram.com/faska.art`.
- Существующая визуальная система сайта сохраняется; отдельный редизайн не выполняется.
- Для каждого добавленного изображения manifest хранит локальный файл, URL поста, дату публикации, категорию, название, alt и описание.

---

### Task 1: Curate, download, and validate Instagram media

**Files:**
- Create: `public/images/instagram-2026/*.webp`
- Create: `src/portfolio-sources.json`
- Create: `tests/portfolio-assets.test.mjs`

**Interfaces:**
- Consumes: официальный профиль `https://www.instagram.com/faska.art` и посты `DbEIZmijf48`, `DWWzgM4jVpU`, `DZifhefkYJb`.
- Produces: `src/portfolio-sources.json` — JSON-массив записей `{ id, file, sourceUrl, publishedAt, category, title, alt, description }`; `file` имеет вид `images/instagram-2026/<semantic-name>.webp`, а `category` равен `interior` или `mugs`.

- [ ] **Step 1: Write the failing asset-contract test**

Create `tests/portfolio-assets.test.mjs`:

```js
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

const manifestUrl = new URL('../src/portfolio-sources.json', import.meta.url)

test('curated Instagram assets have complete provenance and local WebP files', () => {
  assert.equal(existsSync(manifestUrl), true, 'portfolio-sources.json must exist')
  const entries = JSON.parse(readFileSync(manifestUrl, 'utf8'))
  assert.ok(entries.length >= 6 && entries.length <= 10)
  assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length)
  assert.equal(new Set(entries.map((entry) => entry.file)).size, entries.length)

  for (const entry of entries) {
    assert.match(entry.file, /^images\/instagram-2026\/[a-z0-9-]+\.webp$/)
    assert.match(entry.sourceUrl, /^https:\/\/www\.instagram\.com\/p\/[A-Za-z0-9_-]+\/$/)
    assert.match(entry.publishedAt, /^2026-\d{2}-\d{2}$/)
    assert.ok(['interior', 'mugs'].includes(entry.category))
    assert.ok(entry.title.length > 0)
    assert.ok(entry.alt.length > 0)
    assert.ok(entry.description.length > 0)
    assert.equal(existsSync(new URL(`../public/${entry.file}`, import.meta.url)), true)
  }
})

test('the selection centers interior objects and includes the verified hero candidate', () => {
  const entries = JSON.parse(readFileSync(manifestUrl, 'utf8'))
  assert.ok(entries.filter((entry) => entry.category === 'interior').length >= 6)
  assert.ok(entries.some((entry) => entry.id === 'blueberry-pitcher'))
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/portfolio-assets.test.mjs`

Expected: FAIL because `src/portfolio-sources.json` does not exist.

- [ ] **Step 3: Inspect the official feed and record the visual shortlist**

Use an authenticated browser in read-only mode. Inspect the known carousels and recent ordinary posts. Select sharp photographs where the ceramic object dominates the frame. The required hero candidate is the two-handled blueberry pitcher from `https://www.instagram.com/p/DbEIZmijf48/`; include the blueberry planter and one best moth-planter frame when their originals pass quality inspection. Exclude the blueberry earrings frame, the Tattoo Theme text-overlay cover, similar duplicate angles, Reels, people and process shots.

Record the accepted candidates directly as the final entries of `src/portfolio-sources.json`; do not create an untracked shortlist document.

- [ ] **Step 4: Download original image assets and convert them**

Download the accepted image resource URLs from the browser page assets. Save temporary originals outside the repository, then convert each selected image:

```bash
sips --resampleHeightWidthMax 1800 -s format webp -s formatOptions 84 INPUT_IMAGE --out public/images/instagram-2026/SEMANTIC_NAME.webp
```

If the installed `sips` cannot encode WebP, use an already-installed image converter such as `magick INPUT_IMAGE -resize '1800x1800>' -quality 84 OUTPUT.webp`. Preserve the same maximum dimension and quality target of 84. Do not use browser screenshots.

- [ ] **Step 5: Create the provenance manifest**

Create valid UTF-8 JSON at `src/portfolio-sources.json`. Use `blueberry-pitcher` as the hero entry ID. Give every accepted image a unique semantic ID and filename; write human-readable Russian `title`, `alt` and `description` grounded in the visible object.

- [ ] **Step 6: Verify GREEN and inspect media**

Run:

```bash
node --test tests/portfolio-assets.test.mjs
sips -g pixelWidth -g pixelHeight public/images/instagram-2026/*.webp
shasum -a 256 public/images/instagram-2026/*.webp
```

Expected: both tests PASS; every maximum dimension is at most 1800; every hash is unique.

Open every accepted WebP at original detail and confirm sharpness, no Instagram UI/text overlay, correct orientation, visible ceramic object and no near-duplicate composition.

- [ ] **Step 7: Commit**

```bash
git add src/portfolio-sources.json tests/portfolio-assets.test.mjs public/images/instagram-2026
git commit -m "Add curated Faska Art Instagram media"
```

### Task 2: Integrate the interior collection and correct Instagram contact

**Files:**
- Modify: `src/data.ts`
- Modify: `tests/social-links.test.mjs`
- Create: `tests/portfolio-data.test.mjs`

**Interfaces:**
- Consumes: every manifest entry from Task 1 with `{ id, file, sourceUrl, publishedAt, category, title, alt, description }`.
- Produces: one `WorkItem` per manifest entry, a new `Category` with ID `interior`, and `bio.contacts.instagram === 'https://www.instagram.com/faska.art'`.

- [ ] **Step 1: Write failing behavior tests**

Update the Instagram assertion in `tests/social-links.test.mjs` to expect `https://www.instagram.com/faska.art`.

Create `tests/portfolio-data.test.mjs`:

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const manifest = JSON.parse(readFileSync(new URL('../src/portfolio-sources.json', import.meta.url), 'utf8'))

test('the interior category has the agreed identity and blueberry hero cover', () => {
  assert.match(data, /id:\s*'interior',\s*title:\s*'Интерьерная керамика',\s*slug:\s*'interernaya-keramika'/)
  assert.match(data, /cover:\s*img\('images\/instagram-2026\/blueberry-pitcher\.webp'\)/)
})

test('every curated manifest item is exposed as a unique portfolio work', () => {
  for (const entry of manifest) {
    assert.match(data, new RegExp(`id:\\s*'${entry.id}'`))
    assert.match(data, new RegExp(`src:\\s*img\\('${entry.file.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}'\\)`))
    assert.match(data, new RegExp(`category:\\s*'${entry.category}'`))
  }
})
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/social-links.test.mjs tests/portfolio-data.test.mjs`

Expected: FAIL because the new category and works are absent and the current Instagram URL is `alinarrt`.

- [ ] **Step 3: Add the category, works, and correct URL**

In `src/data.ts`:

1. Add the `interior` category as the first category, with `cover: img('images/instagram-2026/blueberry-pitcher.webp')`.
2. Add one `WorkItem` for every manifest entry, copying `id`, `file`→`src`, `category`, `title`, `alt` and `description` exactly.
3. Keep every item in only its manifest category.
4. Change only `bio.contacts.instagram` to `https://www.instagram.com/faska.art`; retain the existing label and Telegram contact.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
node --test tests/*.test.mjs
npm run build
npx eslint src/data.ts tests/social-links.test.mjs tests/portfolio-data.test.mjs tests/portfolio-assets.test.mjs
```

Expected: all Node tests PASS, production build exits 0, targeted lint exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/data.ts tests/social-links.test.mjs tests/portfolio-data.test.mjs
git commit -m "Add interior ceramics portfolio collection"
```

### Task 3: Validate the integrated experience and prepare publication

**Files:**
- Modify only if a failing visual check reveals a regression: `src/App.tsx`, `src/components/CategoryCards.tsx`, `src/components/Gallery.tsx`, `src/components/Lightbox.tsx`, `src/components/Footer.tsx`, `src/index.css`
- Test: `tests/*.test.mjs`

**Interfaces:**
- Consumes: the integrated `categories`, `works`, contacts and WebP media from Tasks 1–2.
- Produces: verified local production build suitable for the existing GitHub Pages target `/larkinmd7-content/alina-ceramics/`.

- [ ] **Step 1: Run the complete non-visual verification**

```bash
node --test tests/*.test.mjs
npm run build
npx eslint src/data.ts src/App.tsx src/components/CategoryCards.tsx src/components/Footer.tsx tests/*.test.mjs
```

Expected: all tests PASS, build exits 0 and lint exits 0. Run `npm run lint` additionally and record the known pre-existing `react-hooks/set-state-in-effect` result from `src/components/Gallery.tsx` separately if still present.

- [ ] **Step 2: Start the built site and inspect desktop**

Run `npm run dev -- --host 127.0.0.1` and confirm an HTTP 200 response before sharing or opening the localhost URL.

At 1440×1000 verify:

- `Интерьерная керамика` appears in the portfolio grid with the blueberry pitcher cover;
- the category opens and shows only its assigned 6–8 works;
- every image loads, preserves a natural composition and opens in the lightbox;
- Instagram in contacts and footer opens `https://www.instagram.com/faska.art`;
- existing categories and Telegram still work.

- [ ] **Step 3: Inspect mobile**

At 390×844 verify no horizontal overflow, no clipped category title, no broken image, usable lightbox controls and readable footer/contact links. Check the browser console for errors.

- [ ] **Step 4: Fix only observed regressions with TDD**

If a regression is found, first add a failing Node or Playwright check reproducing the visible behavior, run it to confirm RED, make the smallest component/CSS change, then re-run it to GREEN plus the full commands from Step 1. If no regression is found, do not modify components or CSS.

- [ ] **Step 5: Commit any verified integration fix**

If Step 4 changed files:

```bash
git add src tests
git commit -m "Fix Faska Art portfolio integration"
```

If Step 4 changed nothing, record the verification evidence in the task report without creating an empty commit.

### Task 4: Publish and smoke-test GitHub Pages

**Files:**
- No source files expected.
- Publish: contents of `dist/` to the existing `larkinmd7-content` repository under `alina-ceramics/`.

**Interfaces:**
- Consumes: verified `dist/` output from Task 3.
- Produces: live site at `https://larkinmd7.github.io/larkinmd7-content/alina-ceramics/`.

- [ ] **Step 1: Rebuild from the reviewed branch**

Run:

```bash
node --test tests/*.test.mjs
npm run build
```

Expected: all tests PASS and build exits 0 immediately before publication.

- [ ] **Step 2: Publish through a temporary clone**

Create a temporary directory with `mktemp -d`, clone the existing `larkinmd7-content` repository, replace only its `alina-ceramics/` directory with the current `dist/` contents, inspect `git diff --stat`, commit and push. Preserve every other published project. Remove the temporary clone after successful push.

- [ ] **Step 3: Verify the live site**

After GitHub Pages updates, request `https://larkinmd7.github.io/larkinmd7-content/alina-ceramics/` until it returns the new hashed assets. At desktop and 390×844 verify the new category, all new images, lightbox, footer/contact Instagram URL, lack of horizontal overflow and lack of console errors.

- [ ] **Step 4: Record publication evidence**

Record the source branch commit, the `larkinmd7-content` publication commit, live URL, HTTP status, tested viewports and console result in the task report. Do not create a source commit solely for the report because SDD reports live in the ignored workspace.
