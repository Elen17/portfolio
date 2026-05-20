export type TelegramResponse<T> = {
    ok: boolean
    result: T
    description?: string  // present when ok === false
    error_code?: number   // present when ok === false
}
    
export type TelegramUser = {
    id: number
    is_bot: boolean
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
}

export type TelegramChat = {
    id: number
    type: 'private' | 'group' | 'supergroup' | 'channel'
    first_name?: string
    last_name?: string
    username?: string
    title?: string
}
  
export type TelegramMessage = {
    message_id: number
    from?: TelegramUser
    chat: TelegramChat
    date: number            // Unix timestamp
    text?: string
}
  
export type SendMessageRequest = {
    text: string
    chatId?: string         // defaults to VITE_TELEGRAM_CHAT_ID
    parseMode?:string
}
  