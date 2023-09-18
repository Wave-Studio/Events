export const genCode = async (email: string) => {
  const req = await fetch(`/api/auth/login?email=${email}`, {
    method: "GET",
  });

  const res = await req.json() as { otp?: string; error?: string };

  return res;
};

export const checkCode = async (email: string, code: string) => {
  const req = await fetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, otp: code }),
  });

  const res = await req.json() as { success?: true; error?: string };

  return res;
};
