# faska-art.com — правила работы агента

## Назначение и границы

Публичный сайт-портфолио FASKA для керамической студии Алины.
Владелец продукта — Алина; технический owner — Михаил Ларькин.

Зрелость: `production`.
Runtime: `static`.

## Вход в задачу

1. Прочитать `README.md`, `project.yaml` и `docs/production/паспорт.md`.
2. Проверить `git status`, ветку и чужие изменения.
3. До изменения поведения запустить baseline: test, lint, build.
4. Не читать и не выводить secrets.
5. Перед deploy, DNS, migration или deletion пройти production gate.

## Команды

```text
setup:  cd site && PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
dev:    cd site && PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run dev
lint:   cd site && PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint
test:   cd site && PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test
build:  cd site && PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build
smoke:  HTTP 200 + desktop/mobile browser check + no console errors
```

## Git и release

- `main` хранит исходники и контракты проекта.
- `gh-pages` хранит только собранный `site/dist` и публикуется из корня GitHub Pages.
- Одна задача = одна короткоживущая ветка `codex/*` = один PR.
- Без force push, прямых правок production-артефакта и удаления legacy-маршрута без отдельного решения.

## Инварианты

- Production-ассеты работают от корня custom domain; `vite.config.ts` сохраняет `base: '/'`.
- `site/public/CNAME` содержит только `faska-art.com` и попадает в каждую production-сборку.
- Фото и публичные контакты не заменяются без согласования с владельцем продукта.

## Definition of Done

- `npm test`, `npm run lint` и `npm run build` зелёны на поддерживаемой версии Node;
- production URL отвечает 200, HTTPS включён;
- desktop и mobile smoke-check не выявили overflow и console errors;
- release и rollback revision зафиксированы в production-паспорте.
