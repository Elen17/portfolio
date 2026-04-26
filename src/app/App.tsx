import { ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { antdTheme } from './theme'
import HomePage from '../pages/HomePage'
import SiteLayout from '../components/SiteLayout'
import CoverPage from '../pages/CoverPage'
import SkillsPage from '../pages/SkillsPage'
import ContactPage from '../pages/ContactPage'
import GeminiChatPage from '../pages/GeminiChatPage'

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Routes>
        <Route element={<SiteLayout />}>
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

