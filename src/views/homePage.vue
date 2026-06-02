<template>
  <div class="homepage">
    <TabBar :tab-list="tabList" :active-index="activeIndex" @tab-change="onTabChange" />
    <Cards class="cards" :list="filteredCards" />
  </div>
</template>

<script setup>
import TabBar from '@/components/tabBar.vue'
import { ref, computed, onMounted } from 'vue'
import Cards from '@/components/cards.vue'
import { useSearchStore } from '@/stores/search'

const store = useSearchStore()

const tabList = ref([
  { text: '推荐' },
  { text: '穿搭' },
  { text: '美食' },
  { text: '彩妆' },
  { text: '影视' },
  { text: '职场' },
  { text: '情感' },
  { text: '家居' },
  { text: '游戏' },
  { text: '旅行' },
  { text: '健身' },
  { text: '视频' }
])
const activeIndex = ref(0)

const currentTag = ref('推荐')

function onTabChange(text, index) {
  currentTag.value = text
  activeIndex.value = index
}

const filteredCards = computed(() => {
  return store.cardList.filter(item =>
    item.tags.includes(currentTag.value)
  )
})

onMounted(() => {
  store.setActiveMenu('home')
})

</script>

<style scoped lang="scss">
.homepage {
  min-height: 100%;
}
</style>
