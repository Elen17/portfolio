export type NavKey = 'home' | 'cover' | 'skills' | 'contact' | 'chat'

type NavItem = { key: NavKey; label: string; path: string }

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { key: 'home', label: 'Home', path: '/' },
  { key: 'cover', label: 'Cover', path: '/cover' },
  { key: 'skills', label: 'Skills', path: '/skills' },
  { key: 'contact', label: 'Contact', path: '/contact' },
  { key: 'chat', label: 'Assistant', path: '/chat' },
]

export const PATH_TO_KEY: Readonly<Record<string, NavKey>> = Object.fromEntries(
  NAV_ITEMS.map((i) => [i.path, i.key]),
)

export const KEY_TO_PATH: Readonly<Record<NavKey, string>> = Object.fromEntries(
  NAV_ITEMS.map((i) => [i.key, i.path]),
) as Record<NavKey, string>

export const MENU_ITEMS = NAV_ITEMS.map(({ key, label }) => ({ key, label }))
