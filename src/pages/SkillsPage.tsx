import {
  ApiOutlined,
  BranchesOutlined,
  CodeOutlined,
  ContainerOutlined,
  DeploymentUnitOutlined,
  GithubOutlined,
  LaptopOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Progress, Row, Space, Tag, Typography } from 'antd'
import '../styles/skills.css'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

type MasteryItem = { label: string; percent: number; details: string }

const CORE_MASTERY: MasteryItem[] = [
  {
    label: 'Angular',
    percent: 93,
    details: 'Enterprise SPAs, RxJS, Signals, state management, scalable frontend architecture',
  },
  {
    label: 'Spring Boot',
    percent: 91,
    details: 'REST APIs, security, integrations, validation, observability, backend architecture',
  },
]

const MICRO_CARDS = [
  {
    title: 'Java',
    subtitle: 'Backend engineering, concurrency, scalable service development',
    icon: <SafetyCertificateOutlined />,
  },
  {
    title: 'TypeScript',
    subtitle: 'Strong typing, maintainable frontend systems, application architecture',
    icon: <CodeOutlined />,
  },
]

const FEATURE_CARDS = [
  {
    title: 'Full-Stack Development',
    subtitle: 'Building scalable applications across frontend and backend',
    icon: <DeploymentUnitOutlined />,
    tags: ['Angular', 'Spring Boot', 'Testing'],
    desc: 'Developing enterprise-grade applications with clean architecture, maintainable codebases, and reliable integrations.',
  },
  {
    title: 'API & Backend Architecture',
    subtitle: 'Reliable, secure, and maintainable service design',
    icon: <ApiOutlined />,
    tags: ['REST', 'Security', 'Integrations'],
    desc: 'Designing backend systems and APIs focused on scalability, resilience, and long-term maintainability.',
  },
  {
    title: 'Infrastructure & Delivery',
    subtitle: 'Deployment pipelines and production-ready workflows',
    icon: <ContainerOutlined />,
    tags: ['Docker', 'CI/CD', 'AWS'],
    desc: 'Containerization, deployment automation, and development workflows that support reliable delivery.',
  },
]

const FORGE = [
  {
    title: 'VS Code',
    subtitle: 'Efficient development workflows, debugging and productivity',
    icon: <LaptopOutlined />,
  },
  {
    title: 'Figma',
    subtitle: 'UI collaboration, interface prototyping, and design system alignment',
    icon: <BranchesOutlined />,
  },
  {
    title: 'Git & Version Control',
    subtitle: 'Collaborative development, code reviews, and structured release workflows',
    icon: <GithubOutlined />,
  },
]

export default function SkillsPage() {
  const navigate = useNavigate()

  return (
    <div className="skills2">
      <section className="skills2-hero">
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={12}>
            <Text className="skills2-eyebrow">
              TECHNICAL EXPERTISE
            </Text>
            <Title className="skills2-title">
              Engineering <span className="skills2-title__accent">Capabilities</span>
            </Title>
            <Paragraph className="skills2-desc">
              A focused set of technologies, architectural practices, and engineering
              tools used to design scalable backend systems, enterprise applications,
              and modern frontend experiences.
            </Paragraph>
            <div className="skills2-section">
              <Title level={4} className="skills2-section__title">
                Core Technologies
              </Title>

              <div className="skills2-mastery">
                {CORE_MASTERY.map((item) => (
                  <div key={item.label} className="skills2-mastery__row">
                    <div className="skills2-mastery__head">
                      <Text className="skills2-mastery__label">{item.label}</Text>
                      <Text className="skills2-mastery__value">{item.percent}% Mastery</Text>
                    </div>
                    <Progress
                      percent={item.percent}
                      showInfo={false}
                      strokeLinecap="round"
                      className="skills2-mastery__bar"
                    />
                    <Text className="skills2-mastery__details">{item.details}</Text>
                  </div>
                ))}
              </div>

              <div className="skills2-micro">
                {MICRO_CARDS.map((card) => (
                  <Card key={card.title} className="skills2-microCard" hoverable>
                    <div className="skills2-microCard__top">
                      <span className="skills2-icon" aria-hidden="true">
                        {card.icon}
                      </span>
                      <div>
                        <Text className="skills2-microCard__title">{card.title}</Text>
                        <Text className="skills2-microCard__subtitle">{card.subtitle}</Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <div className="skills2-right">
              {FEATURE_CARDS.map((card) => (
                <Card key={card.title} className="skills2-featureCard" hoverable>
                  <div className="skills2-featureCard__top">
                    <span className="skills2-icon skills2-icon--soft" aria-hidden="true">
                      {card.icon}
                    </span>
                    <div className="skills2-featureCard__titles">
                      <Text className="skills2-featureCard__title">{card.title}</Text>
                      <Text className="skills2-featureCard__subtitle">{card.subtitle}</Text>
                    </div>
                  </div>
                  <Paragraph className="skills2-featureCard__desc">{card.desc}</Paragraph>
                  <Space size={8} wrap>
                    {card.tags.map((t) => (
                      <Tag key={t} className="skills2-tag">
                        {t}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      <section className="skills2-section">
        <Title level={4} className="skills2-section__title">
          Development Environment
        </Title>

        <Row gutter={[16, 16]}>
          {FORGE.map((tool) => (
            <Col xs={24} md={8} key={tool.title}>
              <Card className="skills2-forgeCard" hoverable>
                <div className="skills2-forgeCard__top">
                  <span className="skills2-icon" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <div>
                    <Text className="skills2-forgeCard__title">{tool.title}</Text>
                    <Text className="skills2-forgeCard__subtitle">{tool.subtitle}</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="skills2-cta" aria-label="Skills call to action">
        <div className="skills2-cta__inner">
          <Title level={3} className="skills2-cta__title">
            Building scalable products with strong engineering foundations
          </Title>

          <Paragraph className="skills2-cta__desc">
            Open to backend, full-stack, and architecture-focused opportunities where
            clean system design, reliability, and maintainability are valued.
          </Paragraph>

          <Button type="primary" onClick={() => navigate('/contact')}>
            Let’s Connect
          </Button>
        </div>
      </section>
    </div>
  )
}

