import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "dist-server");

// 1. Nested package.json so Node treats compiled output as CommonJS
writeFileSync(join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }, null, 2));

// 2. Copy schema.sql next to compiled db module (dist-server/db/schema.sql)
const dbOut = join(outDir, "db");
if (!existsSync(dbOut)) mkdirSync(dbOut, { recursive: true });
copyFileSync(join(root, "src/db/schema.sql"), join(dbOut, "schema.sql"));

console.log("postbuild: wrote dist-server/package.json and copied schema.sql");
