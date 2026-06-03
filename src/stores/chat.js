import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatList: [],
    currentChatId: null,
    sidebarOpen: true
  }),

  actions: {
    createChat() {
      const newChat = {
        id: Date.now(),           // 用时间戳作为唯一ID
        title: '新对话',
        messages: [],
        createdAt: new Date()
      }
      this.chatList.unshift(newChat)  // 添加到列表开头
      this.currentChatId = newChat.id // 设为当前聊天
      return newChat.id
    },
    addMessage(chatId, message) {
      const chat = this.chatList.find(c => c.id === chatId)
      if (chat) {
        chat.messages.push(message)
        // 如果是第一条消息，更新聊天标题
        if (chat.messages.length === 1) {
          chat.title = message.content.substring(0, 20) + '...'
        }
      }
    }
    ,
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    }
    ,
    deleteChat(chatId) {
      this.chatList = this.chatList.filter(c => c.id !== chatId)
      if (this.currentChatId === chatId) {
        this.currentChatId = this.chatList[0]?.id || null
      }
    }

  }
})