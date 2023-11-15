import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "@/utils/plugins/unocss.ts";
import {
  createQueueValueHandler,
  kvInsightsPlugin,
} from "https://deno.land/x/deno_kv_insights@v0.7.0-beta/mod.ts";
import { kv } from "./utils/db/kv.ts";

const kvInsightsQueueValueHandler = createQueueValueHandler();

kv.listenQueue(async (value: unknown) => {
  await kvInsightsQueueValueHandler(value); // execute the kv-insights value handler
  // add your code to handle the queue value here
});

export default defineConfig({
  plugins: [unocssPlugin()
    // kvInsightsPlugin({
    //  kv
    // })
  ],
});
