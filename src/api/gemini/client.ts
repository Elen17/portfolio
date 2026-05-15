import { GoogleGenAI, type Content } from '@google/genai'
import type { ChatMessage } from './types'

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY?.trim()
  return key ? key : undefined
}

function getModelId() {
  return import.meta.env.VITE_GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL
}

export function isGeminiConfigured() {
  return Boolean(getApiKey())
}

function buildSystemInstruction(cv: string): string {
  return `You are acting as Elen Khachatryan, a full-stack software engineer.

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
<<<CV_END>>>`
}

export type GenerateGeminiReplyArgs = {
  messages: ChatMessage[]
  cvMarkdown: string
  signal?: AbortSignal
  onChunk?: (partialText: string) => void
}

function describeError(e: unknown): string {
  const base = e instanceof Error ? e.message : 'Gemini request failed.'
  const cause = e instanceof Error && 'cause' in e ? (e as { cause?: unknown }).cause : undefined
  if (cause instanceof Error) return `${base} (${cause.name}: ${cause.message})`
  return base
}

function extractText(response: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }): string {
  return response.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
}

const NO_OUTPUT = 'I did not receive any text output. Try asking again with a bit more detail.'

export async function generateGeminiReply(args: GenerateGeminiReplyArgs): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env.local and restart the dev server.')
  }

  const cv = args.cvMarkdown.trim()
  if (!cv) {
    throw new Error('Your cv.md is empty. Add your CV content to cv.md and refresh.')
  }

  const ai = new GoogleGenAI({ apiKey })
  const model = getModelId()
  const contents: Content[] = args.messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))
  const config = {
    systemInstruction: buildSystemInstruction(cv),
    temperature: 0.55,
    topP: 0.9,
    maxOutputTokens: 1200,
  }

  if (args.onChunk) {
    let iterator: AsyncIterable<unknown>
    try {
      iterator = await ai.models.generateContentStream({ model, contents, config })
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e
      throw new Error(describeError(e))
    }

    let fullText = ''
    try {
      for await (const chunk of iterator) {
        const chunkText = extractText(chunk as Parameters<typeof extractText>[0])
        if (chunkText) {
          fullText += chunkText
          args.onChunk(fullText)
        }
        if (args.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw e
      throw new Error(describeError(e))
    }

    return fullText.trim() || NO_OUTPUT
  }

  try {
    const response = await ai.models.generateContent({ model, contents, config })
    return extractText(response).trim() || NO_OUTPUT
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw e
    throw new Error(describeError(e))
  }
}
