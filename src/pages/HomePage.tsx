import { DownloadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Row, Space, Statistic, Typography } from 'antd'
import avatarUrl from '../assets/avatar.png'
import '../styles/home.css'
import { useNavigate } from 'react-router-dom'

const { Title, Text, Paragraph } = Typography

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <section className="hero">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={13}>
            <Text className="eyebrow">BRANDING • SYSTEMS • INTERFACES • EXPERIENCES</Text>
            <Title className="hero__title">
              CRAFTING DIGITAL <span className="accent">ARCHITECT</span>
            </Title>
            <Paragraph className="hero__desc">
              Full stack developer focused on building clean, accessible web experiences — from Angular UIs to robust Spring
              Boot APIs.
            </Paragraph>

            <Space size={12} wrap>
              <Button type="primary" size="large" onClick={() => navigate('/cover')}>
                View Cover
              </Button>
              <Button size="large" icon={<DownloadOutlined />} onClick={() => navigate('/cover')}>
                Download CV
              </Button>
            </Space>

            <Divider className="hero__divider" />

            <Row gutter={[16, 16]} className="stats">
              <Col xs={12} md={6}>
                <Statistic title="Years Experience" value={5} />
              </Col>
              <Col xs={12} md={6}>
                <Statistic title="Projects Delivered" value={40} suffix="+" />
              </Col>
              <Col xs={12} md={6}>
                <Statistic title="Lines of UI" value={12000} suffix="+" />
              </Col>
              <Col xs={12} md={6}>
                <Statistic title="Client Satisfaction" value={99} suffix="%" />
              </Col>
            </Row>
          </Col>

          <Col xs={24} lg={11}>
            <div className="portrait">
              <img className="portrait__img" src={avatarUrl} alt="Avatar" />
              <div className="portrait__badge">
                <Text className="portrait__badge-label">Full Stack Developer</Text>
                <Text className="portrait__badge-name">Elen K.</Text>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      <section className="section">
        <Row gutter={[16, 16]} align="bottom" justify="space-between">
          <Col xs={24} md={14}>
            <Text className="eyebrow">SKILLS</Text>
            <Title level={2} className="section__title">
              TECHNICAL ARSENAL
            </Title>
          </Col>
          <Col xs={24} md={10}>
            <Paragraph className="section__desc">
              I build end-to-end products with a focus on performance, consistency, and developer experience.
            </Paragraph>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="skills">
          <Col xs={24} md={8}>
            <Card className="skill-card" bordered>
              <Text className="skill-card__kicker">Frontend</Text>
              <Title level={4} className="skill-card__title">
                Angular (2+) + TypeScript
              </Title>
              <Paragraph className="skill-card__desc">
                Building maintainable SPAs with modern Angular patterns, strong typing, and scalable architecture.
              </Paragraph>
              <div className="skill-card__meter">
                <div className="skill-card__meter-fill skill-card__meter-fill--86" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="skill-card" bordered>
              <Text className="skill-card__kicker">Backend</Text>
              <Title level={4} className="skill-card__title">
                Java + Spring Boot
              </Title>
              <Paragraph className="skill-card__desc">
                Designing and building REST APIs with clean domain logic, security, and reliable integrations.
              </Paragraph>
              <div className="skill-card__meter">
                <div className="skill-card__meter-fill skill-card__meter-fill--78" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="skill-card" bordered>
              <Text className="skill-card__kicker">Engineering</Text>
              <Title level={4} className="skill-card__title">
                TypeScript-first Tooling
              </Title>
              <Paragraph className="skill-card__desc">
                Practical workflows, CI-friendly builds, and clean code practices across frontend and backend.
              </Paragraph>
              <div className="skill-card__meter">
                <div className="skill-card__meter-fill skill-card__meter-fill--82" />
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="cta">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <Title level={2} className="cta__title">
              READY TO BUILD THE FUTURE?
            </Title>
            <Paragraph className="cta__desc">
              Let’s collaborate on your next product. I can help ship fast, polished UI with a maintainable foundation.
            </Paragraph>
          </Col>
          <Col xs={24} md={10} className="cta__actions">
            <Space wrap>
              <Button type="primary" size="large" icon={<MailOutlined />} onClick={() => navigate('/contact')}>
                Start Conversation
              </Button>
              <Button size="large" icon={<GithubOutlined />} onClick={() => window.open('https://github.com', '_blank')}>
                GitHub
              </Button>
              <Button size="large" icon={<LinkedinOutlined />} onClick={() => window.open('https://linkedin.com', '_blank')}>
                LinkedIn
              </Button>
            </Space>
          </Col>
        </Row>
      </section>
    </>
  )
}

