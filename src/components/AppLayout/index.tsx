import { Button, Layout, Menu, Switch, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './styles.css'
import { KEY_TO_PATH, MENU_ITEMS, PATH_TO_KEY } from './consts'
import { isNavKey } from './utils'

const { Header, Content, Footer } = Layout
const { Text } = Typography

type Props = {
  theme: 'dark' | 'light'
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>
}

export default function AppLayout({ theme, setTheme }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedKey = PATH_TO_KEY[location.pathname] ?? 'home'

  const handleNavigation = (key: string) => {
    if (isNavKey(key)) navigate(KEY_TO_PATH[key])
  }

  return (
    <Layout className="app-shell">
      <Header className="top-nav">
        <Menu
          mode="horizontal"
          theme={theme}
          selectedKeys={[selectedKey]}
          className="top-nav__menu"
          onClick={(item) => handleNavigation(item.key)}
          items={MENU_ITEMS}
        />

        <Button type="primary" className="top-nav__cta" onClick={() => handleNavigation('contact')}>
          Contact Me
        </Button>

        <Switch
          className="theme-switch"
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          aria-label="Toggle dark mode"
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
      </Header>

      <Content className="page">
        <Outlet />
      </Content>

      <Footer className="footer">
        <div className="footer__inner">
          <Text type="secondary">
            © {new Date().getFullYear()} Elen Khachatryan's Portfolio. All rights reserved.
          </Text>
        </div>
      </Footer>
    </Layout>
  )
}
