// Reads every singleton and collection through the Keystatic reader, which validates each
// file against keystatic.config.tsx. A schema/data mismatch throws and fails the check.
import { createReader } from "@keystatic/core/reader";
import config from "../keystatic.config";

async function main() {
  const reader = createReader(process.cwd(), config);
  let failed = false;
  for (const key of Object.keys(config.singletons ?? {})) {
    try {
      await reader.singletons[key as keyof typeof reader.singletons].readOrThrow();
      console.log(`ok  singleton ${key}`);
    } catch (e) {
      failed = true;
      console.error(`ERR singleton ${key}: ${(e as Error).message}`);
    }
  }
  for (const key of Object.keys(config.collections ?? {})) {
    try {
      const all = await reader.collections[key as keyof typeof reader.collections].all();
      console.log(`ok  collection ${key} (${all.length})`);
    } catch (e) {
      failed = true;
      console.error(`ERR collection ${key}: ${(e as Error).message}`);
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
