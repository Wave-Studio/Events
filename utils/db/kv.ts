import { AuthCode, Event, Ticket, User, Plan } from "./kv.types.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { useState } from "preact/hooks";

export * from "./kv.types.ts";

export const kv = await Deno.openKv(
  Deno.env.get("DENO_DEPLOYMENT_ID") == undefined
    ? "./db/db.sqlite"
    : undefined,
);

export const getUser = async (req: Request) => {
  // const [cachedUser, setCachedUser] = useState<User | undefined>(undefined);

  // if (cachedUser != undefined) return cachedUser;

  const cookies = getCookies(req.headers);
  const authToken = cookies.authToken;

  if (authToken == undefined) return undefined;

  const [email] = authToken.split("_");

  try {
    atob(email);
  } catch {
    return undefined;
  }

  const user = await kv.get<User>(["user", atob(email)]);

  if (user.value == undefined) {
    return undefined;
  }

  if (user.value.authToken != authToken) {
    return undefined;
  }

  // setCachedUser(user.value);

  return user.value;
};

export const createUser = async (email: string) => {
  const userAuthToken = (await generateAuthToken(email, false))!;

  const userInfo: User = {
    email,
    authToken: userAuthToken,
    events: [],
    tickets: [],
    onboarded: false,
    plan: Plan.BASIC,
    joinedAt: Date.now().toString(),
  };

  await kv.set(["user", email], userInfo);

  return userAuthToken;
};

export const getUserEmailCode = async (
  email: string,
  authCode: string,
  req: Request,
) => {
  const [authCodeData, user] = await kv.getMany<[AuthCode, User]>([
    ["authCode", authCode, email],
    ["user", email],
  ]);

  if (authCodeData.value == undefined) return undefined;
  if (user.value == undefined) return undefined;

  setCookie(req.headers, {
    name: "authToken",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    value: user.value.authToken,
    path: "/",
  });

  return user.value;
};

export const validateOTP = async (
  email: string,
  otp: string,
  deleteOTP = true,
): Promise<User | false | undefined> => {
  const [authCodeData, user] = await kv.getMany<[AuthCode, User]>([
    ["authCode", email, otp],
    ["user", email],
  ]);

  if (authCodeData.value == undefined) return undefined;
  if (user.value == undefined) return false;

  if (deleteOTP) {
    await kv.delete(["authCode", email, otp]);
  }

  return user.value;
};

export const generateAuthToken = async (email: string, save = true) => {
  const token = `${btoa(email)}_${btoa(crypto.randomUUID().replace(/-/g, ""))}`;

  if (save) {
    const user = await kv.get<User>(["user", email]);

    if (user.value != undefined) {
      await kv.set(["user", email], {
        ...user.value,
        authToken: token,
      });
    }
  }

  return token;
};

export const generateOTP = async (email: string) => {
  const otpArray = new Uint32Array(1);
  crypto.getRandomValues(otpArray);
  const otp = otpArray[0].toString().substring(0, 6);

  await kv.set(
    ["authCode", email, otp],
    {
      existsSince: Date.now(),
    },
    {
      expireIn: 5 * 60 * 1000,
    },
  );

  return otp;
};
