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
import type { ComponentType } from 'react'

export type MasteryItem = { label: string; percent: number; details: string }

export const CORE_MASTERY: ReadonlyArray<MasteryItem> = [
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

type IconCard = {
  title: string
  subtitle: string
  icon: ComponentType
}

export const MICRO_CARDS: ReadonlyArray<IconCard> = [
  {
    title: 'Java',
    subtitle: 'Backend engineering, concurrency, scalable service development',
    icon: SafetyCertificateOutlined,
  },
  {
    title: 'TypeScript',
    subtitle: 'Strong typing, maintainable frontend systems, application architecture',
    icon: CodeOutlined,
  },
]

type FeatureCard = IconCard & { tags: ReadonlyArray<string>; desc: string }

export const FEATURE_CARDS: ReadonlyArray<FeatureCard> = [
  {
    title: 'Full-Stack Development',
    subtitle: 'Building scalable applications across frontend and backend',
    icon: DeploymentUnitOutlined,
    tags: ['Angular', 'Spring Boot', 'Testing'],
    desc: 'Developing enterprise-grade applications with clean architecture, maintainable codebases, and reliable integrations.',
  },
  {
    title: 'API & Backend Architecture',
    subtitle: 'Reliable, secure, and maintainable service design',
    icon: ApiOutlined,
    tags: ['REST', 'Security', 'Integrations'],
    desc: 'Designing backend systems and APIs focused on scalability, resilience, and long-term maintainability.',
  },
  {
    title: 'Infrastructure & Delivery',
    subtitle: 'Deployment pipelines and production-ready workflows',
    icon: ContainerOutlined,
    tags: ['Docker', 'CI/CD', 'AWS'],
    desc: 'Containerization, deployment automation, and development workflows that support reliable delivery.',
  },
]

export const FORGE: ReadonlyArray<IconCard> = [
  {
    title: 'VS Code',
    subtitle: 'Efficient development workflows, debugging and productivity',
    icon: LaptopOutlined,
  },
  {
    title: 'Figma',
    subtitle: 'UI collaboration, interface prototyping, and design system alignment',
    icon: BranchesOutlined,
  },
  {
    title: 'Git & Version Control',
    subtitle: 'Collaborative development, code reviews, and structured release workflows',
    icon: GithubOutlined,
  },
]
