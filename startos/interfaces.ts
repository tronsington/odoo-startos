import { i18n } from './i18n'
import { sdk } from './sdk'
import { ODOO_HTTP_PORT } from './utils'

// One host, one binding, one interface — Odoo serves its web app, API and
// (in workers=0 mode) websocket on 8069. (Never add a second binding:
// StartOS auto-disables a public domain on every sibling of the binding that
// gets one.)
export const hostId = 'odoo'
export const webInterfaceId = 'web'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, hostId)
  const origin = await multi.bindPort(ODOO_HTTP_PORT, {
    protocol: 'http',
    preferredExternalPort: ODOO_HTTP_PORT,
  })

  const web = sdk.createInterface(effects, {
    name: i18n('Odoo'),
    id: webInterfaceId,
    description: i18n('Odoo web app and API'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await origin.export([web])]
})
