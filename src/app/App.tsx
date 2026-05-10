import { ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { darkTheme, lightTheme } from './theme'
import HomePage from '../pages/HomePage'
import CoverPage from '../pages/CoverPage'
import SkillsPage from '../pages/SkillsPage'
import ContactPage from '../pages/ContactPage'
import GeminiChatPage from '../pages/GeminiChatPage'
import AppLayout from '../components/AppLayout'
import { useEffect, useState } from 'react'


export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  
  const downloadCV = () => {
    window.open(import.meta.env.VITE_CV_PATH, '_blank')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ConfigProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <Routes>
        <Route element={<AppLayout  
              theme={theme}
              setTheme={setTheme} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cover" element={<CoverPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/chat" element={<GeminiChatPage />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}

