<script setup lang="ts">
import { legal } from '~/data/legal'

/** Renders one of the legal drafts. Unresolved [DOPLNIT] fields are highlighted so they cannot be missed before launch. */
const props = defineProps<{ doc: string }>()
const d = legal[props.doc]
if (!d) throw createError({ statusCode: 404, statusMessage: 'Dokument nenalezen', fatal: true })
useSeoMeta({ title: `${d.title} | SelfPlan`, description: d.note })
const parts = (t: string) => t.split(/(\[DOPLNIT[^\]]*\])/g).filter(Boolean)
</script>

<template>
  <div class="sp-container legal">
    <SpHeading :level="1">{{ d!.title }}</SpHeading>
    <SpAlert variant="warning" class="sp-mb-3">{{ d!.note }}</SpAlert>
    <section v-for="s in d!.sections" :key="s.heading" class="legal__sec">
      <h2 v-if="s.heading">{{ s.heading }}</h2>
      <p v-for="p in s.paragraphs" :key="p"><template v-for="(x, i) in parts(p)" :key="i"><mark v-if="x.startsWith('[DOPLNIT')">{{ x }}</mark><template v-else>{{ x }}</template></template></p>
    </section>
  </div>
</template>

<style scoped>
.legal { max-width: 48rem; padding-block: var(--sp-space-3) var(--sp-space-5); }
.legal__sec h2 { margin: var(--sp-space-4) 0 var(--sp-space-2); font-family: var(--sp-font-heading); font-weight: var(--sp-font-weight-regular); font-size: var(--sp-text-xl); }
.legal mark { padding: 0 0.25rem; background: var(--sp-color-warning-bg); border-radius: 3px; }
</style>
