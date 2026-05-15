import { KEY_TO_PATH, type NavKey } from './consts'

export function isNavKey(key: string): key is NavKey {
  return key in KEY_TO_PATH
}
