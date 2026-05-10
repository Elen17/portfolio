import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GeminiChatPage from './GeminiChatPage'

const STORAGE_KEY = 'portfolio.geminiChat.v1'

const { mockGenerateGeminiReply, mockIsGeminiConfigured } = vi.hoisted(() => ({
  mockGenerateGeminiReply: vi.fn(),
  mockIsGeminiConfigured: vi.fn(),
}))

vi.mock('../api/gemini', () => ({
  generateGeminiReply: (...args) => mockGenerateGeminiReply(...args),
  isGeminiConfigured: () => mockIsGeminiConfigured(),
}))

describe('GeminiChatPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    mockIsGeminiConfigured.mockReturnValue(true)
    // Simulate streaming: call onChunk with the reply text, then resolve
    mockGenerateGeminiReply.mockImplementation(async ({ onChunk }) => {
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

    // Ant Design Alert renders role="alert" with content in child nodes; check text content
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/gemini configured/i)
  })

  it('shows a warning alert when Gemini API key is not configured', () => {
    mockIsGeminiConfigured.mockReturnValue(false)

    render(<GeminiChatPage />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent(/gemini api key not configured/i)
  })

  it('disables Send when the draft is empty or whitespace-only', async () => {
    const user = userEvent.setup()
    render(<GeminiChatPage />)

    // Ant Design Button with icon prefix: accessible name is "<icon-label><text>" e.g. "sendSend"
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
      // Success alert + error alert are both rendered; find the error one by text
      const errorAlert = screen
        .getAllByRole('alert')
        .find((el) => /request failed/i.test(el.textContent ?? ''))
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

    // Ant Design Button with icon prefix: accessible name is "deleteClear"
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByText(/ask something about the portfolio/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message input/i)).toHaveValue('')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('ignores invalid persisted transcript data and renders the empty state', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')

    render(<GeminiChatPage />)

    expect(screen.getByText(/ask something about the portfolio/i)).toBeInTheDocument()
  })
})
