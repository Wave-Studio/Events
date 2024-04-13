import { defineLayout, LayoutConfig } from "$fresh/server.ts";

export const config: LayoutConfig = {
	skipInheritedLayouts: true, // Skip already inherited layouts
};

export default defineLayout((req, ctx) => {
	return (
		<>
			<ctx.Component />
		</>
	);
});
