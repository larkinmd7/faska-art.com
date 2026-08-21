# GitHub Pages и custom domain

Сайт публикуется из отдельного репозитория `larkinmd7/faska-art.com`.

Общий Pages-репозиторий `larkinmd7-content` не используется как production owner домена: GitHub задаёт custom domain на весь Pages-сайт репозитория, а не на отдельную папку.

- `main` — source и project contract;
- `gh-pages` — содержимое production-сборки;
- `site/public/CNAME` — каноническое имя `faska-art.com`;
- Vite `base` — `/`, так как сайт живёт в корне custom domain.

Прежний URL в `larkinmd7-content/alina-ceramics/` не удаляется до отдельного решения и служит внешним rollback-артефактом.
