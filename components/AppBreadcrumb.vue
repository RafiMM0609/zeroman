<template>
  <nav class="breadcrumb-nav fade-up" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in items" 
        :key="index" 
        class="breadcrumb-item"
      >
        <NuxtLink 
          v-if="item.to && index < items.length - 1" 
          :to="item.to" 
          class="breadcrumb-link"
        >
          {{ item.label }}
        </NuxtLink>
        <span 
          v-else 
          class="breadcrumb-current" 
          aria-current="page"
        >
          {{ item.label }}
        </span>
        <span 
          v-if="index < items.length - 1" 
          class="breadcrumb-sep" 
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'Beranda', to: '/' }, { label: 'Portofolio', to: '/portfolio' }, { label: 'Detail' }]
  }
})
</script>

<style scoped>
.breadcrumb-nav {
  margin-bottom: 32px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: var(--fg-muted);
  text-decoration: none;
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--accent-primary);
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.4);
}

.breadcrumb-sep {
  color: var(--border-mid);
  user-select: none;
  opacity: 0.6;
}

.breadcrumb-current {
  color: var(--fg);
  font-weight: 600;
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 640px) {
  .breadcrumb-current {
    max-width: 180px;
  }
}
</style>
