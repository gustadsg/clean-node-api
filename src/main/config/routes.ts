import { Express, Router } from "express";
import { readdirSync } from "fs";
import { resolve } from "path";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);

  const routesPath = resolve(__dirname, "..", "routes");

  readdirSync(routesPath).map(async (file) => {
    if (!isTestFile(file)) {
      (await import(resolve(routesPath, file))).default(router);
    }
  });
};

function isTestFile(path: string): boolean {
  return path.includes(".test.") || path.includes(".spec.");
}
