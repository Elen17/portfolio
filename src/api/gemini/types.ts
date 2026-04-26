export type ChatRole = 'user' | 'model'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

