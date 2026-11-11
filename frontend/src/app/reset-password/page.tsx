import type { Metadata } from "next";
import { AccountVerificationForm } from "@/components/account-verification-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="page-shell">
      {token ? (
        <AccountVerificationForm action="reset-password" token={token} />
      ) : (
        <div className="notice notice-error" role="status">
          The password reset link is incomplete. Request a new reset email.
        </div>
      )}
    </main>
  );
}
