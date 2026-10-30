# Bezpečnostní kontroly API

Automatické kontroly, které doplňují testy v `apps/api/test`. Nenahrazují ruční penetrační test před ostrým provozem.

## Závislosti a image

```
pnpm audit --prod
docker compose -f docker-compose.prod.yml build
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image \
  --severity HIGH,CRITICAL --ignore-unfixed selfplan-prod-api selfplan-prod-web
```

`--ignore-unfixed` vynechá nálezy, pro které zatím neexistuje oprava. Nálezy ve frontendových nástrojích (`simple-git`, `undici`
a podobně) jsou jen v build toolchainu Nuxtu; produkční image `web` obsahuje pouze výstup `.output` a ty v něm nejsou.

## Dynamický sken OWASP ZAP

Sken posílá útočné vstupy, proto **jen proti lokálnímu nebo stagingovému prostředí s testovacími daty**, nikdy proti produkci.

1. Spusť API s vypnutými limity, které by scanner okamžitě zablokovaly (rate limit, zamčení účtu):
   ```
   RATE_LIMIT_GLOBAL_PER_MIN=1000000 RATE_LIMIT_AUTH_PER_MIN=1000000 LOGIN_MAX_FAILURES=1000000
   ```
   (v override souboru compose, jen pro tento sken).
2. ZAP musí být ve stejné docker síti (`selfplan-prod_default`) a posílat hlavičku `x-sp-csrf: 1`, jinak jsou všechny změny
   stavu zamítnuty ochranou CSRF a sken se nedostane k logice:
   ```
   docker run --rm --network selfplan-prod_default -v "$PWD/apps/api/security:/zap/wrk:rw" \
     ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py -t /zap/wrk/openapi.public.yaml -f openapi \
     -r zap-report.html -J zap-report.json -I \
     -z "-config replacer.full_list(0).description=csrf -config replacer.full_list(0).enabled=true \
         -config replacer.full_list(0).matchtype=REQ_HEADER -config replacer.full_list(0).matchstr=x-sp-csrf \
         -config replacer.full_list(0).replacement=1"
   ```
3. Reporty `zap-report.*` necommituj.

`openapi.public.yaml` je psaný ručně. Při změně endpointů ho aktualizuj.

## Co skenery nenajdou
Autorizaci objekt po objektu (IDOR/BOLA), obchodní logiku a zneužití několika kroků. To vyžaduje ruční testování.
