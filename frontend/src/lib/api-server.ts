import "server-only";
import { headers } from "next/headers";
import { requestJson, type ApiResult, isCurrentUser } from "@/lib/api";
import type { CurrentUser } from "@/types/listing";

export async function getCurrentUser(): Promise<ApiResult<CurrentUser>> {
  const result = await requestAsUser("/api/me");

  if (!result.ok) return result;
  return isCurrentUser(result.value)
    ? { ok: true, value: result.value }
    : {
        ok: false,
        message: "The account service returned data in an unsupported format.",
      };
}

export async function requestAsUser(path: string): Promise<ApiResult<unknown>> {
  const requestHeaders = await headers();
  return requestJson(path, {
    headers: { Cookie: requestHeaders.get("cookie") ?? "" },
  });
}
