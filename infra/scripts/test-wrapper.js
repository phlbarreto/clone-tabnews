import { runScript } from "./spawn-service.js";

(async function main() {
  runScript("test:raw", "jest");
})();
