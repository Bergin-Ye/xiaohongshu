export async function sendChatMessage(messages, onChunk, onComplete, onError) {
  try {
    // 1. 调用后端 API
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    // 2. 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 3. 读取流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    // 4. 循环读取数据块
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // 5. 解码数据块
      const chunk = decoder.decode(value)

      // 6. 解析 SSE 格式的数据
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)  // 去掉 "data: " 前缀

          // 7. 检查是否结束
          if (data === '[DONE]') {
            onComplete?.()
            return
          }

          // 8. 解析 JSON 数据
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content

            // 9. 如果有内容，调用回调函数
            if (content) {
              onChunk?.(content)
            }
          } catch (e) {
            // 忽略解析错误（可能是不完整的数据）
          }
        }
      }
    }

    // 10. 流读取完成
    onComplete?.()

  } catch (error) {
    console.error('API 调用错误:', error)
    onError?.(error)
  }
}