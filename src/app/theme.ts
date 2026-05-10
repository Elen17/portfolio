import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

const sharedTokens = {
  borderRadius: 10,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
}

export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...sharedTokens,

    colorPrimary: '#A855F7',
    colorInfo: '#A855F7',

    colorSuccess: '#22C55E',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',

    colorTextBase: '#E5E7EB',

    colorBgBase: '#0B0B10',
    colorBgLayout: '#0B0B10',

    colorBorder: 'rgba(255,255,255,0.10)',
  },

  components: {
    Button: {
      controlHeight: 40,
      paddingInline: 18,
    },

    Layout: {
      headerBg: 'rgba(11, 11, 16, 0.75)',
      bodyBg: '#0B0B10',
    },

    Card: {
      colorBgContainer: 'rgba(255,255,255,0.03)',
    },
  },
}

export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,

  token: {
    ...sharedTokens,

    colorPrimary: '#9333EA',
    colorInfo: '#9333EA',

    colorSuccess: '#16A34A',
    colorWarning: '#D97706',
    colorError: '#DC2626',

    colorTextBase: '#111827',

    colorBgBase: '#F8FAFC',
    colorBgLayout: '#F3F4F6',

    colorBorder: 'rgba(0,0,0,0.08)',
  },

  components: {
    Button: {
      controlHeight: 40,
      paddingInline: 18,
    },

    Layout: {
      headerBg: 'rgba(255,255,255,0.75)',
      bodyBg: '#F8FAFC',
    },

    // Card: {
    //   colorBgContainer: '#FFFFFF',
    // },
  },
}