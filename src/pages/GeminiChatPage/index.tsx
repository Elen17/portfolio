import { AudioMutedOutlined, AudioOutlined, DeleteOutlined, PauseCircleOutlined, SendOutlined, SoundOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Input, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { generateGeminiReply, isGeminiConfigured, type ChatMessage } from '../../api/gemini'
import { createTalk, getDidSourceUrl, isDidConfigured, pollTalkUntilTerminal } from '../../api/did'
import avatarImg from '../../assets/avatar.png'
import cvMarkdown from '../../../cv.md?raw'
import { DID_INTRO_PROMPT, STORAGE_KEY, SUGGESTIONS } from './consts'
import { createId, loadStoredMessages } from './utils'
import './styles.css'

const { Title, Text, Paragraph } = Typography

type DidPhase = 'idle' | 'script' | 'talk' | 'polling' | 'done' | 'error'

export default function GeminiChatPage() {
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredMessages(STORAGE_KEY))

  const [didPhase, setDidPhase] = useState<DidPhase>('idle')
  const [didVideo, setDidVideo] = useState<string | null>(null)
  const [didErr, setDidErr] = useState<string | null>(null)

  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const speechSupported =
    typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';

  const stopSpeaking = () => {
    if (!speechSupported) return
    window.speechSynthesis.cancel()
    setSpeakingId(null)
  }

  const speak = (id: string, text: string) => {
    if (!speechSupported) return
    if (speakingId === id) {
      stopSpeaking()
      return
    }
    const plain = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_>#~]/g, '')
      .trim()
    if (!plain) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(plain)
    utterance.onend = () => setSpeakingId((curr) => (curr === id ? null : curr))
    utterance.onerror = () => setSpeakingId((curr) => (curr === id ? null : curr))
    setSpeakingId(id)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel()
    }
  }, [speechSupported])

  const configured = isGeminiConfigured()
  const didSourceUrl = getDidSourceUrl()
  const didReady = isDidConfigured() && Boolean(didSourceUrl)
  const didBusy = didPhase === 'script' || didPhase === 'talk' || didPhase === 'polling'

  const abortRef = useRef<AbortController | null>(null)
  const didAbortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<{ stop: () => void; abort: () => void } | null>(null)
  const SpeechRecognitionCtor =
    typeof window !== 'undefined'
      ? (window as unknown as {
          SpeechRecognition?: new () => SpeechRecognition
          webkitSpeechRecognition?: new () => SpeechRecognition
        }).SpeechRecognition ??
        (window as unknown as {
          SpeechRecognition?: new () => SpeechRecognition
          webkitSpeechRecognition?: new () => SpeechRecognition
        }).webkitSpeechRecognition
      : undefined
  const recognitionSupported = Boolean(SpeechRecognitionCtor)

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  const startListening = () => {
    if (!SpeechRecognitionCtor || busy) return
    if (listening) {
      stopListening()
      return
    }
    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const parts: string[] = []
      for (let i = 0; i < event.results.length; i++) {
        parts.push(event.results[i][0]?.transcript ?? '')
      }
      const transcript = parts.join(' ').trim()
      if (!transcript) return
      setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }
    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }
    recognition.onerror = () => {
      setListening(false)
      recognitionRef.current = null
    }
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

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
      didAbortRef.current?.abort()
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

  const generateDidIntro = async () => {
    if (!didSourceUrl) {
      setDidErr('VITE_DID_SOURCE_URL is not set.')
      setDidPhase('error')
      return
    }
    if (import.meta.env.VITE_VIDEO_PATH_URL) {
      setDidVideo(import.meta.env.VITE_VIDEO_PATH_URL);
      setDidPhase('done')
      return;
    }
    setDidPhase('script')
    setDidErr(null)
    setDidVideo(null)
    didAbortRef.current?.abort()
    didAbortRef.current = new AbortController()
    const signal = didAbortRef.current.signal

    try {
      const script = await generateGeminiReply({
        messages: [{ id: createId(), role: 'user', text: DID_INTRO_PROMPT }],
        cvMarkdown,
        signal,
      })

      setDidPhase('talk')
      const talk = await createTalk({ sourceUrl: didSourceUrl, text: script, signal })

      setDidPhase('polling')
      const result = await pollTalkUntilTerminal({ id: talk.id, signal })

      if (result.status === 'done' && result.result_url) {
        setDidVideo(result.result_url)
        setDidPhase('done')
      } else {
        throw new Error(`D-ID talk ended with status "${result.status}".`)
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') { setDidPhase('idle'); return }
      setDidErr(e instanceof Error ? e.message : 'D-ID generation failed.')
      setDidPhase('error')
    }
  }

  const resetDid = () => {
    didAbortRef.current?.abort()
    setDidPhase('idle')
    setDidVideo(import.meta.env.VITE_VIDEO_PATH_URL);
    setDidErr(null)
  }

  const send = () => sendText(draft)

  const clear = () => {
    abortRef.current?.abort()
    stopSpeaking()
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
        <div className="gchat-did">
          <div className="gchat-did-media">
            {didPhase === 'done' && didVideo ? (
              <video className="gchat-did-video" src={didVideo} controls autoPlay playsInline />
            ) : (
              <img className="gchat-did-img" src={avatarImg} alt="Elen Khachatryan" />
            )}
          </div>
          <div className="gchat-did-content">
            <Title level={5} className="gchat-did-title">AI Introduction</Title>
            <Paragraph className="gchat-did-body">
              CV Intro
            </Paragraph>

            {!didReady && (
              <Alert
                type="warning"
                showIcon
                message="D-ID not configured"
                description={
                  <Text>
                    Add <Text code>VITE_DID_API_KEY</Text> and <Text code>VITE_DID_SOURCE_URL</Text> to{' '}
                    <Text code>.env.local</Text>.
                  </Text>
                }
              />
            )}

            {didErr && (
              <Alert type="error" showIcon message={didErr} closable onClose={resetDid} />
            )}

            {didBusy && (
              <Text type="secondary" className="gchat-did-status">
                {didPhase === 'script' && 'Writing script with Gemini…'}
                {didPhase === 'talk' && 'Sending to D-ID…'}
                {didPhase === 'polling' && 'Rendering avatar video…'}
              </Text>
            )}

            <div className="gchat-did-actions">
              {didPhase === 'done' ? (
                <Button onClick={resetDid}>Regenerate</Button>
              ) : (
                <Button
                  type="primary"
                  loading={didBusy}
                  disabled={!didReady || didBusy}
                  onClick={() => void generateDidIntro()}
                >
                  Generate Introduction
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

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
                  <div className="gchat-bubble__header">
                    <Text className="gchat-bubble__role">{m.role === 'user' ? 'You' : 'Gemini'}</Text>
                    {speechSupported && m.text.trim() && (
                      <Button
                        type="text"
                        size="small"
                        className="gchat-bubble__audio"
                        icon={speakingId === m.id ? <PauseCircleOutlined /> : <SoundOutlined />}
                        aria-label={speakingId === m.id ? 'Stop reading message' : 'Read message aloud'}
                        onClick={() => speak(m.id, m.text)}
                      />
                    )}
                  </div>
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
          {recognitionSupported && (
            <Button
              icon={listening ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={startListening}
              disabled={busy}
              aria-label={listening ? 'Stop voice input' : 'Start voice input'}
              danger={listening}
            />
          )}
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
