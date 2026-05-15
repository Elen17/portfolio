import { App as AntdApp, ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { darkTheme, lightTheme } from './theme'
import HomePage from '../pages/HomePage'
import CoverPage from '../pages/CoverPage'
import SkillsPage from '../pages/SkillsPage'
import ContactPage from '../pages/ContactPage'
import GeminiChatPage from '../pages/GeminiChatPage'
import AppLayout from '../components/AppLayout'
import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'portfolio.theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <ConfigProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <AntdApp>
        <Routes>
          <Route element={<AppLayout theme={theme} setTheme={setTheme} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cover" element={<CoverPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/chat" element={<GeminiChatPage />} />
          </Route>
        </Routes>
      </AntdApp>
    </ConfigProvider>
  )
}
