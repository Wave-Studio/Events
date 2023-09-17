import { Handlers } from "$fresh/server.ts";
import {
  createUser,
  generateAuthToken,
  generateOTP,
  validateOTP,
} from "@/utils/db/kv.ts";
import { setCookie } from "$std/http/cookie.ts";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const handler: Handlers<{ email: string; otp: string }> = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const email = searchParams.get("email")!;

    if (!emailRegex.test(email ?? "")) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
      });
    }

    // fetch(`/api/auth/login?email=${email}`)

    const allowedEmails = JSON.parse(Deno.env.get("ALLOWED_EMAILS") ?? "[]");

    if (!allowedEmails.includes(email)) {
      return new Response(JSON.stringify({ error: "Email not allowed" }), {
        status: 400,
      });
    }

    const otp = await generateOTP(email);

    // Currently used for development as we don't have a way to send emails currently
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
    let userAuthToken = typeof user == "object" ? user.authToken : undefined;

    if (user == undefined) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
    }

    if (user == false) {
      userAuthToken = await createUser(email);
    }

    if (userAuthToken == undefined && user != false) {
      userAuthToken = (await generateAuthToken(email))!;
    }

    const resp = new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

    setCookie(resp.headers, {
      name: "authToken",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      value: userAuthToken!,
      path: "/",
    });

    return resp;
  },
};
