import { ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { antdTheme } from './theme'
import HomePage from '../pages/HomePage'

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ConfigProvider>
  )
}

