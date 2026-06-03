<template>
  <div class="layout">
    <sideBar class="sidebar" />

    <div class="content" ref="contentRef">
      <Header v-if="showHeader" />
      <smallHeader v-show="showSmall" v-if="showHeader" />

      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import sideBar from '@/components/sideBar.vue'
import Header from '@/components/header.vue'
import smallHeader from '@/components/smallHeader.vue'
import { ref, onMounted, watch } from 'vue'
import { useSearchStore } from '@/stores/search'
import router from '@/router'

const store = useSearchStore()
const showHeader = ref(false)
const showSmall = ref(false)
const contentRef = ref(null)

watch(
  () => store.activeMenu,
  (name) => {
    if (!name) return

    const menuMap = {
      home: '/',
      diandian: '/diandian',
      RED: '/RED',
      live: '/live',
      publish: '/publish',
      message: '/message',
      me: '/me'
    }

    if (menuMap[name]) {
      router.push(menuMap[name])
    }
    if (['home', 'live', 'RED'].includes(name)) {
      showHeader.value = true
    } else {
      showHeader.value = false
    }
  },
  { immediate: false }
)

const handleScroll = () => {
  const top = contentRef.value.scrollTop
  // 滚动超过 80px → 显示小header
  if (top > 80) {
    showSmall.value = true
  } else {
    // 回到顶部 → 隐藏
    showSmall.value = false
  }
}

onMounted(() => {
  contentRef.value.addEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
.layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 164px;
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #19191E;
  margin-left: 164px;
  height: 100vh;
  overflow-y: auto;
}

.main-content {
  padding-bottom: 50px;
}
</style>
