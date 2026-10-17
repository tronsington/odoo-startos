# Odoo

Odoo is a full business suite: CRM, sales, invoicing, accounting, inventory,
project management, a website builder, and hundreds of installable apps —
with your data staying on your StartOS server.

## First run

1. Start the service and **launch the web UI**.
2. Odoo shows its **Database Manager**. Paste the **Master Password** --
   find it via the package's **Show Master Password** action (masked by
   default; click to reveal and copy).
3. Create your database named exactly **`odoo`** — the package is
   intentionally single-database, and that name is enforced. Pick your admin
   email and password in the same wizard; these are your login credentials
   for the app itself.
4. You land in Odoo's Apps menu. Install the apps you need (CRM, Invoicing,
   …) — each extends the same database.

## Using Odoo

Sign in with the email and password you set when creating the database.

Some pointers:

- **One database only.** The package pins the database name to `odoo`. This
  is deliberate: it is what makes backup/restore exact. If you genuinely
  need multiple companies, use Odoo's own multi-company feature inside the
  one database.
- **Backups capture everything**: the database (as a portable dump), the
  filestore (invoice PDFs, attachments) and the package's secrets. Restore
  brings all three back together — don't mix-and-match backups across time.
- **Email (SMTP)** is not configured by this package. Outgoing mail can be
  set up inside Odoo (Settings → Discuss/General Settings → Outgoing Mail
  Servers) with your own SMTP provider.
- **Custom addons**: this release mounts no extra-addons volume. Installing
  third-party modules means copying files into the service container; that
  is a later-package-version concern.

## Documentation

- Upstream Odoo documentation (Community): <https://www.odoo.com/documentation/20.0/>
- Odoo Apps catalog: <https://apps.odoo.com/apps>
- *Note*: some things marked "Odoo Online" or "Odoo.sh" upstream do not
  apply to a self-hosted box.
