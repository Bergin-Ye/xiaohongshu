<template>
  <div class="sidebar">
    <img :src="logo" class="logo">

    <div class="menu-list">
      <div class="menu-item" v-for="item in menuList" :key="item.name" :class="{ active: currentActive === item.name }"
        @click="handleClick(item)">
        <img :src="item.icon" :class="item.className || ''">
        <span>{{ item.label }}</span>
        <span class="ai" v-if="item.ai">{{ item.ai }}</span>
      </div>
    </div>

    <div class="support">
      <div class="support-item" @click.stop="openMorePop">
        <img :src="more"><span>更多</span>
      </div>
      <div class="support-item">
        <img :src="aboutUs"><span>关于我们</span>
      </div>
    </div>

    <morePop v-show="isShowMorePop" class="more-pop" @close="closeMorePop" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSearchStore } from '@/stores/search'
import router from '@/router'

const store = useSearchStore()
const isShowMorePop = ref(false)

// 导入图片
import logo from '@/assets/logo.png'
import homePage from '@/assets/首页.svg'
import diandian from '@/assets/气泡.svg'
import RED from '@/assets/播放.svg'
import live from '@/assets/直播.svg'
import publish from '@/assets/发布.svg'
import message from '@/assets/消息.svg'
import profilePicture from '@/assets/profilePicture.jpg'
import more from '@/assets/更多.svg'
import aboutUs from '@/assets/关于.svg'
import morePop from './morePop.vue'

// 菜单配置
const menuList = [
  { name: 'home', label: '首页', icon: homePage, path: '/' },
  { name: 'diandian', label: '点点', icon: diandian, ai: 'ai', path: '/diandian' },
  { name: 'RED', label: 'RED', icon: RED, path: '/RED' },
  { name: 'live', label: '直播', icon: live, path: '/live' },
  { name: 'publish', label: '发布', icon: publish, path: '/publish' },
  { name: 'message', label: '消息', icon: message, path: '/message' },
  { name: 'me', label: '我', icon: profilePicture, className: 'profile-picture', path: '/me' },
]

// 🔥 核心：sidebar自己维护高亮，完全不依赖别人
const currentActive = ref('')

// 点击菜单 → 立刻高亮 + 存pinia
const handleClick = (item) => {
  currentActive.value = item.name
  store.setActiveMenu(item.name)
}

// 🔥 刷新/第一次进入：从路由匹配当前高亮
onMounted(() => {
  const currentPath = router.currentRoute.value.path
  const matched = menuList.find(item => item.path === currentPath)
  if (matched) {
    currentActive.value = matched.name
    store.setActiveMenu(matched.name)
  }
})

// 弹窗
const openMorePop = () => isShowMorePop.value = true
const closeMorePop = () => isShowMorePop.value = false

onMounted(() => {
  document.addEventListener('click', closeMorePop)
})
onUnmounted(() => {
  document.removeEventListener('click', closeMorePop)
})
</script>

<style lang="scss">
/* 你的样式完全不变 */
.sidebar {
  width: 164px;
  height: 100vh;
  background-color: #141418;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  position: relative;
}

.logo {
  width: 74px;
  height: 35px;
  margin-bottom: 30px;
  cursor: pointer;
}

.menu-item,
.support-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  width: 100%;
  border-radius: 30px;

  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }

  span {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  }

  .ai {
    margin-left: -10px;
    font-size: 10px;
    font-weight: 500;
    color: #157d6b;
    background: rgba(86, 209, 191, 0.16);
    border-radius: 6px;
    padding: 1px 4px;
    line-height: 1.4;
  }
}

.menu-item img.profile-picture {
  filter: none !important;
  border-radius: 50%;
}

.menu-item:hover,
.support-item:hover {
  background-color: #1D1D21;
}

.menu-item.active {
  background-color: #1D1D21 !important;
}

.menu-list {
  width: 100%;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.support {
  margin-top: auto;
  width: 100%;
  padding: 0 12px;
}

.more-pop {
  position: absolute;
  bottom: 80px;
  left: 20px;
}
</style>
