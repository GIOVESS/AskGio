"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { TypingIndicator } from "@/components/typing-indicator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 60000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout)),
  ])
}

const sanitizeResponse = (response: string) => {
  return response.replace(/\*\*/g, "").trim()
}

export default function ChatInterface() {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hi there! I'm AskGio. How can I help you today?",
          timestamp: Date.now(),
        },
      ])
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => setIsTyping(true), 500)

    try {
      const response = await fetchWithTimeout("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      }, 60000) // 60-second timeout

      if (!response.ok) throw new Error("Failed to get a response from the server.")

      const data = await response.json()
      setIsTyping(false)

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: sanitizeResponse(data.response) || "Sorry, I couldn't process your request.",
          timestamp: Date.now(),
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error && error.message === "Request timed out"
            ? "The server took too long to respond. Please try again later."
            : "An error occurred. Please try again later.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Clear chat history
  const clearChat = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the chat history?")
    if (confirmClear) {
      setMessages([
        {
          id: "welcome-new",
          role: "assistant",
          content: "Chat history cleared. How can I help you today?",
          timestamp: Date.now(),
        },
      ])
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-50 dark:bg-gray-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Code className="mr-2 h-6 w-6 text-primary" />
              <h1 className="text-lg font-normal text-gray-800 dark:text-gray-200">AskGio</h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <button
                onClick={clearChat}
                className="w-full flex items-center px-3 py-2 text-sm font-normal text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <span>Clear Chat</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <p className="px-3 py-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                AskGio is a simple AI assistant.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs font-normal text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} AskGio</p>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        title="Toggle mobile menu"
        className="fixed bottom-4 left-4 z-50 md:hidden bg-green-600 text-white p-3 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 px-4 md:px-6">
          <h2 className="text-lg font-normal text-gray-800 dark:text-gray-200">Chat with AskGio</h2>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 md:px-6 py-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[85%] md:max-w-[75%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    } items-start gap-3`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full ${
                        message.role === "user" ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Bot className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-green-50 dark:bg-green-900/30 text-gray-800 dark:text-gray-200"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="text-sm font-normal whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[85%] md:max-w-[75%]">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Bot className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 md:px-6">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="pr-12 py-3 text-base font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus-visible:ring-green-500 rounded-lg"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded-md"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-center font-normal text-gray-500 dark:text-gray-400">
              AskGio can make mistakes. Consider checking important information.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}