import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = typeof params.returnUrl === "string" ? params.returnUrl : "";
  const returnUrl =
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.includes("\\")
      ? requested
      : "/account";

  return <main className="page-shell"><AuthForm mode="login" returnUrl={returnUrl} /></main>;
}
