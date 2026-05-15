export type TalkStatus = 'created' | 'started' | 'done' | 'error' | 'rejected'

export type TalkScript = {
  type: 'text'
  input: string
}

export type CreateTalkRequest = {
  source_url: string
  script: TalkScript
}

export type TalkResponse = {
  id: string
  status: TalkStatus
  created_at?: string
  created_by?: string
  object?: string
  result_url?: string
}
