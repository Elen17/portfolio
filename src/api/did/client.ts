import type { TalkResponse, TalkStatus } from './types'

const DID_BASE_URL = 'https://api.d-id.com'
const POLL_INTERVAL_MS = 2_000
const POLL_TIMEOUT_MS = 180_000

function getApiKey() {
  const key = import.meta.env.VITE_DID_API_KEY?.trim()
  return key ? key : undefined
}

export function isDidConfigured() {
  return Boolean(getApiKey())
}

export function getDidSourceUrl(): string | undefined {
  const url = import.meta.env.VITE_DID_SOURCE_URL?.trim()
  return url ? url : undefined
}

function authHeader(): string {
  const key = getApiKey()
  if (!key) throw new Error('Missing VITE_DID_API_KEY. Add it to your .env.local and restart the dev server.')
  return `Basic ${btoa(`${key}:`)}`
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: { message?: string; description?: string; kind?: string } }
    return data.error?.message ?? data.error?.description ?? data.error?.kind ?? fallback
  } catch {
    return fallback
  }
}

export async function createTalk(args: {
  sourceUrl: string
  text: string
  signal?: AbortSignal
}): Promise<TalkResponse> {
  const res = await fetch(`${DID_BASE_URL}/talks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      source_url: args.sourceUrl,
      script: { type: 'text', input: args.text },
    }),
    signal: args.signal,
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, `Create talk failed (HTTP ${res.status}).`))
  return (await res.json()) as TalkResponse
}

export async function getTalk(args: {
  id: string
  signal?: AbortSignal
}): Promise<TalkResponse> {
  const res = await fetch(`${DID_BASE_URL}/talks/${encodeURIComponent(args.id)}`, {
    headers: { Authorization: authHeader() },
    signal: args.signal,
  })
  if (!res.ok) throw new Error(await readErrorMessage(res, `Get talk failed (HTTP ${res.status}).`))
  return (await res.json()) as TalkResponse
}

const TERMINAL_STATUSES: TalkStatus[] = ['done', 'error', 'rejected']

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

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

    if (TERMINAL_STATUSES.includes(talk.status)) {
      if (talk.status === 'error' || talk.status === 'rejected') {
        const detail = talk.error?.description || talk.error?.kind
        throw new Error(detail ? `D-ID talk ${talk.status}: ${detail}` : `D-ID talk ${talk.status}.`)
      }
      return talk
    }

    await sleep(POLL_INTERVAL_MS, args.signal)
  }

  throw new Error(`D-ID talk ${args.id} did not complete within ${POLL_TIMEOUT_MS / 1000}s.`)
}
