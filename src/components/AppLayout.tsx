import { Button, Layout, Menu, Switch, Typography, Form } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import '../styles/site.css'
import { useState } from 'react'
import Icon from '@ant-design/icons'
import { darkTheme, lightTheme } from '../app/theme'

const { Header, Content, Footer } = Layout
const { Text } = Typography

type NavKey = 'home' | 'cover' | 'skills' | 'contact' | 'chat'
type Item = { key: NavKey; label: string; path: string }
type Props = {
  theme: 'dark' | 'light'
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>
}

const DEFUALT_NAVIGATION_PAGE = '/';
const NAV_ITEMS: Item[] = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'cover', label: 'Cover', path: '/cover' },
  { key: 'skills', label: 'Skills', path: '/skills' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'chat', label: 'Assistant', path: '/chat' },
]

function getSelectedKey(pathname: string): NavKey {
  switch (pathname) {
    case DEFUALT_NAVIGATION_PAGE:
      return 'home'
    case '/cover':
      return 'cover'
    case '/skills':
      return 'skills'
    case '/contact':
      return 'contact'
    case '/chat':
      return 'chat'
    default:
      return 'home'
  }
}

export default function AppLayout({ theme, setTheme}: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = getSelectedKey(location.pathname)

  const handleNavigation = (path: string) => {
    const item = NAV_ITEMS.find((nav) => nav.key === path)
    if (item) navigate(item.path)
  };

  return (
    <Layout className="app-shell">
      <Header className="top-nav">
        <Menu
          mode="horizontal"
          theme={theme}
          selectedKeys={[selectedKey]}
          className="top-nav__menu"
          onClick={(item) => handleNavigation(item.key as string)}
          items={NAV_ITEMS.map((item) => ({ key: item.key, label: item.label }))}
        />

        <Button type="primary" className="top-nav__cta" 
          onClick={() => handleNavigation('contact')}>
          Contact Me
        </Button>
        <Form.Item valuePropName="checked" className='switch-item'>
          <Switch defaultChecked 
                  onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}/>
        </Form.Item>
      </Header>

      <Content className="page">
        <Outlet />
      </Content>

      <Footer className="footer">
        <div className="footer__inner">
          <Text type="secondary">© {new Date().getFullYear()} Elen Khachatryan's Portfolio. All rights reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
}

