<script setup lang="ts">
import { defaultContent, defaultSections, siteTemplates, type SiteContent, type SiteSection } from '~/data/mock/eventsite'

useSeoMeta({ title: 'Editor eventového webu – SelfPlan', robots: 'noindex, nofollow' })

const route = useRoute()
const { loggedIn } = useMockSession()
const KEY = 'sp:eventsite:draft:v1'

const tab = ref('sablona')
const templateId = ref(typeof route.query.sablona === 'string' ? route.query.sablona : 'zahradni')
const sections = ref<SiteSection[]>(structuredClone(defaultSections))
const content = ref<SiteContent>(structuredClone(defaultContent))
const active = ref('hero')
const device = ref<'desktop' | 'mobile'>('desktop')
const privacy = ref<'odkaz' | 'verejny' | 'heslo'>('odkaz')
const published = ref(false)
const payOpen = ref(false)
const dirty = ref(false)
const hydrated = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const d = JSON.parse(raw); sections.value = d.sections; content.value = d.content; if (!route.query.sablona) templateId.value = d.templateId }
  } catch { /* ignore */ }
  hydrated.value = true
})
watch([templateId, sections, content], () => {
  dirty.value = true
  if (!hydrated.value) return
  // Anonymous work stays local (spec: registration only at first permanent save; user is warned).
  try { localStorage.setItem(KEY, JSON.stringify({ templateId: templateId.value, sections: sections.value, content: content.value })) } catch { /* storage blocked */ }
}, { deep: true })

const template = computed(() => siteTemplates.find((t) => t.id === templateId.value) ?? siteTemplates[0]!)
function move(i: number, d: number) {
  const j = i + d
  if (j < 0 || j >= sections.value.length) return
  const a = [...sections.value]; [a[i], a[j]] = [a[j]!, a[i]!]; sections.value = a
}
const tabs = [{ id: 'sablona', label: '1. Šablona' }, { id: 'obsah', label: '2. Obsah' }, { id: 'zverejnit', label: '3. Zveřejnit' }]
const addProgram = () => content.value.program.push({ time: '', title: '' })
const checks = computed(() => [
  { ok: !!content.value.title, text: 'Název a podtitul' }, { ok: !!content.value.date, text: 'Datum akce' },
  { ok: !!content.value.place, text: 'Místo konání' }, { ok: sections.value.some((s) => s.id === 'rsvp' && s.visible), text: 'RSVP je zapnuté' },
])
const ready = computed(() => checks.value.every((c) => c.ok))
function pay() { payOpen.value = false; published.value = true }
const slug = 'tereza-a-martin'
</script>

<template>
  <div class="ed">
    <header class="ed__bar">
      <div class="sp-container ed__bar-in">
        <NuxtLink to="/eventovy-web" class="ed__back"><SpIcon name="fa6-solid:arrow-left" /> Zpět</NuxtLink>
        <strong>Editor webu</strong>
        <span class="ed__state" aria-live="polite">{{ dirty ? 'Neuloženo v účtu, koncept je v tomto prohlížeči' : '' }}</span>
        <span class="ed__spacer" />
        <SpButton v-if="!loggedIn" size="sm" to="/registrace">Uložit do účtu</SpButton>
      </div>
    </header>

    <div class="ed__main">
      <section class="ed__panel" aria-label="Nastavení webu">
        <SpTabs v-model="tab" id-prefix="ed" :items="tabs" label="Kroky editoru" />

        <div v-show="tab === 'sablona'" id="ed-panel-sablona" role="tabpanel" aria-labelledby="ed-tab-sablona">
          <p class="sp-text-sm sp-text-secondary">Šablonu můžete kdykoli změnit bez ztráty obsahu.</p>
          <div class="tpls">
            <button v-for="t in siteTemplates" :key="t.id" type="button" class="tpl" :class="{ 'is-on': templateId === t.id }" :aria-pressed="templateId === t.id" :style="{ '--a': t.accent, '--s': t.soft }" @click="templateId = t.id">
              <span class="tpl__thumb"><i /><b /></span><strong>{{ t.name }}</strong>
            </button>
          </div>
          <SpButton class="sp-mt-3" @click="tab = 'obsah'">Pokračovat k obsahu</SpButton>
        </div>

        <div v-show="tab === 'obsah'" id="ed-panel-obsah" role="tabpanel" aria-labelledby="ed-tab-obsah">
          <h3 class="h3">Sekce</h3>
          <ul class="secs">
            <li v-for="(s, i) in sections" :key="s.id" :class="{ 'is-active': active === s.id }">
              <button type="button" class="secs__name" @click="active = s.id">{{ s.label }}</button>
              <SpSwitch v-model="s.visible" :label="s.visible ? 'Zobrazeno' : 'Skryto'" />
              <span class="secs__move"><button type="button" :disabled="i === 0" aria-label="Posunout výš" @click="move(i, -1)"><SpIcon name="fa6-solid:chevron-up" /></button><button type="button" :disabled="i === sections.length - 1" aria-label="Posunout níž" @click="move(i, 1)"><SpIcon name="fa6-solid:chevron-down" /></button></span>
            </li>
          </ul>
          <h3 class="h3">Úprava: {{ sections.find((s) => s.id === active)?.label }}</h3>
          <div class="fields">
            <template v-if="active === 'hero'"><SpInput v-model="content.title" label="Název" /><SpInput v-model="content.subtitle" label="Podtitul" /></template>
            <template v-else-if="active === 'datum'"><SpInput v-model="content.date" label="Datum" type="date" /><SpInput v-model="content.time" label="Čas" type="time" /></template>
            <template v-else-if="active === 'misto'"><SpInput v-model="content.place" label="Místo" /><SpInput v-model="content.address" label="Adresa" /><SpInput v-model="content.travel" label="Doprava a parkování" multiline :rows="3" /></template>
            <template v-else-if="active === 'program'">
              <div v-for="(p, i) in content.program" :key="i" class="prog"><SpInput v-model="p.time" label="Čas" type="time" /><SpInput v-model="p.title" label="Název" /><button type="button" aria-label="Odebrat" @click="content.program.splice(i, 1)"><SpIcon name="fa6-regular:trash-can" /></button></div>
              <SpButton size="sm" variant="border" @click="addProgram">Přidat bod</SpButton>
            </template>
            <template v-else-if="active === 'dresscode'"><SpInput v-model="content.dress" label="Dress code" /><p class="sp-text-sm sp-mb-1">Barevná paleta (2–8 barev)</p><div class="pal"><label v-for="(c, i) in content.palette" :key="i"><input v-model="content.palette[i]" type="color" :aria-label="`Barva ${i + 1}`"></label></div></template>
            <template v-else-if="active === 'rsvp'"><SpInput v-model="content.rsvpDeadline" label="Uzávěrka odpovědí" type="date" /><SpSelect v-model="content.rsvpMode" label="Režim" :options="[{ value: 'verejny', label: 'Veřejný formulář' }, { value: 'individualni', label: 'Individuální osobní odkazy' }]" /><p class="sp-text-xs sp-text-muted">Odkazy sdílíte sami; SelfPlan pozvánky nerozesílá. Seznam hostů vidíte jen vy.</p></template>
            <template v-else-if="active === 'dary'"><div v-for="(g, i) in content.gifts" :key="i" class="prog"><SpInput v-model="g.title" label="Přání" /><SpCheckbox v-model="g.done" label="Splněno" /></div></template>
            <template v-else-if="active === 'faq'"><div v-for="(f, i) in content.faq" :key="i"><SpInput v-model="f.q" label="Otázka" /><SpInput v-model="f.a" label="Odpověď" /></div></template>
            <template v-else-if="active === 'kontakt'"><SpInput v-model="content.contact" label="Kontakt" multiline :rows="2" /></template>
          </div>
          <SpButton class="sp-mt-3" @click="tab = 'zverejnit'">Pokračovat ke zveřejnění</SpButton>
        </div>

        <div v-show="tab === 'zverejnit'" id="ed-panel-zverejnit" role="tabpanel" aria-labelledby="ed-tab-zverejnit">
          <h3 class="h3">Kontrola</h3>
          <ul class="checks"><li v-for="c in checks" :key="c.text" :class="{ ok: c.ok }"><SpIcon :name="c.ok ? 'fa6-solid:circle-check' : 'fa6-regular:circle'" /> {{ c.text }}</li></ul>
          <h3 class="h3">Soukromí</h3>
          <SpRadio v-model="privacy" name="priv" value="odkaz" label="Neveřejný odkaz (výchozí): nezobrazuje se ve vyhledávačích" />
          <SpRadio v-model="privacy" name="priv" value="verejny" label="Veřejný: indexovatelný vyhledávači" />
          <SpRadio v-model="privacy" name="priv" value="heslo" label="Chráněno heslem" />
          <p class="sp-text-xs sp-text-muted">Neveřejný odkaz lze přeposlat. Pro důvěrné informace zvolte heslo.</p>

          <SpSurface variant="warm" class="buy">
            <template v-if="published">
              <h3 class="h3">Web je zveřejněn</h3>
              <p>Adresa: <NuxtLink :to="`/w/${slug}`">/w/{{ slug }}</NuxtLink>. Platnost 12 měsíců od dnešního dne.</p>
              <div class="sp-row sp-row--tight"><SpButton :to="`/w/${slug}`">Otevřít web</SpButton><SpButton variant="border" to="/ucet/eventove-weby">Moje weby</SpButton></div>
            </template>
            <template v-else-if="!loggedIn">
              <h3 class="h3">Pro uložení se přihlaste</h3>
              <p>Váš koncept zůstane zachován. Po přihlášení ho převedeme do účtu bez ztráty dat.</p>
              <SpButton to="/prihlaseni?redirect=/eventovy-web/editor">Přihlásit se</SpButton>
            </template>
            <template v-else>
              <h3 class="h3">Zveřejnit web za 490 Kč</h3>
              <p>Jednorázově, 12 měsíců od prvního zveřejnění, bez předplatného.</p>
              <SpButton :disabled="!ready" @click="payOpen = true">Zveřejnit web za 490 Kč</SpButton>
            </template>
          </SpSurface>
        </div>
      </section>

      <section class="ed__preview" aria-label="Náhled webu">
        <div class="prev__bar">
          <span class="sp-text-sm">Náhled</span>
          <div class="seg" role="group" aria-label="Zařízení"><button type="button" :class="{ 'is-on': device === 'desktop' }" @click="device = 'desktop'"><SpIcon name="fa6-solid:desktop" /> Počítač</button><button type="button" :class="{ 'is-on': device === 'mobile' }" @click="device = 'mobile'"><SpIcon name="fa6-solid:mobile-screen" /> Mobil</button></div>
        </div>
        <div class="prev__frame" :class="`prev__frame--${device}`"><EventSitePreview :template="template" :sections="sections" :content="content" :interactive="false" /></div>
      </section>
    </div>

    <SpModal v-model="payOpen" title="Platba (ukázka)">
      <p>Zde se otevře platební brána. Částka: <strong>490 Kč</strong>, jednorázově, 12 měsíců.</p>
      <p class="sp-text-sm sp-text-secondary">Rekapitulace: produkt Vlastní eventový web, prodejce Event Buddy s.r.o., obchodní podmínky a poučení o odstoupení se zobrazí před zaplacením. Web se zveřejní až po potvrzení platby serverem.</p>
      <template #footer><SpButton variant="border" @click="payOpen = false">Zrušit</SpButton><SpButton @click="pay">Zaplatit 490 Kč (simulace)</SpButton></template>
    </SpModal>
  </div>
</template>

<style scoped>
.ed__bar { position: sticky; top: 0; z-index: 20; background: var(--sp-color-bg); border-bottom: 1px solid var(--sp-color-line); }
.ed__bar-in { display: flex; align-items: center; gap: var(--sp-space-3); min-height: 3.25rem; }
.ed__back { text-decoration: none; font-size: var(--sp-text-sm); }
.ed__state { font-size: var(--sp-text-xs); color: var(--sp-color-text-muted); }
.ed__spacer { flex: 1; }
.ed__main { display: grid; min-height: calc(100vh - 3.25rem); }
.ed__panel { padding: var(--sp-space-3); border-bottom: 1px solid var(--sp-color-line); }
.ed__preview { padding: var(--sp-space-3); background: var(--sp-color-bg-neutral); }
@media (min-width: 992px) { .ed__main { grid-template-columns: 26rem minmax(0, 1fr); } .ed__panel { border-right: 1px solid var(--sp-color-line); border-bottom: 0; max-height: calc(100vh - 3.25rem); overflow-y: auto; } .ed__preview { max-height: calc(100vh - 3.25rem); overflow-y: auto; } }
.h3 { margin: var(--sp-space-3) 0 var(--sp-space-2); font-size: var(--sp-text-md); font-weight: var(--sp-font-weight-semibold); }
.tpls { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sp-space-2); }
.tpl { display: grid; gap: 0.3rem; padding: var(--sp-space-2); text-align: left; background: var(--sp-color-bg); border: 2px solid var(--sp-color-line); border-radius: var(--sp-radius-sm); }
.tpl.is-on { border-color: var(--sp-color-primary); }
.tpl__thumb { display: grid; gap: 0.3rem; align-content: start; min-height: 4rem; padding: 0.6rem; background: var(--s); border-radius: 6px; }
.tpl__thumb i { height: 0.8rem; width: 55%; background: var(--a); border-radius: 3px; }
.tpl__thumb b { height: 0.4rem; background: color-mix(in srgb, var(--a) 40%, #fff); border-radius: 3px; }
.secs { margin: 0; padding: 0; list-style: none; border: 1px solid var(--sp-color-line); border-radius: var(--sp-radius-sm); }
.secs li { display: flex; align-items: center; gap: var(--sp-space-2); padding: 0.4rem 0.6rem; border-top: 1px solid var(--sp-color-line); }
.secs li:first-child { border-top: 0; }
.secs li.is-active { background: var(--sp-color-bg-warm); }
.secs__name { flex: 1; padding: 0.3rem 0; text-align: left; background: none; border: 0; font-size: var(--sp-text-sm); }
.secs__move button { padding: 0.25rem 0.4rem; background: none; border: 0; color: var(--sp-color-text-secondary); }
.secs__move button:disabled { opacity: 0.3; }
.fields { margin-bottom: var(--sp-space-2); }
.prog { display: grid; grid-template-columns: 6rem 1fr auto; gap: var(--sp-space-2); align-items: start; }
.prog > button { margin-top: 1rem; padding: 0.4rem; background: none; border: 0; color: var(--sp-color-text-secondary); }
.pal { display: flex; gap: var(--sp-space-2); }
.pal input { width: 2.75rem; height: 2.75rem; padding: 0; border: 0; background: none; }
.checks { margin: 0; padding: 0; list-style: none; }
.checks li { display: flex; gap: var(--sp-space-2); align-items: center; padding: 0.2rem 0; color: var(--sp-color-text-muted); }
.checks li.ok { color: var(--sp-color-success); }
.buy { margin-top: var(--sp-space-4); }
.prev__bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--sp-space-2); }
.seg { display: inline-flex; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-pill); overflow: hidden; }
.seg button { padding: 0.35rem 0.8rem; font-size: var(--sp-text-sm); background: var(--sp-color-bg); border: 0; }
.seg button.is-on { color: var(--sp-color-on-primary); background: var(--sp-color-primary); }
.prev__frame { margin-inline: auto; overflow: hidden; background: #fff; border: 1px solid var(--sp-color-line-strong); border-radius: var(--sp-radius-sm); box-shadow: var(--sp-shadow-card); transition: max-width var(--sp-duration) var(--sp-ease); }
.prev__frame--desktop { max-width: 100%; }
.prev__frame--mobile { max-width: 390px; }
</style>
