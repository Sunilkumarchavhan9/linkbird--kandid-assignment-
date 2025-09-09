"use client";

import { createAuthClient } from "better-auth/react";

const resolvedBaseUrl = typeof window !== "undefined"
  ? `${window.location.origin}/api/auth`
  : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL
      ? `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth`
      : undefined);

export const authClient = createAuthClient({
    baseURL: resolvedBaseUrl,
});


