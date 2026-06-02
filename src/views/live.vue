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
  { text: '全部' },
  { text: '游戏' },
  { text: '才艺直播' },
  { text: '生活分享' },
  { text: '兴趣手工' },
  { text: '科技财经' },
  { text: '户外运动' }
])
const activeIndex = ref(0)

const currentTag = ref('全部')

function onTabChange(text, index) {
  currentTag.value = text
  activeIndex.value = index
}

const filteredCards = computed(() => {
  return store.liveCardList.filter(item =>
    item.tags.includes(currentTag.value)
  )
})

onMounted(() => {
  store.setActiveMenu('live')
})

</script>

<style scoped lang="scss">
.homepage {
  min-height: 100%;
}
</style>
