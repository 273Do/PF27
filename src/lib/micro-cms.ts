import { createClient } from "microcms-js-sdk";

import type { MainServiceSchema } from "@/gen/microcms-types";

export const client = createClient<MainServiceSchema>({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_INFO_API_KEY,
});
