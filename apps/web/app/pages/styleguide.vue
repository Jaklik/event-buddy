<script setup lang="ts">
useSeoMeta({ title: 'Design system – SelfPlan', robots: 'noindex' })

/* ---------- token tables ---------- */
const colorGroups = [
  { title: 'Brand a akce', tokens: ['primary', 'primary-hover', 'brand', 'brand-hover', 'brand-soft', 'brand-strong', 'on-brand', 'on-primary'] },
  { title: 'Text', tokens: ['text', 'text-strong', 'text-secondary', 'text-muted', 'text-warm', 'text-brown'] },
  { title: 'Plochy a linky', tokens: ['bg', 'bg-neutral', 'bg-warm', 'bg-warm-strong', 'bg-input', 'bg-subtle', 'line', 'line-strong', 'border'] },
  { title: 'Stavy', tokens: ['success', 'danger', 'warning', 'success-bg', 'danger-bg', 'warning-bg', 'star', 'star-off'] },
]
const resolved = reactive<Record<string, string>>({})
onMounted(() => {
  const cs = getComputedStyle(document.documentElement)
  for (const g of colorGroups) for (const t of g.tokens) resolved[t] = cs.getPropertyValue(`--sp-color-${t}`).trim()
})

/* contrast pairs (WCAG 2.2 AA: 4.5:1 text, 3:1 large text/UI) */
const pairs = [
  { fg: 'on-primary', bg: 'primary', note: 'Text na CTA tlačítku' },
  { fg: 'on-primary', bg: 'primary-hover', note: 'CTA hover' },
  { fg: 'on-brand', bg: 'brand', note: 'Text na brand ploše (NOVÉ)' },
  { fg: 'brand-strong', bg: 'brand-soft', note: 'Badge' },
  { fg: 'text', bg: 'bg', note: 'Základní text' },
  { fg: 'text-secondary', bg: 'bg', note: 'Sekundární text' },
  { fg: 'text-secondary', bg: 'bg-warm', note: 'Sekundární na teplé ploše' },
  { fg: 'text-muted', bg: 'bg', note: 'Tlumený text / placeholder (jen doplňkový)' },
  { fg: 'primary', bg: 'bg', note: 'Odkaz' },
  { fg: 'danger', bg: 'bg', note: 'Chyba' },
]
function parse(c: string): [number, number, number] | null {
  const el = document.createElement('span')
  el.style.color = c
  document.body.appendChild(el)
  const m = getComputedStyle(el).color.match(/[\d.]+/g)
  el.remove()
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : null
}
function lum([r, g, b]: [number, number, number]) {
  const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratios = reactive<Record<string, string>>({})
onMounted(() => {
  for (const p of pairs) {
    const a = parse(`var(--sp-color-${p.fg})`), b = parse(`var(--sp-color-${p.bg})`)
    if (!a || !b) continue
    const [hi, lo] = [Math.max(lum(a), lum(b)), Math.min(lum(a), lum(b))]
    ratios[`${p.fg}/${p.bg}`] = ((hi + 0.05) / (lo + 0.05)).toFixed(2)
  }
})
const aa = (k: string) => Number(ratios[k]) >= 4.5

const radii = [['input', '8px'], ['sm', '0.5rem'], ['md', '1rem'], ['image', '12px'], ['hero', '20px'], ['lg', '2rem'], ['pill', '24px'], ['full', '50%']]
const shadows = ['card', 'image', 'bar', 'modal', 'sm']
const spaces = [0, 1, 2, 3, 4, 5]

/* ---------- demo state ---------- */
const text = ref('')
const pw = ref('')
const sel = ref('cr')
const chk = ref(true)
const sw = ref(true)
const rating = ref(4)
const page = ref(3)
const modal = ref(false)
const cookie = ref(false)
const filter = reactive({ cat: 'all', date: '', where: '' })
const fav = ref(false)

const slides = [
  { id: 1, image: '/dev/suppliers-jumbotron.jpg', alt: 'Svatební tabule', title: 'Villa Elena', text: 'Romantické svatby s výhledem na celý svět', href: '#', cta: 'Zobrazit profil', sponsored: true },
  { id: 2, image: '/dev/home-jumbotron.jpg', alt: 'Svatební dekorace', title: 'Květinová výzdoba', text: 'Kytice a dekorace na míru', href: '#' },
  { id: 3, image: '/dev/home-gifts.jpg', alt: 'Dárky pro hosty', title: 'Svatební dary', text: 'Nápady pro novomanžele' },
]
const shareItems = [
  { label: 'Facebook', icon: 'fa6-brands:facebook-f', href: '#' },
  { label: 'LinkedIn', icon: 'fa6-brands:linkedin-in', href: '#' },
  { label: 'X / Twitter', icon: 'fa6-brands:twitter', href: '#' },
]
</script>

<template>
  <div class="sp-container sg">
    <header class="sg__intro">
      <SpHeading :level="1">Design system SelfPlan</SpHeading>
      <p class="sp-text-secondary">
        Podle „SelfPlan 2.0 – Designový systém v1“ (brand manuál EventBuddy 2024): Beige #E2CDBA, UCLA Blue #506E92, Dark Blue #1B2530 (místo černé), Coconut #90633C, Public Sans + Sentient. Odvozené odstíny, stavové barvy, stupnice a rozměry komponent jsou návrh a mají otestovaný kontrast. Tokeny jsou v
        <code>packages/ui/app/assets/css/tokens.css</code>.
      </p>
      <nav class="sg__toc" aria-label="Obsah styleguidu">
        <a href="#colors">Barvy</a><a href="#type">Typografie</a><a href="#shape">Tvary</a><a href="#buttons">Tlačítka</a>
        <a href="#feedback">Štítky a hlášky</a><a href="#forms">Formuláře</a><a href="#cards">Karty</a><a href="#nav">Navigace a sekce</a>
        <a href="#overlays">Překryvy</a><a href="#data">Data</a>
      </nav>
    </header>

    <!-- COLORS -->
    <section id="colors" class="sg__section">
      <SpHeading :level="2">Barvy</SpHeading>
      <div v-for="g in colorGroups" :key="g.title" class="sg__group">
        <h3 class="sg__h3">{{ g.title }}</h3>
        <div class="sg__swatches">
          <figure v-for="t in g.tokens" :key="t" class="sg__swatch">
            <div class="sg__chip" :style="{ background: `var(--sp-color-${t})` }" />
            <figcaption><code>--sp-color-{{ t }}</code><span>{{ resolved[t] }}</span></figcaption>
          </figure>
        </div>
      </div>
      <h3 class="sg__h3">Kontrast (WCAG 2.2 AA: text ≥ 4,5)</h3>
      <SpTable striped caption="Kontrastní poměry">
        <thead><tr><th>Dvojice</th><th>Použití</th><th>Poměr</th><th>AA</th></tr></thead>
        <tbody>
          <tr v-for="p in pairs" :key="p.fg + p.bg">
            <td><span class="sg__pair" :style="{ color: `var(--sp-color-${p.fg})`, background: `var(--sp-color-${p.bg})` }">Aa Text</span></td>
            <td>{{ p.note }}</td>
            <td>{{ ratios[`${p.fg}/${p.bg}`] ?? '…' }}</td>
            <td>{{ ratios[`${p.fg}/${p.bg}`] ? (aa(`${p.fg}/${p.bg}`) ? 'ano' : 'ne (jen doplňkově)') : '' }}</td>
          </tr>
        </tbody>
      </SpTable>
    </section>

    <!-- TYPE -->
    <section id="type" class="sg__section">
      <SpHeading :level="2">Typografie</SpHeading>
      <p class="sp-text-secondary">Nadpisy a claimy: <strong>Sentient</strong> (Fontshare, licenci před spuštěním ověřit). Vše ostatní: <strong>Public Sans</strong>. Fonty jsou self-hostované při buildu. H1 32–56 px, H2 24–36 px, H3 19–24 px, text 16 px, drobný text min. 14 px.</p>
      <div class="sg__stack">
        <SpHeading level="display">Display / H1 – Vše pro vaše události</SpHeading>
        <SpHeading :level="2">Nadpis H2 – 24 až 36 px</SpHeading>
        <SpHeading :level="3">Nadpis H3 – 19 až 24 px</SpHeading>
        <p>Základní text 1 rem / 400. Najděte ověřené dodavatele, naplánujte každý detail a nechte se inspirovat.</p>
        <p class="sp-text-sm">Sekundární text 15 px – formuláře, popisky, navigace.</p>
        <p class="sp-text-xs sp-text-muted">Drobný text 14 px (minimum) – nápovědy, štítky.</p>
        <p><strong>Tučný 700</strong> · <span style="font-weight: 600">Semibold 600 (tlačítka)</span> · <span style="font-weight: 500">Medium 500</span> · <span style="font-weight: 400">Regular 400</span></p>
        <p><a href="#type">Odkaz v textu</a> · <a href="#type" class="sp-text-strong">Černý odkaz</a> · <span class="sp-text-muted">Tlumený text</span></p>
      </div>
    </section>

    <!-- SHAPE -->
    <section id="shape" class="sg__section">
      <SpHeading :level="2">Tvary, stíny, rozestupy</SpHeading>
      <h3 class="sg__h3">Zaoblení</h3>
      <div class="sg__row">
        <figure v-for="[k, v] in radii" :key="k" class="sg__shape">
          <div class="sg__box" :style="{ borderRadius: `var(--sp-radius-${k})` }" />
          <figcaption><code>radius-{{ k }}</code><span>{{ v }}</span></figcaption>
        </figure>
      </div>
      <h3 class="sg__h3">Stíny</h3>
      <div class="sg__row">
        <figure v-for="s in shadows" :key="s" class="sg__shape">
          <div class="sg__box sg__box--plain" :style="{ boxShadow: `var(--sp-shadow-${s})` }" />
          <figcaption><code>shadow-{{ s }}</code></figcaption>
        </figure>
      </div>
      <h3 class="sg__h3">Rozestupy (Bootstrap škála)</h3>
      <div class="sg__stack sg__stack--tight">
        <div v-for="n in spaces" :key="n" class="sg__space"><code>space-{{ n }}</code><span class="sg__bar" :style="{ width: `var(--sp-space-${n})` }" /></div>
      </div>
      <p class="sp-text-secondary sp-text-sm">Breakpointy: sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400. Kontejnery 540 / 720 / 960 / 1140 / 1320.</p>
    </section>

    <!-- BUTTONS -->
    <section id="buttons" class="sg__section">
      <SpHeading :level="2">Tlačítka</SpHeading>
      <div class="sp-row">
        <SpButton variant="cta">Najít dodavatele</SpButton>
        <SpButton variant="border">Začít plánovat</SpButton>
        <SpButton variant="brand">Mám zájem o VIP</SpButton>
        <SpButton variant="link">Zrušit</SpButton>
        <SpButton variant="danger">Smazat</SpButton>
      </div>
      <h3 class="sg__h3">Velikosti</h3>
      <div class="sp-row">
        <SpButton size="sm">Malé</SpButton><SpButton>Výchozí</SpButton><SpButton size="lg">Velké</SpButton>
        <SpButton circle label="Hledat"><SpIcon name="fa6-solid:magnifying-glass" /></SpButton>
      </div>
      <h3 class="sg__h3">Stavy</h3>
      <div class="sp-row">
        <SpButton disabled>Neaktivní</SpButton><SpButton loading>Načítání</SpButton>
        <SpButton variant="border" disabled>Neaktivní</SpButton><SpButton variant="brand" disabled>Neaktivní</SpButton>
        <SpButton variant="cta"><SpIcon name="fa6-regular:heart" /> S ikonou</SpButton>
      </div>
      <h3 class="sg__h3">Blokové</h3>
      <div class="sg__narrow"><SpButton block>Přihlásit se</SpButton></div>
    </section>

    <!-- FEEDBACK -->
    <section id="feedback" class="sg__section">
      <SpHeading :level="2">Štítky a hlášky</SpHeading>
      <div class="sp-row">
        <SpBadge>Inspirace</SpBadge><SpBadge variant="neutral">Neutrální</SpBadge><SpBadge variant="success">Schváleno</SpBadge>
        <SpBadge variant="danger">Zamítnuto</SpBadge><SpBadge variant="warning">Čeká</SpBadge>
      </div>
      <div class="sg__stack sp-mt-3">
        <SpAlert>Informace: Váš profil čeká na schválení.</SpAlert>
        <SpAlert variant="success" dismissible>Uloženo.</SpAlert>
        <SpAlert variant="danger">Zadaný e-mail nebo heslo není správné.</SpAlert>
        <SpAlert variant="warning">Dostupnost je k ověření.</SpAlert>
        <SpAlert variant="cta">Nová verze SelfPlanu je tady.</SpAlert>
        <SpAlert variant="star" dismissible>Vyzkoušejte VIP profil.</SpAlert>
        <SpAlert variant="cta" banner>Banner přes celou šířku (flash zpráva).</SpAlert>
      </div>
    </section>

    <!-- FORMS -->
    <section id="forms" class="sg__section">
      <SpHeading :level="2">Formuláře</SpHeading>
      <div class="sg__form">
        <SpInput v-model="text" label="E-mail" type="email" autocomplete="email" hint="Použijeme jen pro přihlášení." />
        <SpInput label="E-mail s chybou" model-value="neplatny" error="Zadejte platnou e-mailovou adresu." />
        <SpPasswordInput v-model="pw" label="Heslo" autocomplete="new-password" />
        <SpInput label="Zpráva" multiline :rows="3" />
        <SpSelect v-model="sel" label="Lokalita" :options="[{ value: 'cr', label: 'Celá ČR' }, { value: 'praha', label: 'Praha' }, { value: 'stc', label: 'Středočeský kraj' }]" />
        <SpCheckbox v-model="chk" label="Souhlasím s obchodními podmínkami" />
        <SpCheckbox label="Chci odebírat newsletter (nepovinné)" />
        <SpSwitch v-model="sw" label="Pouze volné termíny" />
        <div class="sp-mt-3"><p class="sp-text-sm sp-text-muted sp-mb-1">Hodnocení</p><SpRating v-model="rating" /></div>
      </div>
      <h3 class="sg__h3">Vyhledávací panel</h3>
      <SpFilterBar @submit="() => {}">
        <SpFilterField v-model="filter.cat" label="Co hledáte?" icon="fa6-regular:folder" :options="[{ value: 'all', label: 'Všechny kategorie' }, { value: 'foto', label: 'Fotografové' }]" />
        <SpFilterField v-model="filter.date" label="Datum akce" icon="fa6-regular:calendar" type="date" />
        <SpFilterField v-model="filter.where" label="Lokalita" icon="fa6-solid:location-dot" placeholder="Celá ČR" />
      </SpFilterBar>
    </section>

    <!-- CARDS -->
    <section id="cards" class="sg__section">
      <SpHeading :level="2">Karty a plochy</SpHeading>
      <div class="sp-grid sp-grid--md-3">
        <SpSupplierCard to="#cards" name="Zámek Loučeň" image="/dev/home-suppliers.jpg" category="Místa konání" location="Středočeský kraj" summary="Romantický zámek s parkem pro svatby od jara do podzimu." :rating="4.9" :rating-count="120" :favorite="fav" @toggle-favorite="fav = !fav" />
        <SpSupplierCard to="#cards" name="Statek Čapí hnízdo" image="/dev/home-inspiration.jpg" category="Místa konání" location="Praha" summary="Moderní statek s kouzelným dvorem." sponsored />
        <SpSupplierCard to="#cards" name="Bez fotografie" category="Catering" summary="Karta bez obrázku zobrazí placeholder." />
      </div>
      <div class="sp-grid sp-grid--md-3 sp-mt-4">
        <SpReviewCard author="Tereza a Martin" date="Svatba, červen 2024" text="Díky SelfPlanu jsme našli skvělé dodavatele a celý den proběhl přesně podle našich představ. Koordinace byla bezchybná a všechno do detailu promyšlené." :rating="5" />
        <SpReviewCard author="Jana K." date="Firemní akce" text="Plánovač událostí nám hodně usnadnil organizaci." :rating="5" />
        <SpSurface variant="neutral"><p class="sp-mb-0">Plocha <code>neutral</code> (radius 2rem)</p></SpSurface>
      </div>
      <div class="sp-row sp-mt-4">
        <SpCircleIcon icon="fa6-solid:star" /><SpCircleIcon>JK</SpCircleIcon>
        <SpSurface variant="card" style="max-width: 18rem"><p class="sp-mb-0">Plocha <code>card</code> (Sidebar)</p></SpSurface>
        <SpSurface variant="input" style="max-width: 18rem"><p class="sp-mb-0">Plocha <code>input</code></p></SpSurface>
      </div>
    </section>

    <!-- NAV -->
    <section id="nav" class="sg__section">
      <SpHeading :level="2">Navigace a sekce</SpHeading>
      <p class="sp-text-secondary">Hlavička a patička jsou v layoutu této stránky. Níže hero a rotující karusel.</p>
      <SpHero eyebrow="Svatby, oslavy, firemní akce" title="Vše pro vaše výjimečné události" text="Najděte ověřené dodavatele, naplánujte každý detail a nechte se inspirovat. Na jednom místě.">
        <SpButton size="lg">Najít dodavatele</SpButton>
        <SpButton variant="border" size="lg">Začít plánovat</SpButton>
        <template #media><img src="/dev/session-new.jpg" alt="Svatební dekorace" width="420" height="300" /></template>
      </SpHero>
      <SpCarousel :slides="slides" :interval="7000" />
    </section>

    <!-- OVERLAYS -->
    <section id="overlays" class="sg__section">
      <SpHeading :level="2">Překryvy</SpHeading>
      <div class="sp-row">
        <SpButton variant="border" @click="modal = true">Otevřít modal</SpButton>
        <SpButton variant="border" @click="cookie = !cookie">Cookie lišta</SpButton>
        <SpDropdown label="Sdílet" :items="shareItems" />
      </div>
      <SpModal v-model="modal" title="Detail recenze">
        <p>Díky SelfPlanu jsme našli skvělé dodavatele a celý den proběhl přesně podle našich představ.</p>
        <template #footer><SpButton variant="border" @click="modal = false">Zavřít</SpButton></template>
      </SpModal>
      <SpCookieBar :visible="cookie" @accept="cookie = false" @reject="cookie = false" @customize="cookie = false" />
    </section>

    <!-- DATA -->
    <section id="data" class="sg__section">
      <SpHeading :level="2">Data</SpHeading>
      <SpTable striped caption="Poslední poptávky">
        <thead><tr><th>Datum</th><th>Zákazník</th><th>Stav</th><th></th></tr></thead>
        <tbody>
          <tr><td>26. 6. 2027</td><td>Lucie Nováková</td><td><SpBadge variant="warning">Nová</SpBadge></td><td><SpButton size="sm" variant="border">Zobrazit</SpButton></td></tr>
          <tr><td>12. 7. 2027</td><td>Petr Svoboda</td><td><SpBadge variant="success">Potvrzeno</SpBadge></td><td><SpButton size="sm" variant="border">Zobrazit</SpButton></td></tr>
          <tr><td>5. 8. 2027</td><td>Martina Procházková</td><td><SpBadge variant="neutral">Uzavřeno</SpBadge></td><td><SpButton size="sm" variant="border">Zobrazit</SpButton></td></tr>
        </tbody>
      </SpTable>
      <SpPagination v-model="page" :pages="12" />
      <p class="sp-text-center sp-text-sm sp-text-muted sp-mt-2">Stránka {{ page }} z 12</p>
      <h3 class="sg__h3">Hvězdy</h3>
      <div class="sp-row"><SpStars :value="5" /><SpStars :value="3" /><SpStars :value="0" /></div>
    </section>
  </div>
</template>

<style scoped>
.sg { padding-block: var(--sp-space-4) var(--sp-space-5); }
.sg__intro { margin-bottom: var(--sp-space-4); }
.sg__toc { display: flex; flex-wrap: wrap; gap: var(--sp-space-2) var(--sp-space-3); font-size: var(--sp-text-sm); }
.sg__section { padding-top: var(--sp-space-5); border-top: 1px solid var(--sp-color-line); margin-top: var(--sp-space-4); }
.sg__h3 { margin: var(--sp-space-4) 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); color: var(--sp-color-text-secondary); }
.sg__stack { display: flex; flex-direction: column; gap: var(--sp-space-3); }
.sg__stack--tight { gap: var(--sp-space-2); }
.sg__narrow { max-width: 22rem; }
.sg__form { max-width: 32rem; }
.sg__swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr)); gap: var(--sp-space-3); }
.sg__swatch { margin: 0; }
.sg__chip { height: 4rem; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-sm); }
.sg__swatch figcaption, .sg__shape figcaption { display: flex; flex-direction: column; margin-top: var(--sp-space-1); font-size: var(--sp-text-xs); color: var(--sp-color-text-secondary); }
.sg__swatch code, .sg__shape code { color: var(--sp-color-text-strong); }
.sg__pair { display: inline-block; padding: 0.15rem 0.6rem; border: 1px solid var(--sp-color-line); border-radius: 4px; }
.sg__row { display: flex; flex-wrap: wrap; gap: var(--sp-space-4); }
.sg__shape { margin: 0; }
.sg__box { width: 6rem; height: 4rem; background: var(--sp-color-brand-soft); border: 1px solid var(--sp-color-brand); }
.sg__box--plain { background: var(--sp-color-bg); border-color: transparent; border-radius: var(--sp-radius-md); }
.sg__space { display: flex; align-items: center; gap: var(--sp-space-3); font-size: var(--sp-text-xs); }
.sg__space code { width: 5rem; }
.sg__bar { height: 0.75rem; min-width: 1px; background: var(--sp-color-primary); border-radius: 2px; }
</style>
