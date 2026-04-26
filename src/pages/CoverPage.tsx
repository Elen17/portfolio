import { CheckCircleFilled, DownloadOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import hallwayUrl from '../assets/cover-hallway.svg'
import circuitUrl from '../assets/cover-circuit.svg'
import '../styles/cover.css'

const { Title, Paragraph, Text } = Typography

const PRINCIPLES = [
  { title: 'Performance', subtitle: 'OPTIMIZED ARTIFACTS' },
  { title: 'Security', subtitle: 'FORTIFIED INTEGRITY' },
  { title: 'Accessibility', subtitle: 'UNIVERSAL CLARITY' },
  { title: 'Stability', subtitle: 'RESILIENT CORE' },
]

export default function CoverPage() {
  const navigate = useNavigate()

  return (
    <div className="cover">
      <section className="cover-hero">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={13}>
            <Text className="cover-eyebrow">THE ARCHITECT’S NOTE</Text>
            <Title className="cover-hero__title">Crafting Elegance in Complexity</Title>
            <Paragraph className="cover-hero__desc">
              Architecture is not just code — it’s the art of structuring systems that scale with intent. I build products
              where clean flow, safe design, and pragmatic behavior meet each architectural purity.
            </Paragraph>
          </Col>
          <Col xs={24} lg={11}>
            <div className="cover-hero__image">
              <img className="cover-hero__img" src={hallwayUrl} alt="Abstract corridor" />
            </div>
          </Col>
        </Row>
      </section>

      <section className="cover-journey">
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={12}>
            <Text className="cover-eyebrow">The Journey</Text>
            <Title level={3} className="cover-section__title">
              From Concept to Crafted Systems
            </Title>
            <Paragraph className="cover-section__desc">
              Starting as a frontend engineer, I’ve grown into shaping both the UI and the system foundations that hold
              it. Today I balance performance, reliability, and developer experience so products remain clear under
              change.
            </Paragraph>
            <Paragraph className="cover-section__desc">
              My methodology treats every project as a “living archive”: each feature is built with intent, reviewed for
              clarity, and shipped with durable patterns.
            </Paragraph>
          </Col>

          <Col xs={24} lg={12}>
            <div className="principles">
              {PRINCIPLES.map((p) => (
                <Card key={p.title} className="principle-card" hoverable>
                  <Text className="principle-card__title">{p.title}</Text>
                  <Text className="principle-card__subtitle">{p.subtitle}</Text>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      <section className="cover-archival">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={12}>
            <div className="cover-archival__image">
              <img className="cover-archival__img" src={circuitUrl} alt="Abstract circuit board" />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <Text className="cover-eyebrow">The Archival Method</Text>
            <Title level={3} className="cover-section__title">
              Systems that stay readable
            </Title>
            <Paragraph className="cover-section__desc">
              My philosophy revolves around “TDD Trail Driven Development” and tight feedback loops. I believe the
              strongest systems remain self-documenting, highly observable, and resilient to change.
            </Paragraph>

            <ul className="cover-list" aria-label="Method highlights">
              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">Automated test suites</span>
              </li>
              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">Clean domain + orchestration</span>
              </li>
              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">Microservices isolation</span>
              </li>
            </ul>
          </Col>
        </Row>
      </section>

      <section className="cover-cta" aria-label="Call to action">
        <div className="cover-cta__inner">
          <Title level={2} className="cover-cta__title">
            Ready to Build the Next Archive?
          </Title>
          <Space size={12} wrap className="cover-cta__actions">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                // placeholder interaction until real CV file is added
                navigate('/contact')
              }}
            >
              Download Full CV
            </Button>
            <Button icon={<MailOutlined />} onClick={() => navigate('/contact')}>
              Get in Touch
            </Button>
          </Space>
        </div>
      </section>
    </div>
  )
}

