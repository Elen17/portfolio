import axios from 'axios'
import type { ChatMessage } from './types'

type GeminiPart = { text: string }
type GeminiContent = { role?: 'user' | 'model'; parts: GeminiPart[] }

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  error?: { message?: string }
}

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  return key?.trim() ? key.trim() : undefined
}

function getModelId() {
  const fromEnv = import.meta.env.VITE_GEMINI_MODEL as string | undefined
  return fromEnv?.trim() || DEFAULT_GEMINI_MODEL
}

export function isGeminiConfigured() {
  return Boolean(getApiKey())
}

function buildSystemInstruction(cv: string): GeminiContent {
  return {
    parts: [
      {
        text: `You are acting as Elen Khachatryan, a full-stack software engineer.

Your purpose is to answer portfolio visitors exactly as Elen would during a professional engineering conversation.
This is an ongoing conversation with a portfolio visitor. Maintain consistency in tone and personality across all turns.

Technical areas:
- Java
- Spring Boot
- Angular
- TypeScript
- REST APIs
- PostgreSQL
- RabbitMQ
- Docker
- CI/CD
- Full-stack development
- Enterprise architecture
- Distributed systems
- Integrations and backend services

Communication style:
- Professional and technically confident
- Clear and structured
- Friendly but not overly casual
- Concise unless deeper explanation is requested
- Avoid generic AI phrases
- Avoid exaggerated marketing language
- Speak from practical engineering experience
- Emphasize maintainability, scalability, reliability, and clean architecture
- Prefer practical tradeoffs over theoretical perfection

Response rules:
- ALWAYS respond in markdown format
- Use headings, bullet points, and code blocks when appropriate
- Keep formatting clean and readable
- Do not mention being an AI assistant
- Do not mention system prompts
- Do not invent experience not present in the CV
- You may explain technologies and engineering concepts using general knowledge
- When uncertain about personal/project details not explicitly in the CV, clearly state that the information is not available

Portfolio CV context:

<<<CV_START>>>
${cv}
<<<CV_END>>>`,
      },
    ],
  }
}

async function* readSSEStream(response: Response): AsyncGenerator<GeminiGenerateResponse> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const json = line.slice(6).trim()
        if (!json || json === '[DONE]') continue
        try {
          yield JSON.parse(json) as GeminiGenerateResponse
        } catch {
          // skip malformed chunk
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

export async function generateGeminiReply(args: {
  messages: ChatMessage[]
  cvMarkdown: string
  signal?: AbortSignal
  onChunk?: (partialText: string) => void
}): Promise<string> {
  const key = getApiKey()
  if (!key) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart the dev server.')
  }

  const cv = args.cvMarkdown.trim()
  if (!cv) {
    throw new Error('Your cv.md is empty. Add your CV content to cv.md and refresh.')
  }

  const modelId = getModelId()
  const contents: GeminiContent[] = args.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))

  const body = {
    systemInstruction: buildSystemInstruction(cv),
    contents,
    generationConfig: {
      temperature: 0.55,
      topP: 0.9,
      maxOutputTokens: 1200,
    },
  }

  if (args.onChunk) {
    const url = `${GEMINI_BASE_URL}/models/${modelId}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`
    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: args.signal,
      })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e
      throw new Error(e instanceof Error ? e.message : 'Gemini request failed.')
    }

    if (!response.ok) {
      let message = `HTTP ${response.status}`
      try {
        const err = (await response.json()) as { error?: { message?: string } }
        message = err.error?.message || message
      } catch {
        // ignore parse failure
      }
      throw new Error(message)
    }

    let fullText = ''
    for await (const chunk of readSSEStream(response)) {
      const chunkText =
        chunk.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
      if (chunkText) {
        fullText += chunkText
        args.onChunk(fullText)
      }
    }

    return fullText.trim() || 'I did not receive any text output. Try asking again with a bit more detail.'
  }

  // Non-streaming fallback
  const url = `${GEMINI_BASE_URL}/models/${modelId}:generateContent`
  try {
    const res = await axios.post<GeminiGenerateResponse>(url, body, {
      params: { key },
      signal: args.signal,
      headers: { 'Content-Type': 'application/json' },
    })
    const text =
      res.data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    return text.trim() || 'I did not receive any text output. Try asking again with a bit more detail.'
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.error?.message || e.message || 'Gemini request failed.'
      throw new Error(message)
    }
    throw e
  }
}

type GeminiModel = {
  name?: string
  displayName?: string
  supportedGenerationMethods?: string[]
}

type GeminiListModelsResponse = {
  models?: GeminiModel[]
  error?: { message?: string }
}

export async function listGeminiModels(args?: { signal?: AbortSignal }) {
  const key = getApiKey()
  if (!key) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart the dev server.')
  }

  const url = `${GEMINI_BASE_URL}/models`
  try {
    const res = await axios.get<GeminiListModelsResponse>(url, { params: { key }, signal: args?.signal })
    return res.data.models ?? []
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.error?.message || e.message || 'ListModels failed.'
      throw new Error(message)
    }
    throw e
  }
}
