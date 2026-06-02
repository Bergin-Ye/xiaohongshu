<template>
  <div class="homepage">
    <Cards class="cards" :list="filteredCards" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Cards from '@/components/cards.vue'
import { useSearchStore } from '@/stores/search'

const store = useSearchStore()

onMounted(() => {
  store.setActiveMenu('RED')
})

const filteredCards = computed(() => {
  return store.redCardList
})

</script>

<style scoped lang="scss">
.homepage {
  min-height: 100%;
}
</style>
