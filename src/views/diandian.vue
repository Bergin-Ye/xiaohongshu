<template>
  <div class="chatHomePage">
    <!-- 侧边栏组件（在图标左边） -->
    <chatSidebar ref="sidebarRef" />

    <!-- 图标按钮（独立） -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <img :src="isSidebarExpanded ? leftIcon : rightIcon" alt="">
    </div>

    <!-- 主内容区 -->
    <div class="center-container">
      <div class="title">
        <img :src="dian" alt="">下午好，想探索些什么？
      </div>

      <div class="searchBar">
        <textarea
          v-model="inputText"
          placeholder="与点点对话，获取更丰富的信息"
          @keydown.enter.exact="sendMessage"
        ></textarea>
        <div class="bottomBox">
          <div class="bottomBox-left">
            <img :src="add" class="add-icon">
          </div>

          <div class="bottomBox-right">
            <div class="search" :class="{ active: inputText.trim() }" @click="sendMessage">
              <img :src="search" class="search-icon" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import chatSidebar from '@/components/chatSidebar.vue'

// 导入 SVG 图标
const dian = new URL('@/assets/diandian.svg', import.meta.url).href
const add = new URL('@/assets/加.svg', import.meta.url).href
const search = new URL('@/assets/搜索.svg', import.meta.url).href
const rightIcon = new URL('@/assets/右侧边栏.svg', import.meta.url).href
const leftIcon = new URL('@/assets/左侧边栏.svg', import.meta.url).href

const router = useRouter()
const chatStore = useChatStore()

// 侧边栏相关
const sidebarRef = ref(null)
const isSidebarExpanded = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  sidebarRef.value?.toggle()
  isSidebarExpanded.value = !isSidebarExpanded.value
}

// 输入框
const inputText = ref('')

// 发送消息
const sendMessage = () => {
  if (!inputText.value.trim()) return

  // 创建新聊天
  const chatId = chatStore.createChat()

  // 添加用户消息
  chatStore.addMessage(chatId, {
    id: Date.now(),
    role: 'user',
    content: inputText.value.trim()
  })

  // 跳转到聊天页面，并传递初始消息
  router.push({
    path: `/diandian/chat/${chatId}`,
    query: { initialMessage: inputText.value.trim() }
  })

  inputText.value = ''
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chatHomePage {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: flex-start;  // 让所有子元素在顶部
}

.sidebar-toggle {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 32px;
    height: 32px;
  }
}
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex: 1;
  height: 100vh;
}

.title {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;

  img {
    width: 48px;
    height: 48px;
  }
}

.searchBar {
  width: 80%;
  max-width: 800px;
  min-width: 300px;
  background-color: #29292E;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgb(86, 209, 191);
}

textarea {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  resize: none;
  color: #fff;
}

textarea::placeholder {
  font-size: 16px;
  color: #999;
}

.bottomBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bottomBox-left {
  padding: 8px;
  border-radius: 8px;
}

.bottomBox-left:hover {
  cursor: pointer;
  background-color: #393941;
}

.add-icon {
  width: 16px;
  height: 16px;
}

.search {
  width: 32px;
  height: 32px;
  background-color: #3A3A3E;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  .search-icon {
    width: 18px;
    height: 18px;
  }
}

.search.active {
  background-color: #ffffff;


}
</style>
