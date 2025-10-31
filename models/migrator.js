import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

async function runMigrations(dryRun) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dryRun,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  const migrations = await migrationsRunner(defaultMigrationOptions);
  await dbClient?.end();
  return migrations;
}

async function listPendingMigrations() {
  return await runMigrations(true);
}

async function runPendingMigrations() {
  return await runMigrations(false);
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
