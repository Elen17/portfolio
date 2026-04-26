import { EnvironmentOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row, Select, Space, Typography } from 'antd'
import '../styles/contact.css'
import mapUrl from '../assets/contact-map.svg'

const { Title, Paragraph, Text } = Typography

type ContactValues = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [form] = Form.useForm<ContactValues>()

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
                <Text className="contact2-chip__value">San Francisco, CA</Text>
                <Text className="contact2-chip__hint">Pacific Standard Time (UTC-8)</Text>
              </div>
            </div>

            <div className="contact2-grid">
              <div>
                <Text className="contact2-miniLabel">DIRECT SIGNAL</Text>
                <Text className="contact2-miniValue">hello@elen.studio</Text>
              </div>
              <div>
                <Text className="contact2-miniLabel">NETWORK</Text>
                <Text className="contact2-miniValue">elen-khachatryan (LinkedIn)</Text>
                <Text className="contact2-miniValue">elen-archival (GitHub)</Text>
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
              onFinish={(values) => {
                const subject = values.subject || 'Architectural Inquiry'
                const body = `${values.message}\n\nFrom: ${values.name} <${values.email}>`
                window.location.href = `mailto:elen@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}
            >
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
                <Input placeholder="john@company.com" />
              </Form.Item>

              <Form.Item<ContactValues> label="Subject" name="subject" initialValue="Architectural Inquiry">
                <Select
                  options={[
                    { value: 'Architectural Inquiry', label: 'Architectural Inquiry' },
                    { value: 'Full-stack Delivery', label: 'Full-stack Delivery' },
                    { value: 'Design System', label: 'Design System' },
                    { value: 'Consulting', label: 'Consulting' },
                  ]}
                />
              </Form.Item>

              <Form.Item<ContactValues>
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please write a short message' }]}
              >
                <Input.TextArea placeholder="Briefly describe your vision..." rows={5} />
              </Form.Item>

              <Space wrap>
                <Button type="primary" htmlType="submit" className="contact2-submit" icon={<MailOutlined />}>
                  Dispatch Message
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    form.resetFields()
                  }}
                >
                  Reset
                </Button>
              </Space>
            </Form>
          </Card>

          <div className="contact2-map" aria-hidden="true">
            <img className="contact2-map__img" src={mapUrl} alt="" />
          </div>
        </Col>
      </Row>
    </div>
  )
}

