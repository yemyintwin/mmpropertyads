import type { Metadata } from "next";
import { AccountVerificationForm } from "@/components/account-verification-form";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <main className="page-shell">
      <AccountVerificationForm action="forgot-password" />
    </main>
  );
}
