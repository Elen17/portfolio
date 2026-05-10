import { DownloadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Row, Space, Statistic, Typography } from 'antd'
import avatarUrl from '../assets/avatar.png'
import '../styles/home.css'
import { useNavigate } from 'react-router-dom'
import { ExternalService, openExternalURL } from '../utils/utlis'

const { Title, Text, Paragraph } = Typography

export default function HomePage() {
  const navigate = useNavigate()
  const yearsOfExperience = new Date().getFullYear() - 2021;

  return (
    <>
      <section className="hero">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={13}>
            <Title className="hero__title">
              CRAFTING DIGITAL <span className="accent">Software Engineer</span>
            </Title>
            <Paragraph className="hero__desc">
              Software Engineer focused on building clean, responsive and scalable web applications
            </Paragraph>

            <Space size={12} wrap>
              <Button type="primary" size="large" onClick={() => navigate('/cover')}>
                View Cover
              </Button>
              <Button size="large" icon={<DownloadOutlined />}
                onClick={() => openExternalURL(ExternalService.CV)}>
                Download CV
              </Button>
            </Space>

            <Divider className="hero__divider" />

            <Row gutter={[16, 16]} className="stats">
              <Col xs={12} md={6}>
                <Statistic title="Years Experience" value={yearsOfExperience} />
              </Col>
              <Col xs={12} md={6}>
                <Statistic title="Projects Delivered" value={10} suffix="+" />
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
                <Text className="portrait__badge-label">Software Engineer</Text>
                <Text className="portrait__badge-name">Elen Khachatryan</Text>
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
            Middle Software Engineer with experience building scalable full-stack applications across frontend and backend systems.
            I work with modern web technologies including TypeScript, JavaScript, and Angular for responsive user interfaces,
            alongside Java and Spring Boot for robust backend services and APIs. Comfortable working with relational databases,
            RESTful architectures, microservices, and integration-driven enterprise applications.
            </Paragraph>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="skills">
          <Col xs={24} md={8}>
            <Card className="skill-card" variant="outlined">
              <Text className="skill-card__kicker">Frontend</Text>
              <Title level={4} className="skill-card__title">
                Angular (2+) + TypeScript
              </Title>
              <Paragraph className="skill-card__desc">
                Building maintainable and scalable Single Page Applications using modern Angular framework,
                strong TypeScript typing, and clean component-driven design principles. 
                Focused on creating performant, reusable, and user-friendly frontend
                solutions with an emphasis on code quality, maintainability, and long-term scalability.  
              </Paragraph>
              <div className="skill-card__meter">
                <div className="skill-card__meter-fill skill-card__meter-fill--86" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="skill-card" variant="outlined">
              <Text className="skill-card__kicker">Backend</Text>
              <Title level={4} className="skill-card__title">
                Java + Spring Boot
              </Title>
              <Paragraph className="skill-card__desc">
                Building robust and scalable backend services using Java and Spring Boot,
                with a focus on clean architecture, modular design, and API-driven development.
                Experienced in implementing RESTful APIs, microservices, and integration patterns
                to support modern web applications and enterprise systems.
              </Paragraph>
              <div className="skill-card__meter">
                <div className="skill-card__meter-fill skill-card__meter-fill--78" />
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="cta">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={14}>
            <Title level={2} className="cta__title">
              READY TO BUILD THE NEXT GENERATION OF SOFTWARE?
            </Title>
            <Paragraph className="cta__desc">
              Let’s collaborate on your next product. I can help ship fast, scalable and maintainable software solutions.
            </Paragraph>
          </Col>
          <Col xs={24} md={10} className="cta__actions">
            <Space wrap>
              <Button type="primary" size="large" icon={<MailOutlined />} onClick={() => navigate('/contact')}>
                Start Conversation
              </Button>
              <Button size="large" icon={<GithubOutlined />}
                onClick={() => openExternalURL(ExternalService.GITHUB)}>
                GitHub
              </Button>
              <Button size="large" icon={<LinkedinOutlined />}
                onClick={() => openExternalURL(ExternalService.LINKEDIN)}>
                LinkedIn
              </Button>
            </Space>
          </Col>
        </Row>
      </section>
    </>
  )
}

