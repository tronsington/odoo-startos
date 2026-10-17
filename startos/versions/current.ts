import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '20.0.0:0',
  releaseNotes: {
    en_US:
      'Initial StartOS package of Odoo 20.0 (nightly-snapshot 20.0-20261015, digest-pinned). Runs Odoo plus an internal Postgres 16 sidecar; create your single database (named "odoo") on first login via the Database Manager, using the master password from the "Show Master Password" action.',
    es_ES:
      'Paquete inicial para StartOS de Odoo 20.0 (instantánea nightly 20.0-20261015, fijada por digest). Ejecuta Odoo con un sidecar interno de Postgres 16; crea tu única base de datos (llamada "odoo") en el primer inicio de sesión mediante el Administrador de bases de datos, usando la contraseña maestra de la acción "Show Master Password".',
    de_DE:
      'Erstes StartOS-Paket für Odoo 20.0 (Nightly-Snapshot 20.0-20261015, per Digest angepinnt). Startet Odoo mit einem internen Postgres-16-Sidecar; lege deine einzige Datenbank (mit dem Namen "odoo") beim ersten Login über den Datenbank-Manager an, mit dem Master-Passwort aus der Aktion "Show Master Password".',
    pl_PL:
      'Pierwszy pakiet StartOS dla Odoo 20.0 (zrzut nightly 20.0-20261015, przypięty po digeście). Uruchamia Odoo z wewnętrznym sidecarem Postgres 16; utwórz pojedynczą bazę danych (o nazwie "odoo") przy pierwszym logowaniu przez Menedżer baz danych, używając hasła głównego z akcji "Show Master Password".',
    fr_FR:
      'Premier paquet StartOS pour Odoo 20.0 (instantané nightly 20.0-20261015, épinglé par digest). Lance Odoo avec un sidecar Postgres 16 interne ; créez votre base unique (nommée « odoo ») à la première connexion via le gestionnaire de bases de données, avec le mot de passe maître de l’action "Show Master Password".',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
