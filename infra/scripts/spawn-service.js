import { spawn } from "node:child_process";

function npmBin() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function cleanServices(service) {
  console.log(`Serviço '${service}' encerrado`);
  const stopServices = spawn(npmBin(), ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });
  stopServices.on("exit", () => {
    console.log("Serviços finalizados com sucesso!");
  });
}

export function runScript(script, service) {
  const runStartScript = spawn(npmBin(), ["run", script], {
    shell: true,
    stdio: "inherit",
  });

  process.on("SIGINT", () => {
    runStartScript.kill("SIGINT");
  });

  runStartScript.on("exit", () => {
    cleanServices(service);
  });
}
