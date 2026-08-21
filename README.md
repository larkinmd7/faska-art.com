# faska-art.com

Публичный сайт-портфолио FASKA: керамика, мозаика и авторские предметы Алины.

## Owner и статус

- Product owner: Алина
- Technical owner: Михаил Ларькин
- Maturity: production
- Runtime: static
- Repository: https://github.com/larkinmd7/faska-art.com
- Production: https://faska-art.com
- Rollback route: https://larkinmd7.github.io/larkinmd7-content/alina-ceramics/

## Быстрый старт

Vite 8 требует Node.js 20.19+ или 22.12+.

```bash
cd site
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run dev
```

## Проверка

```bash
cd site
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build
```

## Карта

- `site/` — React/Vite-исходники;
- `Конкуренты/` — накопленные исследования рынка;
- `INDEX.md` — канонические связи CyberOS;
- `docs/decisions/` — устойчивые решения;
- `docs/production/паспорт.md` — production-контракт и rollback.
