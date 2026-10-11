<script setup lang="ts">
import type { SiteContent, SiteSection, SiteTemplate } from '~/data/mock/eventsite'

/**
 * Renders an event website from template + sections + content. Used by the editor preview and the public page.
 * Template colors are scoped CSS variables (--es-*), they never leak into the main SelfPlan design tokens.
 * Private data (budget, guest list) is never rendered here; only what the organizer chose to publish.
 */
const props = defineProps<{ template: SiteTemplate; sections: SiteSection[]; content: SiteContent; interactive?: boolean }>()
const visible = computed(() => props.sections.filter((s) => s.visible).map((s) => s.id))
const show = (id: string) => visible.value.includes(id)
const style = computed(() => ({ '--es-accent': props.template.accent, '--es-soft': props.template.soft, '--es-text': props.template.text, '--es-font': props.template.heading === 'serif' ? 'Georgia, "Times New Roman", serif' : 'var(--sp-font-body)' }))
const days = computed(() => Math.max(0, Math.ceil((new Date(props.content.date).getTime() - Date.now()) / 86400000)))
const rsvp = reactive({ name: '', attending: 'yes', persons: 1, diet: '' })
const rsvpDone = ref(false)
</script>

<template>
  <article class="es" :style="style">
    <section v-if="show('hero')" class="es__hero"><p class="es__eyebrow">{{ content.subtitle }}</p><h1>{{ content.title }}</h1><p>{{ fmtDateLong(content.date) }} · {{ content.place }}</p></section>
    <section v-if="show('datum')" class="es__block es__center"><h2>Datum</h2><p class="es__big">{{ fmtDateLong(content.date) }}, {{ content.time }}</p><p class="es__count">Do akce zbývá {{ days }} dní</p></section>
    <section v-if="show('misto')" class="es__block"><h2>Místo a doprava</h2><p><strong>{{ content.place }}</strong><br>{{ content.address }}</p><p>{{ content.travel }}</p><a class="es__link" :href="`https://www.google.com/maps/search/${encodeURIComponent(content.address)}`" target="_blank" rel="noopener">Zobrazit na mapě</a></section>
    <section v-if="show('program')" class="es__block"><h2>Harmonogram</h2><ol class="es__program"><li v-for="p in content.program" :key="p.time + p.title"><time>{{ p.time }}</time> {{ p.title }}</li></ol></section>
    <section v-if="show('dresscode')" class="es__block"><h2>Dress code</h2><p>{{ content.dress }}</p><div class="es__palette" role="img" :aria-label="`Barevná paleta: ${content.palette.join(', ')}`"><i v-for="c in content.palette" :key="c" :style="{ background: c }" /></div></section>
    <section v-if="show('rsvp')" class="es__block"><h2>Potvrzení účasti</h2>
      <p>Prosíme o odpověď do {{ fmtDate(content.rsvpDeadline) }}.</p>
      <p v-if="rsvpDone" class="es__ok">Děkujeme, vaši odpověď jsme zaznamenali.</p>
      <form v-else class="es__form" @submit.prevent="interactive !== false ? (rsvpDone = true) : null">
        <label>Jméno<input v-model="rsvp.name" required></label>
        <fieldset><legend>Přijdete?</legend><label><input v-model="rsvp.attending" type="radio" value="yes"> Ano</label><label><input v-model="rsvp.attending" type="radio" value="no"> Ne</label></fieldset>
        <label>Počet osob<input v-model.number="rsvp.persons" type="number" min="1" max="10"></label>
        <label>Strava, alergie<input v-model="rsvp.diet"></label>
        <button type="submit">Odeslat odpověď</button>
      </form>
    </section>
    <section v-if="show('dary')" class="es__block"><h2>Dary a přání</h2><ul class="es__gifts"><li v-for="g in content.gifts" :key="g.title" :class="{ 'is-done': g.done }">{{ g.title }} <small v-if="g.done">(splněno)</small></li></ul></section>
    <section v-if="show('faq')" class="es__block"><h2>Časté dotazy</h2><dl><template v-for="f in content.faq" :key="f.q"><dt>{{ f.q }}</dt><dd>{{ f.a }}</dd></template></dl></section>
    <section v-if="show('kontakt')" class="es__block es__center"><h2>Kontakt</h2><p>{{ content.contact }}</p></section>
    <footer class="es__foot">Vytvořeno pomocí <a href="/eventovy-web">SelfPlan</a></footer>
  </article>
</template>

<style scoped>
.es { color: var(--es-text); background: #fff; font-family: var(--sp-font-body); line-height: 1.55; }
.es h1, .es h2 { font-family: var(--es-font); font-weight: 400; color: var(--es-text); }
.es__hero { padding: 3rem 1.5rem; text-align: center; background: var(--es-soft); }
.es__hero h1 { margin: 0.25rem 0 0.5rem; font-size: clamp(2rem, 6vw, 3.25rem); }
.es__eyebrow { margin: 0; letter-spacing: 0.12em; text-transform: uppercase; font-size: 0.8rem; color: var(--es-accent); }
.es__block { padding: 2rem 1.5rem; max-width: 40rem; margin: 0 auto; border-bottom: 1px solid color-mix(in srgb, var(--es-accent) 20%, transparent); }
.es__center { text-align: center; }
.es__block h2 { margin: 0 0 0.75rem; font-size: 1.5rem; color: var(--es-accent); }
.es__big { margin: 0; font-family: var(--es-font); font-size: 1.5rem; }
.es__count { color: var(--es-accent); }
.es__program { margin: 0; padding: 0; list-style: none; }
.es__program li { padding: 0.4rem 0; border-bottom: 1px dashed color-mix(in srgb, var(--es-accent) 30%, transparent); }
.es__program time { display: inline-block; min-width: 3.5rem; font-weight: 700; color: var(--es-accent); }
.es__palette { display: flex; gap: 0.5rem; }
.es__palette i { width: 2.5rem; height: 2.5rem; border-radius: 50%; border: 1px solid rgb(0 0 0 / 0.1); }
.es__link { color: var(--es-accent); }
.es__form { display: grid; gap: 0.75rem; }
.es__form label { display: grid; gap: 0.25rem; font-size: 0.9rem; }
.es__form input[type='text'], .es__form input:not([type]), .es__form input[type='number'] { padding: 0.55rem 0.7rem; border: 1px solid color-mix(in srgb, var(--es-accent) 40%, #ccc); border-radius: 6px; }
.es__form fieldset { border: 0; padding: 0; display: flex; gap: 1rem; align-items: center; }
.es__form fieldset label { display: inline-flex; gap: 0.35rem; align-items: center; }
.es__form button { justify-self: start; padding: 0.6rem 1.4rem; color: #fff; background: var(--es-accent); border: 0; border-radius: 999px; }
.es__ok { padding: 0.75rem 1rem; background: var(--es-soft); border-radius: 8px; }
.es__gifts { margin: 0; padding-left: 1.2rem; }
.es__gifts .is-done { text-decoration: line-through; opacity: 0.6; }
.es dt { font-weight: 700; margin-top: 0.75rem; }
.es dd { margin: 0; }
.es__foot { padding: 1.5rem; text-align: center; font-size: 0.8rem; color: #777; }
.es__foot a { color: inherit; }
</style>
