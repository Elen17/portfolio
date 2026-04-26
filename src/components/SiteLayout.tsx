import { Button, Layout, Menu, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import '../styles/site.css'

const { Header, Content, Footer } = Layout
const { Text } = Typography

type NavKey = 'home' | 'cover' | 'skills' | 'contact' | 'chat'

const NAV_ITEMS: { key: NavKey; label: string; path: string }[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'cover', label: 'Cover', path: '/cover' },
  { key: 'skills', label: 'Skills', path: '/skills' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'chat', label: 'Chat', path: '/chat' },
]

function getSelectedKey(pathname: string): NavKey {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/cover')) return 'cover'
  if (pathname.startsWith('/skills')) return 'skills'
  if (pathname.startsWith('/contact')) return 'contact'
  if (pathname.startsWith('/chat')) return 'chat'
  return 'home'
}

export default function SiteLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = getSelectedKey(location.pathname)

  return (
    <Layout className="app-shell">
      <Header className="top-nav">
        <button type="button" className="top-nav__brand" onClick={() => navigate('/')}>
          ARCHITECT
        </button>

        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[selectedKey]}
          className="top-nav__menu"
          onClick={({ key }) => {
            const item = NAV_ITEMS.find((nav) => nav.key === key)
            if (item) navigate(item.path)
          }}
          items={NAV_ITEMS.map((item) => ({ key: item.key, label: item.label }))}
        />

        <Button type="primary" className="top-nav__cta" onClick={() => navigate('/contact')}>
          Hire Me
        </Button>
      </Header>

      <Content className="page">
        <Outlet />
      </Content>

      <Footer className="footer">
        <div className="footer__inner">
          <Text type="secondary">© {new Date().getFullYear()} Architect Portfolio. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  )
}

