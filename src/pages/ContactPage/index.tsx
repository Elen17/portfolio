import { EnvironmentOutlined, MailOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons'
import { App, Button, Card, Col, Form, Input, Row, Select, Space, Typography } from 'antd'
import { useState } from 'react'
import { sendContactMessage, type ContactMessage } from '../../api/emailjs'
import { sendMessage } from '../../api/telegram/client'
import { SUBJECT_OPTIONS } from './consts'
import './styles.css'

const { Title, Paragraph, Text } = Typography

type ContactValues = ContactMessage

export default function ContactPage() {
  const [form] = Form.useForm<ContactValues>()
  const { notification } = App.useApp()
  const [submitting, setSubmitting] = useState(false)
  const [sendingTelegram, setSendingTelegram] = useState(false)

  const handleSubmit = async (values: ContactValues) => {
    setSubmitting(true)
    try {
      await sendContactMessage(values)
      notification.success({
        message: 'Message sent',
        description: 'Your message has been sent successfully. Please check your email for a response.',
        placement: 'topRight',
      })
      form.resetFields()
    } catch (error) {
      console.error(error)
      notification.error({
        message: 'Failed to send',
        description: 'Something went wrong while sending your message. Please try again later.',
        placement: 'topRight',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleTelegram = async () => {
    try {
      const values = await form.validateFields()
      setSendingTelegram(true)

      const text = [
        `<b>New message from portfolio</b>`,
        `<b>Name:</b> ${values.name}`,
        `<b>Email:</b> ${values.email}`,
        `<b>Subject:</b> ${values.subject}`,
        `<b>Message:</b>\n${values.message}`,
      ].join('\n')

      await sendMessage({ text })

      notification.success({
        message: 'Sent via Telegram',
        description: 'Your message has been forwarded to Telegram.',
        placement: 'topRight',
      })
      form.resetFields()
    } catch (error) {
      // form.validateFields() rejects with a validation error — don't show a notification for that
      if (error instanceof Error) {
        console.error(error)
        notification.error({
          message: 'Telegram failed',
          description: 'Something went wrong while sending to Telegram. Please try again later.',
          placement: 'topRight',
        })
      }
    } finally {
      setSendingTelegram(false)
    }
  }

  return (
    <div className="contact2">
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} lg={12}>
          <Text className="contact2-eyebrow">COMMUNICATION PORTAL</Text>
          <Title className="contact2-title">
            Let&apos;s Build
            <br />
            Something
            <br />
            Iconic.
          </Title>
          <Paragraph className="contact2-desc">
            Whether it&apos;s a structural digital transformation or a refined visual identity, I&apos;m here to translate
            your vision into digital permanence.
          </Paragraph>

          <div className="contact2-meta">
            <div className="contact2-chip">
              <EnvironmentOutlined className="contact2-chip__icon" />
              <div>
                <Text className="contact2-chip__label">CURRENT BASE</Text>
                <Text className="contact2-chip__value">Yerevan, Armenia (GMT+4)</Text>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="contact2-card">
            <div className="contact2-card__accent" aria-hidden="true" />
            <Form<ContactValues>
              form={form}
              layout="vertical"
              requiredMark={false}
              onFinish={handleSubmit}
              disabled={submitting || sendingTelegram}
            >
              
              <Button htmlType="button" 
                icon={<ReloadOutlined/>}
                onClick={() => form.resetFields()}
                className="contact2-rest"
                />

              <Form.Item<ContactValues>
                label="Your name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>

              <Form.Item<ContactValues>
                label="Email address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="john.doe@gmail.com" />
              </Form.Item>

              <Form.Item<ContactValues> label="Subject" name="subject" initialValue={SUBJECT_OPTIONS[0].value}>
                <Select options={[...SUBJECT_OPTIONS]} />
              </Form.Item>

              <Form.Item<ContactValues>
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please write a short message' }]}
              >
                <Input.TextArea placeholder="Briefly describe your vision..." rows={5} />
              </Form.Item>

              <Space wrap>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="contact2-submit"
                  icon={<MailOutlined />}
                  loading={submitting}
                >
                  Dispatch Message
                </Button>
                <Button
                  htmlType="button"
                  icon={<SendOutlined />}
                  loading={sendingTelegram}
                  onClick={handleTelegram}
                >
                  Send via Telegram
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}