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
  { label: 'Angular', percent: 93, details: 'SPA, Standalone, RxJS, Signals, Architecture' },
  { label: 'Spring Boot', percent: 91, details: 'REST, Security, Data, Validation, Observability' },
]

const MICRO_CARDS = [
  { title: 'Java', subtitle: 'Backend programming, concurrency, runtime patterns', icon: <SafetyCertificateOutlined /> },
  { title: 'TypeScript', subtitle: 'Typed UI, tooling, systems, interface design', icon: <CodeOutlined /> },
]

const FEATURE_CARDS = [
  {
    title: 'Full-stack Development',
    subtitle: 'Front-to-end delivery with clean boundaries',
    icon: <DeploymentUnitOutlined />,
    tags: ['Interfaces', 'APIs', 'Testing'],
    desc: 'From polished interfaces to robust domain services and integrations.',
  },
  {
    title: 'API Architecture',
    subtitle: 'Secure, observable, resilient services',
    icon: <ApiOutlined />,
    tags: ['Spring', 'REST', 'Auth'],
    desc: 'Designing APIs that stay predictable under growth and change.',
  },
  {
    title: 'Infrastructure',
    subtitle: 'CI-friendly, deployable workflows',
    icon: <ContainerOutlined />,
    tags: ['Docker', 'CI/CD', 'AWS'],
    desc: 'Automation, containerization, and repeatable pipelines for shipping.',
  },
]

const FORGE = [
  { title: 'VS Code', subtitle: 'Fast edits, strong navigation, and extension workflows', icon: <LaptopOutlined /> },
  { title: 'Figma', subtitle: 'Design systems and UI collaboration hand-offs', icon: <BranchesOutlined /> },
  { title: 'Git Version Control', subtitle: 'Readable history, clean reviews, confident releases', icon: <GithubOutlined /> },
]

export default function SkillsPage() {
  const navigate = useNavigate()

  return (
    <div className="skills2">
      <section className="skills2-hero">
        <Row gutter={[24, 24]} align="top">
          <Col xs={24} lg={12}>
            <Text className="skills2-eyebrow">COMPUTATION MANUAL</Text>
            <Title className="skills2-title">
              Technical <span className="skills2-title__accent">Arsenal</span>
            </Title>
            <Paragraph className="skills2-desc">
              A curated collection of technologies, architectural patterns, and creative tools I leverage to build
              high-performance, expressive-grade digital experiences.
            </Paragraph>

            <div className="skills2-section">
              <Title level={4} className="skills2-section__title">
                Core Mastery
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
          The Forge
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
            Need a specialized technical lead?
          </Title>
          <Paragraph className="skills2-cta__desc">
            I’m currently open to collaborative projects and high-impact full-stack roles where technical excellence
            meets artistic vision.
          </Paragraph>
          <Button type="primary" onClick={() => navigate('/contact')}>
            Initiate Discussion
          </Button>
        </div>
      </section>
    </div>
  )
}

