import { createClient } from "microcms-js-sdk";
import { loadEnv } from "vite-plus";

const env = loadEnv("", process.cwd(), "");

const SERVICE_DOMAIN = env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = env.MICROCMS_API_KEY;

export const client = createClient({
  serviceDomain: SERVICE_DOMAIN,
  apiKey: API_KEY,
});
