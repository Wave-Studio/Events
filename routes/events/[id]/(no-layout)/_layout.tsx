import { LayoutConfig } from "$fresh/server.ts";
import Layout from "../_layout.tsx";

export const config: LayoutConfig = {
  skipInheritedLayouts: true, // Skip already inherited layouts
};

export default Layout;
