import { DownloadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Layout, Menu, Row, Space, Statistic, Typography } from 'antd'
import avatarUrl from '../assets/avatar.png'
import '../styles/home.css'

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

export default function HomePage() {
  return (
    <Layout className="app-shell">
      <Header className="top-nav">
        <div className="top-nav__brand">ELENKHACHATRYAN</div>
        <Menu
          mode="horizontal"
          theme="dark"
          selectable={false}
          className="top-nav__menu"
          items={[
            { key: 'home', label: 'Home' },
            { key: 'cover', label: 'Cover' },
            { key: 'skills', label: 'Skills' },
            { key: 'contact', label: 'Contact' },
          ]}
        />
        <Button type="primary" className="top-nav__cta">
          Hire Me
        </Button>
      </Header>

      <Content className="page">
        <section className="hero">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={13}>
              <Text className="eyebrow">BRANDING • SYSTEMS • INTERFACES • EXPERIENCES</Text>
              <Title className="hero__title">
                CRAFTING DIGITAL <span className="accent">ARCHITECT</span>
              </Title>
              <Paragraph className="hero__desc">
                Full stack developer focused on building clean, accessible web experiences — from Angular UIs to robust
                Spring Boot APIs.
              </Paragraph>

              <Space size={12} wrap>
                <Button type="primary" size="large">
                  View Projects
                </Button>
                <Button size="large" icon={<DownloadOutlined />}>
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
                  <div className="skill-card__meter-fill" style={{ width: '86%' }} />
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
                  <div className="skill-card__meter-fill" style={{ width: '78%' }} />
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
                  <div className="skill-card__meter-fill" style={{ width: '82%' }} />
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
                <Button type="primary" size="large" icon={<MailOutlined />}>
                  Start Conversation
                </Button>
                <Button size="large" icon={<GithubOutlined />}>
                  GitHub
                </Button>
                <Button size="large" icon={<LinkedinOutlined />}>
                  LinkedIn
                </Button>
              </Space>
            </Col>
          </Row>
        </section>
      </Content>

      <Footer className="footer">
        <div className="footer__inner">
          <Text type="secondary">© {new Date().getFullYear()} Elen Khachatryan. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  )
}

