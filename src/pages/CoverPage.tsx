import { CheckCircleFilled, DownloadOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import hallwayUrl from '../assets/cover-hallway.jpg'
import circuitUrl from '../assets/cover-circuit.png'
import '../styles/cover.css'
import { ExternalService, openExternalURL } from '../utils/utlis'

const { Title, Paragraph, Text } = Typography

const PRINCIPLES = [
  { title: 'Performance', subtitle: 'OPTIMIZED ARTIFACTS' },
  { title: 'Security', subtitle: 'FORTIFIED INTEGRITY' },
  { title: 'Accessibility', subtitle: 'UNIVERSAL CLARITY' },
  { title: 'Stability', subtitle: 'RESILIENT CORE' },
]

export default function CoverPage() {
  const navigate = useNavigate();

  return (
    <div className="cover">
      <section className="cover-hero">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={13}>
            <Title className="cover-hero__title">
              Software Engineer Focused on Scalable Architecture
            </Title>
            <Paragraph className="cover-hero__desc">
              Experienced in designing and developing enterprise-grade applications using
              Java, Spring, Angular, and modern cloud-native practices. Passionate about
              clean architecture, efficient system design, and building reliable software
              solutions that remain maintainable as products evolve.
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
              Evolving from Interfaces to Architecture
            </Title>
            <Paragraph className="cover-section__desc">
              My journey began with frontend development, crafting intuitive and
              responsive user experiences with Angular and modern web technologies.
              Over time, curiosity about how systems truly operate led me deeper into
              backend engineering, integrations, and scalable architecture design.
            </Paragraph>
            <Paragraph className="cover-section__desc">
              Today, I build enterprise-grade applications that balance clean user
              experience with reliable system foundations. From REST services and
              distributed integrations to maintainable frontend ecosystems, I focus on
              creating software that remains scalable, understandable, and resilient as
              products evolve.
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
            <Text className="cover-eyebrow">Engineering Principles</Text>

            <Title level={3} className="cover-section__title">
              Building Systems That Remain Maintainable
            </Title>

            <Paragraph className="cover-section__desc">
              I approach software engineering with a strong emphasis on clarity,
              scalability, and long-term maintainability. Clean architecture, fast
              feedback loops, and thoughtful system boundaries help ensure applications
              remain reliable as complexity grows.
            </Paragraph>

            <Paragraph className="cover-section__desc">
              My focus is not only delivering features, but building foundations that
              teams can confidently extend, debug, and evolve over time.
            </Paragraph>

            <ul className="cover-list" aria-label="Engineering principles">
              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">
                  Automated testing and quality-focused development
                </span>
              </li>

              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">
                  Clean architecture and maintainable domain design
                </span>
              </li>

              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">
                  Scalable integrations and microservice-oriented systems
                </span>
              </li>

              <li className="cover-list__item">
                <CheckCircleFilled className="cover-list__icon" />
                <span className="cover-list__text">
                  Performance, observability, and production reliability
                </span>
              </li>
            </ul>
          </Col>
        </Row>
      </section>

      <section className="cover-cta" aria-label="Call to action">
        <div className="cover-cta__inner">
          <Title level={2} className="cover-cta__title">
            Let’s Build Reliable Software Together
          </Title>
          <Space size={12} wrap className="cover-cta__actions">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => openExternalURL(ExternalService.CV)}>
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

