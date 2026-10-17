<p align="center">
  <img src="icon.png" alt="Odoo Logo" width="21%">
</p>

# Odoo on StartOS

[Odoo Community Edition](https://www.odoo.com/) is a modular, open-source
business suite (CRM, sales, invoicing, accounting, inventory, project
management, website builder, and a large app catalog). This package runs
Odoo 20 (`20.0-20261015`, digest-pinned) plus an internal Postgres 16
sidecar, and produces `.s9pk` packages for amd64 and arm64.

Everything not listed in this document behaves the same as upstream Odoo —
the upstream documentation applies.

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Configuration](#configuration)
- [Actions](#actions)
- [Backups](#backups)
- [Interfaces and Networking](#interfaces-and-networking)
- [Health Checks](#health-checks)

## Image and Container Runtime

- `odoo` — `odoo:20.0-20261015` on Docker Hub, digest-pinned
  (`sha256:61e3c71b…`). Official Odoo image (ubuntu:noble + upstream `.deb`,
  entrypoint `entrypoint.sh` from `odoo/docker`). Runs as the image's `odoo`
  user.
- `postgres` — `postgres:16` on Docker Hub, digest-pinned
  (`sha256:ca0bd484…`). Odoo 20 requires Postgres ≥ 16.

Daemons in one network namespace: `postgres` listens on loopback only; the
`odoo` daemon mounts the `main` volume read-only at `/main` (carries the
generated `odoo.conf`) and the `data` volume at `/var/lib/odoo`. A
`chown-data` oneshot (`chown -R odoo:odoo /var/lib/odoo`, as root) fixes
volume ownership before `odoo` starts — the image's baked-in ownership is
shadowed by StartOS volume storage.

The upstream entrypoint's `wait-for-psql.py` reads `ODOO_RC` for DB
credentials, so the package points `ODOO_RC` at the generated
`/main/odoo.conf` and otherwise runs the image default (`odoo`).

## Volume and Data Layout

- `pgdata` — the Postgres cluster.
- `data` — Odoo's filestore, sessions and cache (`/var/lib/odoo`). Must stay
  paired with `pgdata` at backup/restore time (fields below).
- `main` — package-internal: `store.json` (generated secrets) and
  `odoo.conf`.
- `/mnt/extra-addons` remains unmounted/empty in v1 (no custom-addons
  volume).

## Configuration

Everything user-facing is generated at install; there is **no** setup action
required to start:

- `pgPassword` and `odooMasterPassword` are generated at install into
  `store.json` and written into `/main/odoo.conf` at every init (as
  `db_password` / `admin_passwd`).
- Odoo is run in single-database mode: `dbfilter = ^odoo$`. First run shows
  Odoo's own Database Manager; create one database named exactly `odoo`.
  This is what keeps backups coherent — `pg_dump` can only capture one named
  database.
- `workers = 0` (threaded): the websocket/bus rides the main 8069 port; no
  second port is exposed.
- `proxy_mode = True`: StartOS terminates and forwards; Odoo trusts the
  forwarded headers.

## Actions

- **Show Master Password** — displays the `admin_passwd` generated at
  install (masked, copyable). This is the password Odoo's Database Manager
  asks for when creating/deleting databases.

## Backups

`pg_dump -Fc` of the single `odoo` database, plus raw copies of the `data`
(filestore/sessions) and `main` (secrets + config) volumes. Restore brings
all three back together; do not mix a database dump from one backup with a
filestore from another.

## Interfaces and Networking

A single `web` interface on port 8069 serves the Odoo web app, the JSON-RPC
API, and (threaded mode) the live bus. Health checks hit `/web/health` on
loopback.

## Health Checks

- `postgres` — `pg_isready` against 127.0.0.1:5432.
- `odoo` — `GET /web/health` (upstream's `auth=none` endpoint; answers even
  before the database exists). 120 s grace on first boot (module scan).
