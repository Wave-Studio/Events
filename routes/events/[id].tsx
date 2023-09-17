import { defineRoute, LayoutConfig } from "$fresh/server.ts";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineRoute(async (req, ctx) => {
  return (
    <div>
      <h1>Dynamic Route</h1>
      <p>Route ID: {await ctx.params.id}</p>
    </div>
  );
});
