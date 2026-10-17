import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  // Internal secrets, auto-generated at install (init/seedFiles.ts). Never
  // re-rolled: postgres would need its cluster rebuilt, and admin_passwd is
  // what gates Odoo's Database Manager (creating/dropping databases).
  pgPassword: z.string().catch(''),
  odooMasterPassword: z.string().catch(''),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
