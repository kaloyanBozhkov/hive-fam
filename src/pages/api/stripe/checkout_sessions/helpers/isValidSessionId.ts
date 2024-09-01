import { env } from "@/env";

export function isValidSessionId(sessionId?: string | null): sessionId is string {
  if (!sessionId) return false;
  return sessionId.startsWith(env.NODE_ENV === 'development' ? 'cs_test' : 'cs_');
}
