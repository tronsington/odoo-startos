import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { ODOO_DB, POSTGRES_PATH, POSTGRES_USER } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  // Database Manager creates exactly one DB (see dbfilter in seedFiles.ts);
  // pg_dump takes that name. Paired with the data volume: an Odoo restore
  // needs database AND filestore to be from the same backup.
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'pgdata',
    mountpoint: POSTGRES_PATH,
    pgdataPath: '/data',
    database: ODOO_DB,
    user: POSTGRES_USER,
    password: async () => {
      const password = await storeJson.read((s) => s.pgPassword).once()
      if (!password) throw new Error('No pgPassword found in store.json')
      return password
    },
  })
    .addVolume('data')
    .addVolume('main'),
)
