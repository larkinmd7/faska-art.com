# FASKA site

React 19 + TypeScript + Vite 8 + Tailwind CSS 4. Production публикуется на GitHub Pages по адресу `https://faska-art.com`.

```bash
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build
```

Сборка появляется в `dist/`. Файл `public/CNAME` автоматически попадает в production-артефакт.
