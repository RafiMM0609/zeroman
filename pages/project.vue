<!--
  LEGACY REDIRECT SHIM — Jangan hapus file ini!
  Semua traffic lama ke /project?id=xxx akan diredirect ke /portfolio/xxx
  Untuk SEO backward compatibility (preservasi link equity dari backlink lama).
-->
<template>
  <div></div>
</template>

<script setup>
const route = useRoute()

// Redirect segera ke URL baru
const id = route.query.id
if (id) {
  await navigateTo(`/portfolio/${id}`, { redirectCode: 301 })
} else {
  await navigateTo('/portfolio', { redirectCode: 301 })
}
</script>
