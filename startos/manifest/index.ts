import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'odoo',
  title: 'Odoo',
  license: 'LGPL-3.0-only', // matches upstream odoo/odoo (Community Edition)
  packageRepo: 'https://github.com/tronsington/odoo-startos',
  upstreamRepo: 'https://github.com/odoo/odoo',
  marketingUrl: 'https://www.odoo.com',
  donationUrl: null,
  description: { short, long },
  // pgdata = Postgres cluster; data = Odoo's filestore/sessions at
  // /var/lib/odoo; main = this package's own store.json + generated
  // /main/odoo.conf. Do not co-locate.
  volumes: ['pgdata', 'data', 'main'],
  images: {
    // odoo 20.0-20261015 on Docker Hub, pinned by digest; verified amd64+
    // arm64 (+ppc64le) on 2026-10-17. Index digest equals the current
    // `latest` AND `20.0` tags — resolved via registry manifest HEADs, not
    // the GitHub tags API (which sorts by push order, not recency).
    odoo: {
      source: {
        dockerTag:
          'odoo@sha256:61e3c71b0503c5f658e604c3e340bede20b97d05f726179fa006eae50a32fd23',
      },
      arch: ['x86_64', 'aarch64'],
    },
    // postgres:16 — Odoo 20's documented minimum is PostgreSQL 16 (upstream
    // docs, source.rst "versionchanged:: 20"). Same pin the relay/twenty
    // packages carry.
    postgres: {
      source: {
        dockerTag:
          'postgres:16@sha256:ca0bd484cb98bf4b24eb1010e73fb3fcbd6714d240fbc1a10eea5b7dbecb641d',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // Odoo with workers=0 (threaded) idles small but wants headroom under load;
  // 2 GiB mirrors upstream's own limit_memory_soft default.
  hardwareRequirements: {
    ram: 2 * 1024 ** 3,
  },
})
