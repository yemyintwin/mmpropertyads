import type { Metadata } from "next";
import { AccountVerificationForm } from "@/components/account-verification-form";

export const metadata: Metadata = {
  title: "Verify email",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="page-shell">
      {token ? (
        <AccountVerificationForm action="verify-email" token={token} />
      ) : (
        <div className="notice notice-error" role="status">
          The verification link is incomplete.
        </div>
      )}
    </main>
  );
}
