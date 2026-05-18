import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GeminiChatPage from './index'
import type { GenerateGeminiReplyArgs } from '../../api/gemini'
import { STORAGE_KEY } from './consts'

const mockGenerateGeminiReply = jest.fn()
const mockIsGeminiConfigured = jest.fn()
const mockIsDidConfigured = jest.fn()
const mockGetDidSourceUrl = jest.fn()

jest.mock('../../api/gemini', () => ({
  generateGeminiReply: (args: GenerateGeminiReplyArgs) => mockGenerateGeminiReply(args),
  isGeminiConfigured: () => mockIsGeminiConfigured(),
}))

jest.mock('../../api/did', () => ({
  isDidConfigured: () => mockIsDidConfigured(),
  getDidSourceUrl: () => mockGetDidSourceUrl(),
  createTalk: jest.fn(),
  getTalk: jest.fn(),
  pollTalkUntilTerminal: jest.fn(),
}))

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

jest.mock('remark-gfm', () => ({ __esModule: true, default: () => () => {} }))

const findAlert = (matcher: RegExp) =>
  screen.getAllByRole('alert').find((el) => matcher.test(el.textContent ?? ''))

type SpeakHandlers = { onend?: () => void; onerror?: () => void }
let speakCalls: Array<{ text: string; handlers: SpeakHandlers }> = []
let cancelCalls = 0

class FakeUtterance implements SpeakHandlers {
  text: string
  onend?: () => void
  onerror?: () => void
  constructor(text: string) { this.text = text }
}

beforeAll(() => {
  ;(globalThis as unknown as { SpeechSynthesisUtterance: typeof FakeUtterance }).SpeechSynthesisUtterance =
    FakeUtterance
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      speak: (u: FakeUtterance) => {
        speakCalls.push({ text: u.text, handlers: u })
      },
      cancel: () => {
        cancelCalls++
      },
    },
  })
})

interface FakeRecognitionEvent {
  results: Array<Array<{ transcript: string }>>
}
let recognitionInstances: FakeRecognition[] = []
class FakeRecognition {
  lang = ''
  continuous = false
  interimResults = false
  maxAlternatives = 1
  onresult: ((ev: FakeRecognitionEvent) => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  onstart: (() => void) | null = null
  started = false
  start() {
    this.started = true
  }
  stop() {
    this.onend?.()
  }
  abort() {
    this.onend?.()
  }
  emitResult(text: string) {
    this.onresult?.({ results: [[{ transcript: text }]] })
  }
}

beforeAll(() => {
  ;(window as unknown as { SpeechRecognition: typeof FakeRecognition }).SpeechRecognition =
    class extends FakeRecognition {
      constructor() {
        super()
        recognitionInstances.push(this)
      }
    }
})

describe('GeminiChatPage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    speakCalls = []
    cancelCalls = 0
    recognitionInstances = []
    mockIsGeminiConfigured.mockReturnValue(true)
    mockIsDidConfigured.mockReturnValue(false)
    mockGetDidSourceUrl.mockReturnValue(undefined)
    mockGenerateGeminiReply.mockImplementation(async ({ onChunk }: GenerateGeminiReplyArgs) => {
      const reply = 'Here is a concise reply.'
      onChunk?.(reply)
      return reply
    })
  })

  it('renders the page title and empty-thread hint without crashing', () => {
    render(<GeminiChatPage />)

    expect(screen.getByRole('heading', { name: /gemini chat integration/i })).toBeInTheDocument()
    expect(screen.getByText(/ask something about the portfolio/i)).toBeInTheDocument()
  })

  it('shows a success alert when Gemini env configuration is detected', () => {
    mockIsGeminiConfigured.mockReturnValue(true)

    render(<GeminiChatPage />)

    expect(findAlert(/gemini configured/i)).toBeTruthy()
  })

  it('shows a warning alert when Gemini API key is not configured', () => {
    mockIsGeminiConfigured.mockReturnValue(false)

    render(<GeminiChatPage />)

    expect(findAlert(/gemini api key not configured/i)).toBeTruthy()
  })

  it('disables Send when the draft is empty or whitespace-only', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    const send = screen.getByRole('button', { name: /send/i })
    expect(send).toBeDisabled()

    const input = screen.getByLabelText(/message input/i)
    await user.type(input, '   ')
    expect(send).toBeDisabled()
  })

  it('sends the trimmed message, shows the user bubble, and renders the model reply on success', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    const input = screen.getByLabelText(/message input/i)
    await user.type(input, '  Hello Gemini  ')
    await user.click(screen.getByRole('button', { name: /send/i }))

    const transcript = screen.getByLabelText(/chat transcript/i)
    expect(within(transcript).getByText('You')).toBeInTheDocument()
    expect(within(transcript).getByText('Hello Gemini')).toBeInTheDocument()

    await waitFor(() => {
      expect(within(transcript).getByText('Here is a concise reply.')).toBeInTheDocument()
    })

    expect(mockGenerateGeminiReply).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('')
  })

  it('shows an error alert when the Gemini request fails', async () => {
    mockGenerateGeminiReply.mockRejectedValueOnce(new Error('Network is unreachable'))
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'Ping')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      const errorAlert = findAlert(/request failed/i)
      expect(errorAlert).toBeTruthy()
      expect(errorAlert).toHaveTextContent('Network is unreachable')
    })
  })

  it('clears messages, draft, and stored transcript when Clear is pressed', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'Keep me')
    await user.click(screen.getByRole('button', { name: /send/i }))
    await waitFor(() => {
      expect(screen.getByText('Here is a concise reply.')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByText(/ask something about the portfolio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message input/i)).toHaveValue('')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('reads the message aloud when the audio button is pressed', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'Hello there')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Here is a concise reply.')).toBeInTheDocument()
    })

    const readButtons = screen.getAllByRole('button', { name: /read message aloud/i })
    await user.click(readButtons[0])

    expect(speakCalls).toHaveLength(1)
    expect(speakCalls[0].text).toBe('Hello there')
    expect(
      screen.getByRole('button', { name: /stop reading message/i }),
    ).toBeInTheDocument()
  })

  it('toggles speech off when the audio button is pressed again', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'Toggle me')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Here is a concise reply.')).toBeInTheDocument()
    })

    const readBtn = screen.getAllByRole('button', { name: /read message aloud/i })[0]
    await user.click(readBtn)
    const cancelsAfterStart = cancelCalls
    const stopBtn = screen.getByRole('button', { name: /stop reading message/i })
    await user.click(stopBtn)

    expect(cancelCalls).toBeGreaterThan(cancelsAfterStart)
    expect(
      screen.queryByRole('button', { name: /stop reading message/i }),
    ).not.toBeInTheDocument()
  })

  it('stops speaking when the thread is cleared', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'Clear me')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText('Here is a concise reply.')).toBeInTheDocument()
    })

    await user.click(screen.getAllByRole('button', { name: /read message aloud/i })[0])
    const before = cancelCalls
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(cancelCalls).toBeGreaterThan(before)
  })

  it('transcribes voice input into the message draft', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.click(screen.getByRole('button', { name: /start voice input/i }))
    expect(recognitionInstances).toHaveLength(1)
    expect(recognitionInstances[0].started).toBe(true)

    recognitionInstances[0].emitResult('hello from voice')
    recognitionInstances[0].onend?.()

    const input = screen.getByLabelText(/message input/i)
    await waitFor(() => expect(input).toHaveValue('hello from voice'))
    expect(screen.getByRole('button', { name: /start voice input/i })).toBeInTheDocument()
  })

  it('appends successive transcriptions to the existing draft', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.type(screen.getByLabelText(/message input/i), 'typed bit')
    await user.click(screen.getByRole('button', { name: /start voice input/i }))
    recognitionInstances[0].emitResult('plus voice bit')
    recognitionInstances[0].onend?.()

    await waitFor(() =>
      expect(screen.getByLabelText(/message input/i)).toHaveValue('typed bit plus voice bit'),
    )
  })

  it('stops listening when the mic button is pressed again', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    await user.click(screen.getByRole('button', { name: /start voice input/i }))
    expect(
      screen.getByRole('button', { name: /stop voice input/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /stop voice input/i }))

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: /stop voice input/i }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /start voice input/i })).toBeInTheDocument()
  })

  it('ignores invalid persisted transcript data and renders the empty state', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    render(<GeminiChatPage />)

    expect(screen.getByText(/ask something about the portfolio/i)).toBeInTheDocument()
  })
})
