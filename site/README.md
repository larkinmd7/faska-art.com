# FASKA site

React 19 + TypeScript + Vite 8 + Tailwind CSS 4. Production собирается в Docker
и публикуется через Timeweb/Dockploy по адресу `https://faska-art.com`.

```bash
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm ci
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint
PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run build
```

Сборка появляется в `dist/`. GitHub используется только как source repository;
GitHub Pages и файл `CNAME` не используются.
