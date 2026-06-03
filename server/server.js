const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// 中间件配置
app.use(cors())                    // 允许跨域请求
app.use(express.json())            // 解析 JSON 请求体

// 健康检查接口（测试服务器是否正常）
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' })
})

// MIMO API 代理接口
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    // 验证请求数据
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息格式错误' })
    }

    console.log('收到消息请求，消息数量:', messages.length)

    // 调用 MIMO API
    const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MIMO_API_KEY
      },
      body: JSON.stringify({
        model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
        messages: messages,
        stream: true,           // 启用流式响应
        temperature: 1.0,
        max_completion_tokens: 2048
      })
    })

    // 检查 API 响应状态
    if (!response.ok) {
      const errorText = await response.text()
      console.error('MIMO API 错误:', response.status, errorText)
      return res.status(response.status).json({
        error: `AI 服务错误: ${response.status}`
      })
    }

    // 设置 SSE (Server-Sent Events) 头
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // 转发流式响应给前端
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      res.write(chunk)
    }

    res.end()

  } catch (error) {
    console.error('服务器错误:', error)

    // 如果还没有发送响应头，才发送错误响应
    if (!res.headersSent) {
      res.status(500).json({
        error: '服务器内部错误，请稍后再试'
      })
    }
  }
})

// 启动服务器
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`
  ========================================
  🚀 服务器已启动
  📍 地址: http://localhost:${PORT}
  🔗 健康检查: http://localhost:${PORT}/api/health
  ========================================
  `)
})