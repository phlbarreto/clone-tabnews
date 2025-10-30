import { createRouter } from "next-connect";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorsHandler);

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
  const pendingMigrations = await migrationsRunner(defaultMigrationOptions);
  await dbClient.end();
  return pendingMigrations;
}

async function getHandler(req, res) {
  const pendingMigrations = await runMigrations(true);
  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const migratedMigrations = await runMigrations(false);

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }
  return res.status(200).json(migratedMigrations);
}
