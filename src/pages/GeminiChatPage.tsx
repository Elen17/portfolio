import { DeleteOutlined, SendOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Space, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { generateGeminiReply, isGeminiConfigured, type ChatMessage } from '../api/gemini'
import '../styles/gemini-chat.css'
import cvMarkdown from '../../cv.md?raw'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const { Title, Text, Paragraph } = Typography

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const STORAGE_KEY = 'portfolio.geminiChat.v1'

export default function GeminiChatPage() {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as ChatMessage[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const configured = isGeminiConfigured()
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length, busy])

  const send = async () => {
    const text = draft.trim()
    if (!text || busy) return

    setError(null)
    setDraft('')

    const userMsg: ChatMessage = { id: createId(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])

    setBusy(true)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      const reply = await generateGeminiReply({
        messages: [...messages, userMsg],
        cvMarkdown,
        signal: abortRef.current.signal,
      })
      const modelMsg: ChatMessage = { id: createId(), role: 'model', text: reply }
      setMessages((prev) => [...prev, modelMsg])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to reach Gemini.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  const clear = () => {
    abortRef.current?.abort()
    setBusy(false)
    setError(null)
    setMessages([])
    setDraft('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="gchat">
      <div className="gchat-head">
        <div>
          <Text className="gchat-eyebrow">EXPERIMENTAL ROUTE</Text>
          <Title level={2} className="gchat-title">
            Gemini Chat Integration
          </Title>
          <Paragraph className="gchat-desc">
            A small interactive extension to the portfolio. Messages are kept locally in your browser.
          </Paragraph>
        </div>

        <Button icon={<DeleteOutlined />} onClick={clear}>
          Clear
        </Button>
      </div>

      {!configured && (
        <Alert
          type="warning"
          showIcon
          message="Gemini API key not configured"
          description={
            <div className="gchat-alert">
              <Text>
                Add <Text code>VITE_GEMINI_API_KEY</Text> to <Text code>.env.local</Text> and restart the dev server.
              </Text>
            </div>
          }
        />
      )}
      {configured && (
        <Alert
          type="success"
          showIcon
          message="Gemini configured"
          description={<Text type="secondary">API key detected by Vite env.</Text>}
        />
      )}

      {error && <Alert type="error" showIcon message="Request failed" description={error} />}

      <Card className="gchat-card">
        <div className="gchat-thread" ref={scrollRef} aria-label="Chat transcript">
          {messages.length === 0 ? (
            <div className="gchat-empty">
              <Text type="secondary">Ask something like “Review my portfolio UX and suggest improvements”.</Text>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'gchat-bubble gchat-bubble--user' : 'gchat-bubble'}>
                <Text className="gchat-bubble__role">{m.role === 'user' ? 'You' : 'Gemini'}</Text>
                {m.role === 'user' ? (
                  <div className="gchat-bubble__text">{m.text}</div>
                ) : (
                  <div className="gchat-bubble__markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          )}
          {busy && (
            <div className="gchat-bubble">
              <Text className="gchat-bubble__role">Gemini</Text>
              <div className="gchat-bubble__text gchat-bubble__text--loading">Thinking…</div>
            </div>
          )}
        </div>

        <Space.Compact className="gchat-compose">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Type a message…"
            disabled={busy}
            aria-label="Message input"
          />
          <Button type="primary" icon={<SendOutlined />} onClick={() => void send()} disabled={busy || !draft.trim()}>
            Send
          </Button>
        </Space.Compact>
      </Card>
    </div>
  )
}

