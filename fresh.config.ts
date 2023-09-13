import { defineConfig } from "$fresh/server.ts";
import unocssPlugin from "@/utils/plugins/unocss.ts";

export default defineConfig({
  plugins: [await unocssPlugin()],
});
