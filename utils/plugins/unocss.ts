// From https://github.com/denoland/fresh/pull/1303
import type { Preset, UserConfig } from "https://esm.sh/@unocss/core@0.55.7";
import { UnoGenerator } from "https://esm.sh/@unocss/core@0.55.7";
import presetTypography from "https://esm.sh/@unocss/preset-typography@0.55.7?bundle&no-check";
import { Plugin } from "$fresh/server.ts";

const defaultConfig: UserConfig = {
  presets: [
    //presetWind() as unknown as Preset,
    presetTypography() as unknown as Preset,
  ],
};

export default function unocss(config: UserConfig = defaultConfig): Plugin {
  const uno = new UnoGenerator(config);
  return {
    name: "unocss",
    async renderAsync(ctx) {
      const { htmlText } = await ctx.renderAsync();
      const { css } = await uno.generate(htmlText);
      return {
        scripts: [],
        styles: [
          {
            cssText: `${css}`,
          },
        ],
      };
    },
  };
}
