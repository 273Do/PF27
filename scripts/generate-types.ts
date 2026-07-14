// ref: https://zenn.dev/stellarcreate/articles/20251214-microcms-typescript-auto-generation

import fs from "fs/promises";
import path from "path";
import { loadEnv } from "vite-plus";

const env = loadEnv("", process.cwd(), "");

const OUTPUT_FILE = path.join(process.cwd(), "src/gen/types", "microcms-schemas.ts");

const SERVICE_DOMAIN = env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = env.MICROCMS_MANAGEMENT_API_KEY;

if (!SERVICE_DOMAIN || !API_KEY) {
  console.error("MICROCMS_SERVICE_DOMAIN and MICROCMS_MANAGEMENT_API_KEY must be set");
  process.exit(1);
}

const MANAGEMENT_API_BASE = `https://${SERVICE_DOMAIN}.microcms-management.io/api/v1`;

type FieldKind =
  | "text"
  | "textArea"
  | "richEditor"
  | "richEditorV2"
  | "media"
  | "mediaList"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "relation"
  | "relationList"
  | "repeater"
  | "custom";

type Field = {
  fieldId: string;
  name: string;
  kind: FieldKind;
  required: boolean;
  customFieldIds?: string[];
};

type CustomField = {
  fieldId: string;
  name: string;
  fields: Field[];
};

type ApiSchema = {
  apiFields: Field[];
  customFields: CustomField[];
};

type ApiListItem = {
  name: string;
  endpoint: string;
  type: "list" | "object";
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": API_KEY! },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
};

const fieldKindToTypeScript = (field: Field, customFieldTypeNames: Map<string, string>): string => {
  switch (field.kind) {
    case "text":
    case "textArea":
    case "richEditor":
    case "richEditorV2":
    case "select":
    case "date":
      return "string";
    case "media":
      return "MicroCMSImage";
    case "mediaList":
      return "MicroCMSImage[]";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "repeater":
    case "custom": {
      if (!field.customFieldIds?.length) return "unknown";
      const types = field.customFieldIds.map((id) => customFieldTypeNames.get(id)).filter(Boolean);
      if (types.length === 0) return "unknown";
      const union = types.length === 1 ? types[0]! : `(${types.join(" | ")})`;
      return field.kind === "repeater" ? `${union}[]` : union;
    }
    case "relation":
    case "relationList":
      return field.kind === "relation" ? "MicroCMSRelation" : "MicroCMSRelation[]";
    default:
      return "unknown";
  }
};

const toTypeName = (id: string): string => id.charAt(0).toUpperCase() + id.slice(1);

const generateCustomFieldType = (
  cf: CustomField,
  customFieldTypeNames: Map<string, string>,
): string => {
  const typeName = customFieldTypeNames.get(cf.fieldId)!;
  let typeDef = `// Custom field: ${cf.name}\n`;
  typeDef += `export type ${typeName} = {\n`;

  for (const field of cf.fields) {
    const fieldType = fieldKindToTypeScript(field, customFieldTypeNames);
    const optional = field.required ? "" : "?";
    typeDef += `  ${field.fieldId}${optional}: ${fieldType};\n`;
  }

  typeDef += "};\n\n";
  return typeDef;
};

const generateApiType = (
  api: ApiListItem,
  schema: ApiSchema,
  customFieldTypeNames: Map<string, string>,
): string => {
  const typeName = toTypeName(api.endpoint);

  let typeDef = `// ${api.name} (${api.type})\n`;
  typeDef += `export type ${typeName} = {\n`;

  for (const field of schema.apiFields) {
    const fieldType = fieldKindToTypeScript(field, customFieldTypeNames);
    const optional = field.required ? "" : "?";
    typeDef += `  ${field.fieldId}${optional}: ${fieldType};\n`;
  }

  typeDef += "};\n\n";

  typeDef += `export type ${typeName}Response = ${typeName} & MicroCMSDate;\n\n`;

  if (api.type === "list") {
    typeDef += `export type ${typeName}ListResponse = {\n`;
    typeDef += `  contents: ${typeName}Response[];\n`;
    typeDef += `  totalCount: number;\n`;
    typeDef += `  offset: number;\n`;
    typeDef += `  limit: number;\n`;
    typeDef += "};\n\n";
  }

  return typeDef;
};

const main = async () => {
  console.log("Starting type generation...\n");

  const { apis } = await fetchJson<{ apis: ApiListItem[] }>(`${MANAGEMENT_API_BASE}/apis`);

  // Fetch all API schemas
  const schemas = new Map<string, ApiSchema>();
  for (const api of apis) {
    console.log(`Fetching schema for ${api.name} (${api.endpoint})...`);
    const schema = await fetchJson<ApiSchema>(`${MANAGEMENT_API_BASE}/apis/${api.endpoint}`);
    schemas.set(api.endpoint, schema);
  }

  // Collect all custom fields and build type name mapping
  const allCustomFields = new Map<string, CustomField>();
  for (const schema of schemas.values()) {
    for (const cf of schema.customFields) {
      allCustomFields.set(cf.fieldId, cf);
    }
  }

  const customFieldTypeNames = new Map<string, string>();
  for (const cf of allCustomFields.values()) {
    customFieldTypeNames.set(cf.fieldId, toTypeName(cf.fieldId));
  }

  // Generate output
  let output = `// このファイルは自動生成されています。手動で編集しないでください。\n`;
  output += `// Generated at: ${new Date().toISOString()}\n\n`;

  const imports = ["MicroCMSImage", "MicroCMSDate"];
  // Check if any field uses relation/relationList
  const hasRelation = [...schemas.values()].some((s) =>
    s.apiFields.some((f) => f.kind === "relation" || f.kind === "relationList"),
  );
  if (hasRelation) {
    imports.push("MicroCMSRelation");
  }
  output += `import type { ${imports.join(", ")} } from 'microcms-js-sdk';\n\n`;

  // Custom field types first
  for (const cf of allCustomFields.values()) {
    output += generateCustomFieldType(cf, customFieldTypeNames);
  }

  // API types
  for (const api of apis) {
    const schema = schemas.get(api.endpoint)!;
    output += generateApiType(api, schema, customFieldTypeNames);
  }

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, output, "utf-8");

  console.log(`\n✓ Types generated successfully at ${OUTPUT_FILE}`);
};

await main();
