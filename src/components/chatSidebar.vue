<template>
  <div class="chat-sidebar" :class="{ expanded: isExpanded }">

    <!-- 展开后显示的内容 -->
    <div class="sidebar-content" v-if="isExpanded">
      <!-- 新建会话 -->
      <div class="new-chat" @click="createNewChat">
        <img :src="newChatIcon" alt="">
        <span>新建会话</span>
      </div>

      <!-- 分隔线 -->
      <div class="divider"></div>

      <!-- 聊天记录列表 -->
      <div class="chat-list">
        <!-- 今天的对话 -->
        <div class="date-group" v-if="todayChats.length > 0">
          <div class="date-title">今天</div>
          <div
            v-for="chat in todayChats"
            :key="chat.id"
            class="chat-item"
            :class="{ active: chat.id === chatStore.currentChatId }"
            @click="goToChat(chat.id)"
          >
            <span class="chat-title">{{ chat.title }}</span>
            <button class="delete-btn" @click.stop="deleteChat(chat.id)">×</button>
          </div>
        </div>

        <!-- 之前的对话 -->
        <div class="date-group" v-if="olderChats.length > 0">
          <div class="date-title">之前</div>
          <div
            v-for="chat in olderChats"
            :key="chat.id"
            class="chat-item"
            :class="{ active: chat.id === chatStore.currentChatId }"
            @click="goToChat(chat.id)"
          >
            <span class="chat-title">{{ chat.title }}</span>
            <button class="delete-btn" @click.stop="deleteChat(chat.id)">×</button>
          </div>
        </div>

        <!-- 没有聊天记录时显示 -->
        <div class="empty-state" v-if="chatStore.chatList.length === 0">
          <p>暂无聊天记录</p>
          <p>点击上方开始新对话</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'

// 导入 SVG 图标
const newChatIcon = new URL('@/assets/chat-new-line.svg', import.meta.url).href

// 路由和状态管理
const router = useRouter()
const chatStore = useChatStore()

// 展开状态
const isExpanded = ref(false)

// 切换展开/收起
const toggle = () => {
  isExpanded.value = !isExpanded.value
}

// 计算今天的聊天
const todayChats = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return chatStore.chatList.filter(chat => {
    const chatDate = new Date(chat.createdAt)
    return chatDate >= today
  })
})

// 计算之前的聊天
const olderChats = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return chatStore.chatList.filter(chat => {
    const chatDate = new Date(chat.createdAt)
    return chatDate < today
  })
})

// 新建聊天
const createNewChat = () => {
  const chatId = chatStore.createChat()
  router.push(`/diandian/chat/${chatId}`)
}

// 跳转到聊天
const goToChat = (chatId) => {
  chatStore.currentChatId = chatId
  router.push(`/diandian/chat/${chatId}`)
}

// 删除聊天
const deleteChat = (chatId) => {
  chatStore.deleteChat(chatId)
  // 如果删除后没有聊天了，跳转到首页
  if (chatStore.chatList.length === 0) {
    router.push('/diandian')
  }
}

// 暴露给父组件
defineExpose({
  isExpanded,
  toggle
})
</script>

<style lang="scss" scoped>
.chat-sidebar {
  width: 0;  // 收起时宽度为0
  height: 100%;
  background: rgb(20, 20, 24);
  transition: width 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;

  &.expanded {
    width: 250px;  // 展开时宽度
  }
}

.sidebar-content {
  padding: 10px;
  width: 250px;  // 固定宽度，防止内容被压缩
}

.new-chat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  cursor: pointer;
  border-radius: 20px;

  &:hover {
    background: #333;
  }

  img {
    width: 20px;
    height: 20px;
  }

  span {
    color: #fff;
    font-size: 14px;
  }
}

.divider {
  height: 1px;
  background: #333;
  margin: 10px 0;
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.date-group {
  margin-bottom: 15px;
}

.date-title {
  color: #999;
  font-size: 12px;
  padding: 5px 10px;
  margin-bottom: 5px;
}

.chat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  border-radius: 20px;
  margin-bottom: 2px;

  &:hover {
    background: #333;

    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background: #2a2a2a;
  }
}

.chat-title {
  color: #fff;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.delete-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0 5px;

  &:hover {
    color: #ff4444;
  }
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;

  p {
    margin-bottom: 5px;
    font-size: 13px;
  }
}
</style>
