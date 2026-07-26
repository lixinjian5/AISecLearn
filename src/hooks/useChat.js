import { useState, useCallback } from 'react'
import { callAI } from '../services/aiService'
import { buildMessages } from '../utils/aiTutorPrompt'

/**
 * 聊天状态管理 Hook
 * 管理消息列表、发送消息、加载状态
 */
export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 发送消息
  const sendMessage = useCallback(async (userInput) => {
    if (!userInput.trim() || isLoading) return

    const userMessage = { role: 'user', content: userInput }

    // 立即显示用户消息
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 构建完整的消息列表（System Prompt + 历史 + 新消息）
      const allMessages = buildMessages([...messages, userMessage])
      const reply = await callAI(allMessages)

      // 添加 AI 回复
      const aiMessage = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      // 错误消息以 AI 消息形式展示
      const errorMessage = {
        role: 'assistant',
        content: `😅 抱歉，出了点问题：${error.message}\n\n请检查 API Key 是否正确配置。`,
        isError: true,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  // 清空聊天
  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  }
}
