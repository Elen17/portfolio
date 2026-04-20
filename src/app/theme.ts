import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const antdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#A855F7',
    colorInfo: '#A855F7',
    colorSuccess: '#22C55E',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorTextBase: '#E5E7EB',
    colorBgBase: '#0B0B10',
    colorBgLayout: '#0B0B10',
    colorBorder: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingInline: 18,
    },
    Layout: {
      headerBg: 'rgba(11, 11, 16, 0.6)',
      bodyBg: '#0B0B10',
    },
    Card: {
      colorBgContainer: 'rgba(255,255,255,0.03)',
    },
  },
}

