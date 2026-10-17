# Updating this package

Upstream releases: Odoo ships a new **major** each fall (18.0, 19.0, 20.0…)
plus dated refreshes of each major on Docker Hub (e.g. `20.0-20261015`).

To update:

1. Pick the newest dated tag of the current major on Docker Hub
   (`odoo` repo). Confirm the pin the right way: the tag's digest must equal
   `odoo:<major>`/`:latest`'s digest and Hub `last_updated` should be recent
   — never trust GitHub tag ordering.
2. Confirm the Postgres minimum for that Odoo version in upstream's install
   docs (Odoo 20 requires PostgreSQL ≥ 16; the sidecar pin is `postgres:16`).
3. Bump the digests and comments in `startos/manifest/index.ts` and the
   version in `startos/versions/current.ts` (carry the dated tag in the
   release notes).
4. Rebuild both arches, and re-verify on a test box with an existing
   database — Odoo upgrades run module migrations on first boot.

Major-version upgrades (e.g. 19 → 20) deserve extra caution: test the
boot + a DB migration on real hardware before publishing.
