export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Odoo': 0,
  'PostgreSQL is ready': 1,
  'Waiting for PostgreSQL to be ready': 2,
  Odoo: 3,
  'Odoo is ready': 4,
  'Odoo is not ready': 5,
  // interfaces.ts
  'Odoo web app and API': 6,
  // actions/showMasterPassword.ts
  'Show Master Password': 7,
  "Display Odoo's master password — the one the Database Manager asks for when creating or deleting databases.": 8,
  'Odoo Master Password': 9,
  'Paste this into "Master Password" on Odoo’s Database Manager screen (shown on first run, or any time at /web/database/manager).': 10,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
