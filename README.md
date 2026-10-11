# SelfPlan 2.0

Přepis SelfPlan.cz (původně Rails) na TypeScript / Nuxt 4. Zadání a rozhodnutí: `../event-buddy/project/` (`v2-spec-digest.md`, `v2-gap-analysis.md`, `v2-stack-and-infra.md`).

## Struktura
```
apps/web          Nuxt 4 aplikace (stránky, layout, /styleguide)
packages/ui       Nuxt layer: design tokeny, základní CSS, komponenty Sp*
docs/             ADR a runbooky (zatím prázdné)
```

## Příkazy
```
pnpm install
pnpm dev           # http://localhost:3000, styleguide na /styleguide
pnpm build
pnpm typecheck
```
Vyžaduje Node ≥ 22 a pnpm 10.

## Design system
Tokeny: `packages/ui/app/assets/css/tokens.css` (jediný zdroj barev, fontů, radiusů, stínů, rozestupů). Komponenty nikdy nepoužívají surové hodnoty, jen `var(--sp-*)`.
Hodnoty jsou převzaté 1:1 ze starého projektu. Odchylky jsou označené `NEW` v `tokens.css` (tmavý text na béžových plochách kvůli kontrastu WCAG AA).
