1. Installs all dependencies listed in package.json (e.g., express, sqlite3, bcrypt, ts-node-dev)
npm install

2. Applies the schema from erd.txt to create db.sqlite3 with user and session tables
npx auto-migrate db.sqlite3 < erd.txt
PS (bash mode to run)

3. Applies any pending migrations (via knex) and generates proxy.ts for database access
npm run db:update

4. Runs server.ts
npx ts-node server.ts


Export all code
Ctrl+Shift+P -> Dir2file: Select Files to Export -> Enter
PS: installed "Export Directory to File"