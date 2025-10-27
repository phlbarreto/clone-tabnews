import { runScript } from "./spawn-service.js";

(async function main() {
  runScript("dev:raw", "next dev");
})();
