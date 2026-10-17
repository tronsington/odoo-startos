import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const showMasterPassword = sdk.Action.withoutInput(
  'show-master-password',
  async () => ({
    name: i18n('Show Master Password'),
    description: i18n(
      "Display Odoo's master password — the one the Database Manager asks for when creating or deleting databases.",
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const password = await storeJson.read((s) => s.odooMasterPassword).once()
    return {
      version: '1' as const,
      title: i18n('Odoo Master Password'),
      message: i18n(
        'Paste this into "Master Password" on Odoo’s Database Manager screen (shown on first run, or any time at /web/database/manager).',
      ),
      result: {
        type: 'single' as const,
        value: password ?? '',
        copyable: true,
        qr: false,
        masked: true,
        launchable: null,
      },
    }
  },
)
