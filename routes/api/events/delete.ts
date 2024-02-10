import { Handlers } from "$fresh/server.ts";
import { Event, getUser, kv, User } from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";
import imageKit from "@/utils/imagekit.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    const { eventID }: { eventID: string } = await req.json();

    if (!isUUID(eventID)) {
      return new Response(JSON.stringify({ error: "Invalid UUID" }), {
        status: 400,
      });
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (
      !event ||
      !event.value ||
      // checks owner, probably unnecessary -LS
      !event.value.members.some((e) => e.email == user.email && e.role === 0) ||
      // prevent people from uploading multiple things at the same time -LS
      event.value.banner.uploading == true
    ) {
      return new Response(JSON.stringify({ error: "Invalid event ID" }), {
        status: 400,
      });
    }

    if (event.value.banner.id) {
      imageKit!.deleteFile(event.value.banner.id);
    }

    let atomic = kv.atomic().delete(["event", eventID]);

    const members = await kv.getMany<User[]>(
      event.value.members.map((e) => ["user", e.email]),
    );

    for (const member of members) {
      const user = member.value!;

      atomic = atomic.set(["user", user.email], {
        ...user,
        events: user.events.filter((e) => e != eventID),
      });
    }

    const atomicResult = await atomic.commit();

    return new Response(JSON.stringify({ success: atomicResult.ok }), {
      status: 200,
    });
  },
};
