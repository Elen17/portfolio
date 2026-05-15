import axios from 'axios'
import type { TalkResponse, TalkStatus } from './types'

const DID_BASE_URL = 'https://api.d-id.com'
const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 60_000

function getApiKey() {
  const key = import.meta.env.VITE_DID_API_KEY as string | undefined
  return key?.trim() ? key.trim() : undefined
}

function authHeader() {
  const key = getApiKey()
  if (!key) throw new Error('Missing VITE_DID_API_KEY. Add it to your .env.local and restart the dev server.')
  return { username: key, password: '' }
}

export function isDidConfigured() {
  return Boolean(getApiKey())
}

export async function createTalk(args: {
  sourceUrl: string
  text: string
  signal?: AbortSignal
}): Promise<TalkResponse> {
  const res = await axios.post<TalkResponse>(
    `${DID_BASE_URL}/talks`,
    {
      source_url: args.sourceUrl,
      script: { type: 'text', input: args.text },
    },
    { auth: authHeader(), signal: args.signal },
  )
  return res.data
}

export async function getTalk(args: {
  id: string
  signal?: AbortSignal
}): Promise<TalkResponse> {
  const res = await axios.get<TalkResponse>(`${DID_BASE_URL}/talks/${args.id}`, {
    auth: authHeader(),
    signal: args.signal,
  })
  return res.data
}

const TERMINAL_STATUSES: TalkStatus[] = ['done', 'error', 'rejected']

export async function pollTalkUntilTerminal(args: {
  id: string
  signal?: AbortSignal
  onStatus?: (status: TalkStatus) => void
}): Promise<TalkResponse> {
  const deadline = Date.now() + POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    if (args.signal?.aborted) throw new DOMException('Aborted', 'AbortError')

    const talk = await getTalk({ id: args.id, signal: args.signal })
    args.onStatus?.(talk.status)

    if (TERMINAL_STATUSES.includes(talk.status)) return talk

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, POLL_INTERVAL_MS)
      args.signal?.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    })
  }

  throw new Error(`D-ID talk ${args.id} did not complete within ${POLL_TIMEOUT_MS / 1000}s.`)
}
