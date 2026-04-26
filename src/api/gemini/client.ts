import axios, { AxiosError } from 'axios'
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
  // Note: in Vite, only `VITE_*` env vars are exposed to the client.
  const fromEnv = import.meta.env.VITE_GEMINI_MODEL as string | undefined
  const value = fromEnv?.trim()
  return value ? value : DEFAULT_GEMINI_MODEL
}

export function isGeminiConfigured() {
  return Boolean(getApiKey())
}

export async function generateGeminiReply(args: {
  messages: ChatMessage[]
  cvMarkdown: string
  signal?: AbortSignal
}) {
  const key = getApiKey()
  if (!key) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart the dev server.')
  }

  const cv = args.cvMarkdown.trim()
  if (!cv) {
    throw new Error('Your cv.md is empty. Add your CV content to cv.md and refresh.')
  }

  const guardrail = [
    'You are a portfolio assistant.',
    'You MUST answer strictly using ONLY the CV content provided below.',
    'If the answer is not explicitly present in the CV, reply exactly: "I don’t have that information in the CV yet."',
    'When asked for a direct fact (name/title/location/email/etc), quote the exact value as written in the CV.',
    'Do not use outside knowledge. Do not guess.',
    '',
    '<<<CV_START>>>',
    cv,
    '<<<CV_END>>>',
  ].join('\n')

  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: guardrail }] },
    ...args.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
  ]

  const modelId = getModelId()
  const url = `${GEMINI_BASE_URL}/models/${modelId}:generateContent`

  let data: GeminiGenerateResponse
  try {
    const res = await axios.post<GeminiGenerateResponse>(
      url,
      {
        contents,
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      },
      {
        params: { key },
        signal: args.signal,
        headers: { 'Content-Type': 'application/json' },
      },
    )

    data = res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const ax = e as AxiosError<GeminiGenerateResponse>
      const message = ax.response?.data?.error?.message || ax.message || 'Gemini request failed.'
      throw new Error(message)
    }
    throw e
  }

  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''

  if (!text.trim()) {
    return 'I did not receive any text output. Try asking again with a bit more detail.'
  }

  return text
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
      const ax = e as AxiosError<GeminiListModelsResponse>
      const message = ax.response?.data?.error?.message || ax.message || 'ListModels failed.'
      throw new Error(message)
    }
    throw e
  }
}

