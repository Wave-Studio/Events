import {
  Plugin,
  PluginMiddleware,
  ResolvedFreshConfig,
} from "$fresh/server.ts";
import type postcss from "npm:postcss@8.4.31";
import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import { walk } from "https://deno.land/std@0.207.0/fs/walk.ts";

async function initTailwind(config: ResolvedFreshConfig) {
  return await (await import("./tailwind/compiler.ts")).initTailwind(config);
}

export default function tailwind(): Plugin {
  let staticDir = path.join(Deno.cwd(), "static");
  let processor: postcss.Processor | null = null;

  const cache = new Map<string, { content: string; map: string }>();

  const tailwindMiddleware: PluginMiddleware = {
    path: "/",
    middleware: {
      handler: async (_req, ctx) => {
        const pathname = ctx.url.pathname;

        if (pathname.endsWith(".css.map")) {
          const cached = cache.get(pathname);
          if (cached) return Response.json(cached.map);
        }

        if (!pathname.endsWith(".css") || !processor) {
          return ctx.next();
        }

        let cached = cache.get(pathname);
        if (!cached) {
          const filePath = path.join(staticDir, pathname);
          let text = "";
          try {
            text = await Deno.readTextFile(filePath);
            const res = await processor.process(text, {
              from: undefined,
            });

            cached = {
              content: res.content,
              map: res.map?.toString() ?? "",
            };
            cache.set(pathname, cached);
          } catch (err) {
            // If the file is not found than it's likely a virtual file
            // by the user that they respond to via a middleware.
            if (err instanceof Deno.errors.NotFound) {
              return ctx.next();
            }

            cached = {
              content: text,
              map: "",
            };
            console.error(err);
          }
        }

        return new Response(cached!.content, {
          status: 200,
          headers: {
            "Content-Type": "text/css",
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
          },
        });
      },
    },
  };

  const middlewares: Plugin["middlewares"] = [];

  return {
    name: "tailwind",
    async configResolved(config) {
      if (config.dev) {
        staticDir = config.staticDir;
        processor = await initTailwind(config);
        middlewares.push(tailwindMiddleware);
      }
    },
    middlewares,
    async buildStart(config) {
      staticDir = config.staticDir;
      const outDir = path.join(config.build.outDir, "static");

      processor = await initTailwind(config);

      const files = walk(config.staticDir, {
        exts: ["css"],
        includeDirs: false,
        includeFiles: true,
      });

      for await (const file of files) {
        const content = await Deno.readTextFile(file.path);
        const result = await processor.process(content, {
          from: undefined,
        });

        const relFilePath = path.relative(staticDir, file.path);
        const outPath = path.join(outDir, relFilePath);
        await Deno.writeTextFile(outPath, result.content);
      }
    },
  };
}
