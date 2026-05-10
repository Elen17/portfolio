import { DeleteOutlined, SendOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Typography } from 'antd'
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

const SUGGESTIONS = [
  'What technologies do you specialize in?',
  'Tell me about your most recent project.',
  "What's your experience with backend systems?",
  'How do you approach system design?',
]

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
    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, busy])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const sendText = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setError(null)
    setDraft('')

    const userMsg: ChatMessage = { id: createId(), role: 'user', text: trimmed }
    const modelMsgId = createId()

    setMessages((prev) => [...prev, userMsg, { id: modelMsgId, role: 'model', text: '' }])
    setBusy(true)

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      await generateGeminiReply({
        messages: [...messages, userMsg],
        cvMarkdown,
        signal: abortRef.current.signal,
        onChunk: (partial) => {
          setMessages((prev) => prev.map((m) => (m.id === modelMsgId ? { ...m, text: partial } : m)))
        },
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        setMessages((prev) => prev.filter((m) => m.id !== modelMsgId || m.text.trim()))
        return
      }
      setMessages((prev) => prev.filter((m) => m.id !== modelMsgId))
      setError(e instanceof Error ? e.message : 'Failed to reach Gemini.')
    } finally {
      setBusy(false)
    }
  }

  const send = () => sendText(draft)

  const clear = () => {
    abortRef.current?.abort()
    setBusy(false)
    setError(null)
    setMessages([])
    setDraft('')
  }

  const isStreamingLast =
    busy && messages.length > 0 && messages[messages.length - 1].role === 'model'

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

      {error && (
        <Alert
          type="error"
          showIcon
          message="Request failed"
          description={error}
          closable
          onClose={() => setError(null)}
        />
      )}

      <Card className="gchat-card">
        <div className="gchat-thread" ref={scrollRef} aria-label="Chat transcript">
          {messages.length === 0 ? (
            <div className="gchat-empty">
              <Text type="secondary" className="gchat-empty__hint">
                Ask something about the portfolio, for example:
              </Text>
              <div className="gchat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="gchat-suggestion" onClick={() => void sendText(s)} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              const streaming = isStreamingLast && i === messages.length - 1
              return (
                <div
                  key={m.id}
                  className={[
                    'gchat-bubble',
                    m.role === 'user' ? 'gchat-bubble--user' : '',
                    streaming ? 'gchat-bubble--streaming' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Text className="gchat-bubble__role">{m.role === 'user' ? 'You' : 'Gemini'}</Text>
                  {m.role === 'user' ? (
                    <div className="gchat-bubble__text">{m.text}</div>
                  ) : (
                    <div className="gchat-bubble__markdown">
                      {m.text ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                      ) : (
                        <span className="gchat-bubble__text gchat-bubble__text--loading">Thinking…</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="gchat-compose">
          <Input.TextArea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            disabled={busy}
            autoSize={{ minRows: 1, maxRows: 5 }}
            aria-label="Message input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => void send()}
            disabled={busy || !draft.trim()}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}
