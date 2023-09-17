import { Handlers } from "$fresh/server.ts";
import { generateOTP, validateOTP, generateAuthToken } from "@/utils/db/kv.ts";
import { setCookie } from "$std/http/cookie.ts";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i;

export const handler: Handlers<{ email: string; otp: string }> = {
  async GET(_req, ctx) {
    if (!emailRegex.test(ctx.params.email ?? "")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      });
    }

    const allowedEmails = JSON.parse(Deno.env.get("ALLOWED_EMAILS") ?? "[]");

    if (!allowedEmails.includes(ctx.params.email)) {
      return new Response(JSON.stringify({ error: "Email not allowed" }), {
        status: 400,
      });
    }

    const otp = await generateOTP(ctx.params.email);

    return new Response(JSON.stringify({ otp }), {
      status: 200,
    });
  },

  async POST(req, _ctx) {
    const { email, otp } = await req.json();

    if (!emailRegex.test(email ?? "")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      });
    }

    if (!/[0-9]{6}/.test(otp)) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
    }

    const user = await validateOTP(email, otp);

    if (user == undefined) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });

      // Eventually create a user if the OTP is valid but they don't have an account
      // const createdUser = await createUser(email);
    }

    if (user.authToken == undefined) {
      user.authToken = (await generateAuthToken(user.email))!;
    }

    setCookie(req.headers, {
      name: "authToken",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      value: user.authToken,
      path: "/",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  },
};
