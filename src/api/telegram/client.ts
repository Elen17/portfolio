import axios, { type AxiosError } from 'axios'

import type { TelegramResponse, TelegramMessage, SendMessageRequest } from './types'

function getBotToken(): string {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim()
  if (!token) throw new Error('Missing VITE_TELEGRAM_BOT_TOKEN. Add it to your .env.local and restart the dev server.')
  return token
}

function getChatId(): string {
  const id = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim()
  if (!id) throw new Error('Missing VITE_TELEGRAM_CHAT_ID. Add it to your .env.local and restart the dev server.')
  return id
}

function telegramUrl(method: string): string {
  return `${import.meta.env.VITE_TELEGRAM_URL}${getBotToken()}/${method}`
}

function readErrorMessage(
  err: AxiosError<TelegramResponse<unknown>>,
  fallback: string,
): string {
  return err.response?.data?.description ?? fallback
}

export async function sendMessage(args: SendMessageRequest & { signal?: AbortSignal }): Promise<TelegramMessage> {
  try {
    const { data } = await axios.post<TelegramResponse<TelegramMessage>>(
      telegramUrl('sendMessage'),
      {
        chat_id: args.chatId ?? getChatId(),
        text: args.text,
        parse_mode: args.parseMode ?? 'HTML',
      },
      { signal: args.signal },
    )
    return data.result
  } catch (err) {
    if (axios.isCancel(err)) throw new DOMException('Aborted', 'AbortError')
    throw new Error(readErrorMessage(err as AxiosError<TelegramResponse<unknown>>, 'sendMessage failed.'))
  }
}