# Timeweb/Dockploy и GitHub как source repository

`faska-art.com` обслуживается отдельным Docker Compose service в production
project `web-sites` на Timeweb/Dockploy.

- `main` — единственный source branch;
- `deploy/docker-compose.dokploy.yml` — production deployment contract;
- GitHub Pages отключён, ветка `gh-pages` отсутствует;
- Traefik принимает `faska-art.com` и `www.faska-art.com`, выдаёт TLS через
  Let’s Encrypt и передаёт трафик в nginx на внутренний port `8080`;
- контейнер не публикует host ports и разделяет с платформой только внешнюю
  сеть `dokploy-network`.

Прежний URL `larkinmd7-content/alina-ceramics/` не изменяется и остаётся
внешним rollback-артефактом до отдельного решения владельца.
