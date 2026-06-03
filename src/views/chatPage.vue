<template>
  <div class="chat-page">
    <!-- 侧边栏组件（在图标左边） -->
    <chatSidebar ref="sidebarRef" />

    <!-- 聊天内容区 -->
    <div class="chat-content">
      <!-- 顶部：图标 + 标题 -->
      <div class="chat-header">
        <div class="header-left">
          <div class="sidebar-toggle" @click="toggleSidebar">
            <img :src="isSidebarExpanded ? leftIcon : rightIcon" alt="">
          </div>
          <div class="new-chat-btn" @click="goToNewChat">
            <img :src="newChatIcon" alt="">
          </div>
        </div>
        <div class="chat-title">{{ currentChat?.title || '新对话' }}</div>
        <div class="header-right"></div>
      </div>

      <!-- 消息列表 -->
      <div class="messages" ref="messagesRef">
        <div
          v-for="msg in currentChat?.messages"
          :key="msg.id"
          class="message"
          :class="msg.role"
        >
          <div class="message-content">
            {{ msg.content }}
          </div>
        </div>

        <!-- AI 正在输入的提示 -->
        <div v-if="isLoading" class="message assistant">
          <div class="message-content typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- 输入框（与 diandian 页面一致） -->
      <div class="searchBar">
        <textarea
          v-model="inputText"
          @keydown.enter.exact="sendMessage"
          placeholder="与点点对话，获取更丰富的信息"
          :disabled="isLoading"
        ></textarea>
        <div class="bottomBox">
          <div class="bottomBox-left">
            <img :src="addIcon" class="add-icon">
          </div>
          <div class="bottomBox-right">
            <div class="search" :class="{ active: inputText.trim() }" @click="sendMessage">
              <img :src="searchIcon" class="search-icon" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { sendChatMessage } from '@/api/chat'
import chatSidebar from '@/components/chatSidebar.vue'

// 导入 SVG 图标
const rightIcon = new URL('@/assets/右侧边栏.svg', import.meta.url).href
const leftIcon = new URL('@/assets/左侧边栏.svg', import.meta.url).href
const newChatIcon = new URL('@/assets/chat-new-line.svg', import.meta.url).href
const addIcon = new URL('@/assets/加.svg', import.meta.url).href
const searchIcon = new URL('@/assets/搜索.svg', import.meta.url).href

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()

// 侧边栏相关
const sidebarRef = ref(null)
const isSidebarExpanded = ref(false)

const toggleSidebar = () => {
  sidebarRef.value?.toggle()
  isSidebarExpanded.value = !isSidebarExpanded.value
}

// 消息相关
const messagesRef = ref(null)
const inputText = ref('')
const isLoading = ref(false)

// 当前聊天
const currentChat = computed(() => {
  return chatStore.chatList.find(c => c.id === Number(route.params.id))
})

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 发送消息
const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const chatId = Number(route.params.id)
  const content = inputText.value.trim()

  // 添加用户消息
  chatStore.addMessage(chatId, {
    id: Date.now(),
    role: 'user',
    content: content
  })

  inputText.value = ''
  scrollToBottom()

  // 添加 AI 消息占位符
  const aiMessageId = Date.now() + 1
  chatStore.addMessage(chatId, {
    id: aiMessageId,
    role: 'assistant',
    content: ''
  })

  isLoading.value = true

  try {
    // 构建消息历史，添加系统提示
    const messages = [
      {
        role: 'system',
        content: '你是MiMo，是小米公司研发的AI智能助手。请直接回答用户问题，不要输出思考过程。'
      },
      ...currentChat.value.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    // 调用 API 并处理流式响应
    await sendChatMessage(
      messages,
      // onChunk
      (chunk) => {
        const aiMessage = currentChat.value.messages.find(m => m.id === aiMessageId)
        if (aiMessage) {
          aiMessage.content += chunk
          scrollToBottom()
        }
      },
      // onComplete
      () => {
        isLoading.value = false
      },
      // onError
      (error) => {
        console.error('AI 回复错误:', error)
        const aiMessage = currentChat.value.messages.find(m => m.id === aiMessageId)
        if (aiMessage) {
          aiMessage.content = '抱歉，AI 服务暂时不可用，请稍后再试。'
        }
        isLoading.value = false
      }
    )
  } catch (error) {
    console.error('发送消息错误:', error)
    isLoading.value = false
  }
}

// 新建会话
const goToNewChat = () => {
  router.push('/diandian')
}

// 自动调用 AI 回复（当有初始消息时）
const autoReply = async () => {
  const chatId = Number(route.params.id)
  const chat = chatStore.chatList.find(c => c.id === chatId)

  // 如果聊天有用户消息但没有 AI 回复，自动调用 AI
  if (chat && chat.messages.length === 1 && chat.messages[0].role === 'user') {
    const aiMessageId = Date.now()
    chatStore.addMessage(chatId, {
      id: aiMessageId,
      role: 'assistant',
      content: ''
    })

    isLoading.value = true
    scrollToBottom()

    try {
      const messages = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      await sendChatMessage(
        messages,
        (chunk) => {
          const aiMessage = chat.messages.find(m => m.id === aiMessageId)
          if (aiMessage) {
            aiMessage.content += chunk
            scrollToBottom()
          }
        },
        () => {
          isLoading.value = false
        },
        (error) => {
          console.error('AI 回复错误:', error)
          const aiMessage = chat.messages.find(m => m.id === aiMessageId)
          if (aiMessage) {
            aiMessage.content = '抱歉，AI 服务暂时不可用，请稍后再试。'
          }
          isLoading.value = false
        }
      )
    } catch (error) {
      console.error('自动回复错误:', error)
      isLoading.value = false
    }
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      nextTick(() => {
        scrollToBottom()
        autoReply()
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  scrollToBottom()
  autoReply()
})
</script>

<style lang="scss" scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

.header-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 32px;
    height: 32px;
  }
}

.new-chat-btn {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    margin-top: 3px;
    width: 24px;
    height: 24px;
  }
}

.header-right {
  width: 120px;
}

.chat-content {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #19191E;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.chat-title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  flex: 1;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  box-sizing: border-box;
}

.message {
  display: flex;
  width: 80%;
  max-width: 800px;
  min-width: 300px;
  box-sizing: border-box;

  &.user {
    justify-content: flex-end;

    .message-content {
      background: #333;
      color: #fff;
      border-radius: 18px 18px 4px 18px;
    }
  }

  &.assistant {
    justify-content: flex-start;

    .message-content {
      background: transparent;
      color: #fff;
    }
  }
}

.message-content {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.typing {
  display: flex;
  gap: 4px;
  padding: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #666;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 输入框样式（与 diandian 页面一致） */
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
  margin: 15px auto;
  flex-shrink: 0;
  box-sizing: border-box;

  textarea {
    width: 100%;
    height: 40px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    resize: none;
    color: #fff;

    &::placeholder {
      font-size: 16px;
      color: #999;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
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

  &:hover {
    cursor: pointer;
    background-color: #393941;
  }
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

  .search-icon {
    filter: invert(1);
  }
}
</style>
