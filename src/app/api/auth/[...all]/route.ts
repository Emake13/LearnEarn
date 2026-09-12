import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Sign-up is a chain of sequential database calls (look up existing email,
// create the user, create the credential account, create the session).
// Vercel's default serverless timeout (10s on Hobby) can kill that chain
// before the user record is even created. Raising it here only takes effect
// on Vercel; other hosts ignore this export.
export const maxDuration = 60;

export const { POST, GET } = toNextJsHandler(auth);
