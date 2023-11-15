import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "@/utils/plugins/unocss.ts";
import {
  kvInsightsPlugin,
} from "https://deno.land/x/deno_kv_insights@v0.7.0-beta/mod.ts";
import { kv } from "@/utils/db/kv.ts";

export default defineConfig({
  plugins: [
    unocssPlugin(),
    kvInsightsPlugin({
      kv,
    }),
  ],
});
