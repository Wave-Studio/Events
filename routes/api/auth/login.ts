import { Handlers } from "$fresh/server.ts";
import {
  createUser,
  generateAuthToken,
  generateOTP,
  validateOTP,
} from "@/utils/db/kv.ts";
import { deleteCookie, setCookie } from "$std/http/cookie.ts";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const handler: Handlers<{ email: string; otp: string }> = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const email = searchParams.get("email")!;

    if (!emailRegex.test(email ?? "")) {
      const response = new Response(
        JSON.stringify({ error: "Invalid email" }),
        {
          status: 400,
        },
      );
      deleteCookie(response.headers, "authToken", { path: "/" });
      return response;
    }

    // fetch(`/api/auth/login?email=${email}`)

    const allowedEmails = JSON.parse(Deno.env.get("ALLOWED_EMAILS") ?? "[]");

    if (!allowedEmails.includes(email) && Deno.env.get("DENO_DEPLOYMENT_ID") != undefined) {
      return new Response(
        JSON.stringify({ error: "Your email isn't whitelisted" }),
        {
          status: 400,
        },
      );
    }

    const otp = await generateOTP(email);

    // Currently used for development as we don't have a way to send emails currently
    const response = new Response(JSON.stringify({ otp }), {
      status: 200,
    });

    deleteCookie(response.headers, "authToken", { path: "/" });

    return response;
  },

  async POST(req, _ctx) {
    const { email, otp } = await req.json();

    if (!emailRegex.test(email ?? "")) {
      const response = new Response(
        JSON.stringify({ error: "Invalid email" }),
        {
          status: 400,
        },
      );
      deleteCookie(response.headers, "authToken", { path: "/" });
      return response;
    }

    if (!/[0-9]{6}/.test(otp)) {
      const response = new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
      deleteCookie(response.headers, "authToken", { path: "/" });
      return response;
    }

    const user = await validateOTP(email, otp);
    let userAuthToken = typeof user == "object" ? user.authToken : undefined;

    if (user == undefined) {
      const response = new Response(JSON.stringify({ error: "Invalid OTP" }), {
        status: 400,
      });
      deleteCookie(response.headers, "authToken", { path: "/" });
      return response;
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

    deleteCookie(resp.headers, "authToken", { path: "/" });

    setCookie(resp.headers, {
      name: "authToken",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      value: userAuthToken!,
      path: "/",
    });

    return resp;
  },
};
