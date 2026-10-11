# SelfPlan 2.0 (event-buddy-new)

- Na začátku session přečti `../event-buddy/project/session-state.md`; na konci ho aktualizuj a přidej záznam do `../event-buddy/personal/token-log.md` (formát v `../eventbuddy/CLAUDE.md` §5).
- Rozhodnutí o stacku: `../event-buddy/project/v2-stack-and-infra.md` (Nuxt 4, TypeScript, PostgreSQL, online platební brána). Hosting zatím otevřený – kód držet přenositelný (Docker, konfigurace přes ENV, S3 API).
- UI: používej jen komponenty `Sp*` a tokeny `--sp-*` z `packages/ui`. Žádné nové barvy mimo `tokens.css`. Vzhled musí zůstat shodný se starým SelfPlanem.
- Zadání modulů: `/Users/jaklik/Downloads/SelfPlan - vývoj`. Při rozporu platí novější dodatek; položky „OTEVŘENO“ v kódu nefixovat.
- Komunikace: `/caveman` styl, ale dokumenty a komentáře v kódu piš normálně.
