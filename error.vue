<template>
  <div class="error-page-wrapper">
    <Navbar />
    
    <div class="page-wrapper">
      <div class="page-404">
        <div class="big-num">{{ error.statusCode || 404 }}</div>
        <div class="page-404-content">
          <div class="hero-chip" style="margin: 0 auto 24px; display: inline-flex;">
            Error {{ error.statusCode || 404 }}
          </div>
          <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1;">
            <template v-if="error.statusCode === 404">
              Halaman<br><span style="color: var(--fg-dim); font-weight: 300;">tidak ditemukan.</span>
            </template>
            <template v-else>
              Terjadi<br><span style="color: var(--fg-dim); font-weight: 300;">kesalahan sistem.</span>
            </template>
          </h1>
          <p style="color: var(--fg-muted); font-size: 0.95rem; margin-bottom: 40px; font-family: var(--font-mono);">
            {{ error.statusCode === 404 ? 'Sepertinya URL yang Anda minta tidak ada di sini.' : error.message }}
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button @click="handleClearError" class="btn-primary" id="notfound-home">
              <span>Balik ke Home</span>
            </button>
            <NuxtLink to="/contact" class="btn-ghost" id="notfound-contact">
              Hubungi Saya
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleClearError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-page-wrapper {
  min-height: 100vh;
  background-color: #0D0A07;
  color: #fff;
}
</style>
