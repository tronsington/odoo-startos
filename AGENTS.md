# AGENTS.md — odoo-startos

StartOS service-package repository wrapping Odoo Community Edition
(official `odoo` image, digest-pinned) + a `postgres:16` sidecar.

- **Single-database by design.** `dbfilter = ^odoo$` (written into the
  generated `odoo.conf` by `init/seedFiles.ts`) means the Database Manager
  creates exactly one database, named `odoo`. That is what makes
  `Backups.withPgDump` correct — it dumps a single named database. Do not
  loosen the dbfilter without a backup strategy that covers user-named DBs.
- **The `chown-data` oneshot is load-bearing** — the odoo image runs as a
  non-root `odoo` user and the volume mount shadows the image's ownership.
  Same shape as the relay/AGENTS pattern; never route around it with idmap.
- **DB credentials live in `/main/odoo.conf`, not env** — the upstream
  entrypoint's `wait-for-psql.py` reads `ODOO_RC` for the connection, so
  env-only wiring stalls the boot at the postgres wait.
- **`/web/health` is upstream's own auth:none health endpoint** (works before
  any database exists) — use it for the readiness check; don't substitute a
  port check.
- Postgres is an internal sidecar on loopback; Odoo 20 requires PG ≥ 16.
  Externally: one interface at :8069, `workers = 0` (websocket rides the
  main port), `proxy_mode = True`.
