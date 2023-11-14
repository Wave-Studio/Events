import { Handlers } from "$fresh/server.ts";
import {
  Event,
  getUser,
  kv,
  PlanMaxEvents,
  Roles,
  User,
} from "@/utils/db/kv.ts";
import { isUUID } from "@/utils/db/misc.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const user = await getUser(req);
    if (!user) {
      return new Response(JSON.stringify({ error: "Not logged in" }), {
        status: 401,
      });
    }

    const {
      eventID,
      inviteEmail,
      role,
    }: { eventID: string; inviteEmail: string; role: Roles } = await req.json();

    if (!inviteEmail) {
      return new Response(JSON.stringify({ error: "Missing inviteEmail" }), {
        status: 400,
      });
    }

    if (!isUUID(eventID)) {
      return new Response(JSON.stringify({ error: "Invalid UUID" }), {
        status: 400,
      });
    }

    const toInviteUser = await kv.get<User>(["user", inviteEmail]);

    if (!toInviteUser.value) {
      return new Response(
        JSON.stringify({
          error:
            "User you want to invite is not signed up yet! Tell them to join first",
        }),
        {
          status: 404,
        },
      );
    }

    if (
      PlanMaxEvents[toInviteUser.value.plan] <= toInviteUser.value.events.length
    ) {
      return new Response(
        JSON.stringify({
          error: "User you want to invite has reached their event limit",
        }),
        {
          status: 403,
        },
      );
    }

    const event = await kv.get<Event>(["event", eventID]);

    if (!event.value) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    const member = event.value.members.find((m) => m.email == user.email);

    if (!member) {
      return new Response(
        JSON.stringify({ error: "Not a member of this event" }),
        {
          status: 403,
        },
      );
    }

    if (member.role > role) {
      return new Response(
        JSON.stringify({
          error: "Cannot invite someone with a higher role than you",
        }),
        {
          status: 403,
        },
      );
    }

    if (![Roles.OWNER, Roles.ADMIN, Roles.MANAGER].includes(member.role)) {
      return new Response(JSON.stringify({ error: "Missing permissions!" }), {
        status: 403,
      });
    }

    if (event.value.members.find((m) => m.email == inviteEmail) != undefined) {
      return new Response(JSON.stringify({ error: "User already invited!" }), {
        status: 409,
      });
    }

    // TODO: Send invite email

    const atomic = await kv
      .atomic()
      .set(["event", eventID], {
        ...event.value,
        members: [
          ...event.value.members,
          {
            email: inviteEmail,
            role,
          },
        ],
      })
      .set(["user", inviteEmail], {
        ...toInviteUser.value,
        events: [...toInviteUser.value.events, eventID],
      })
      .commit();

    return new Response(JSON.stringify({ success: atomic.ok }), {
      status: 200,
    });
  },
};
