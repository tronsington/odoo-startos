import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  ODOO_CONFIG_PATH,
  ODOO_DATA_PATH,
  ODOO_HTTP_PORT,
  POSTGRES_BOOTSTRAP_DB,
  POSTGRES_PATH,
  POSTGRES_USER,
} from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Odoo'))

  // Mapped read: only fields that feed daemon env (relay package precedent).
  const store = await storeJson
    .read((s) => ({ pgPassword: s.pgPassword }))
    .const(effects)
  const pgPassword = store?.pgPassword ?? ''

  /**
   * ======================== PostgreSQL sidecar ========================
   */
  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'pgdata',
      subpath: null,
      mountpoint: POSTGRES_PATH,
      readonly: false,
    }),
    'postgres',
  )

  const odooSub = sdk.SubContainer.of(
    effects,
    { imageId: 'odoo' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/main',
        readonly: true,
      })
      .mountVolume({
        volumeId: 'data',
        subpath: null,
        mountpoint: ODOO_DATA_PATH,
        readonly: false,
      }),
    'odoo',
  )
  const odooSubChown = sdk.SubContainer.of(
    effects,
    { imageId: 'odoo' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'data',
      subpath: null,
      mountpoint: ODOO_DATA_PATH,
      readonly: false,
    }),
    'odoo-chown',
  )

  return (
    sdk.Daemons.of(effects)
      .addDaemon('postgres', {
        subcontainer: postgresSub,
        exec: {
          command: sdk.useEntrypoint(['-c', 'listen_addresses=127.0.0.1']),
          env: {
            POSTGRES_DB: POSTGRES_BOOTSTRAP_DB,
            POSTGRES_USER,
            POSTGRES_PASSWORD: pgPassword,
          },
        },
        ready: {
          display: null,
          fn: async () => {
            const result = await postgresSub.exec([
              'pg_isready',
              '-q',
              '-h',
              '127.0.0.1',
              '-U',
              POSTGRES_USER,
              '-d',
              POSTGRES_BOOTSTRAP_DB,
            ])
            return result.exitCode === 0
              ? { result: 'success', message: i18n('PostgreSQL is ready') }
              : {
                  result: 'starting',
                  message: i18n('Waiting for PostgreSQL to be ready'),
                }
          },
          gracePeriod: 30_000,
        },
        requires: [],
      })
      // One-shot: the odoo image runs as a non-root 'odoo' user and the image
      // pre-chowns /var/lib/odoo, but a StartOS volume mount shadows that
      // ownership, so odoo can't write its filestore without this. Explicit
      // chown as root, the same pattern the relay package uses. Idempotent.
      .addOneshot('chown-data', {
        subcontainer: odooSubChown,
        exec: {
          command: ['chown', '-R', 'odoo:odoo', ODOO_DATA_PATH],
          user: 'root',
        },
        requires: [],
      })
      .addDaemon('odoo', {
        subcontainer: odooSub,
        exec: {
          // Upstream entrypoint: waits for postgres, then execs odoo with
          // any db args not present in ODOO_RC. Our /main/odoo.conf (written
          // by init) carries them all, so the default command stands.
          command: sdk.useEntrypoint(),
          env: {
            ODOO_RC: ODOO_CONFIG_PATH,
          },
        },
        ready: {
          display: i18n('Odoo'),
          fn: () =>
            sdk.healthCheck.checkWebUrl(
              effects,
              // '/web/health' is upstream's own auth:none endpoint for this
              // (webs addons home.py), answering {"status":"pass"} even
              // before a database exists — the pre-wizard state.
              `http://127.0.0.1:${ODOO_HTTP_PORT}/web/health`,
              {
                successMessage: i18n('Odoo is ready'),
                errorMessage: i18n('Odoo is not ready'),
              },
            ),
          // First boot scans every addon module before serving.
          gracePeriod: 120_000,
        },
        requires: ['postgres', 'chown-data'],
      })
  )
})
