// ref: https://zenn.dev/stellarcreate/articles/20251214-microcms-typescript-auto-generation
// microcms からエンドポイントを取得しスキーマファイルを作成するスクリプト

import fs from "fs/promises";
import path from "path";

try {
  process.loadEnvFile();
} catch {
  // .env file not found (e.g. CI environment) — rely on environment variables
}

const SERVICE_ID = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_MANAGEMENT_API_KEY;
const BASE_URL = `https://${SERVICE_ID}.microcms-management.io/api/v1`;
const SCHEMAS_DIR = path.join(process.cwd(), "src/gen", "microcms-schemas");

const headers = { "X-MICROCMS-API-KEY": API_KEY! };

const fetchApiList = async (): Promise<{ name: string; endpoint: string; type: string }[]> => {
  const res = await fetch(`${BASE_URL}/apis`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch API list: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.apis;
};

const fetchSchema = async (endpoint: string) => {
  console.log(`Fetching schema for ${endpoint}...`);
  const res = await fetch(`${BASE_URL}/apis/${endpoint}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch schema for ${endpoint}: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

const main = async () => {
  console.log("Starting schema fetch...\n");

  await fs.mkdir(SCHEMAS_DIR, { recursive: true });

  const apis = await fetchApiList();
  console.log(`Found ${apis.length} APIs: ${apis.map((a) => a.endpoint).join(", ")}\n`);

  for (const api of apis) {
    try {
      const schema = await fetchSchema(api.endpoint);
      const filePath = path.join(SCHEMAS_DIR, `${api.endpoint}.json`);

      const schemaWithMetadata = {
        id: api.endpoint,
        name: api.name,
        endpoint: api.endpoint,
        kind: api.type,
        fields: schema.apiFields || [],
      };

      await fs.writeFile(filePath, JSON.stringify(schemaWithMetadata, null, 2), "utf-8");
      console.log(`✓ Saved schema to ${filePath}`);
    } catch (error) {
      console.error(`✗ Error fetching schema for ${api.endpoint}:`, error);
      process.exit(1);
    }
  }

  console.log("\n✓ All schemas fetched successfully!");
};

await main();
