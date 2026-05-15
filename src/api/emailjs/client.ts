import emailjs from '@emailjs/browser'

export type ContactMessage = {
  name: string
  email: string
  subject: string
  message: string
}

function envOrThrow(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value as string
}

export async function sendContactMessage(values: ContactMessage): Promise<void> {
  await emailjs.send(
    envOrThrow('VITE_EMAILJS_SERVICE_ID'),
    envOrThrow('VITE_EMAILJS_TEMPLATE_ID'),
    {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message,
    },
    envOrThrow('VITE_EMAILJS_PUBLIC_KEY'),
  )
}
