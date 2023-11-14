import { MiddlewareHandlerContext } from '$fresh/src/server/types.ts';
import { getUser } from "@/utils/db/kv.ts";

export const handler = [handleKVInsightsAuthorization];

async function handleKVInsightsAuthorization(request: Request, context: MiddlewareHandlerContext) {
  const user = await getUser(request);

  const allowedUsers = JSON.parse(Deno.env.get('ALLOWED_EMAILS') ?? '[]');

  if (user && allowedUsers.includes(user.email)) {
    return context.next();
  }

  return new Response("Not permitted! Redirecting...", {
    headers: {
      Location: "/",
    },
    status: 307,
  });
}