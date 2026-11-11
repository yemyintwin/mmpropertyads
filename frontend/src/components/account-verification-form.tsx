"use client";

import { type FormEvent, useState } from "react";
import { submitJson } from "@/lib/api";

type VerificationAction = "forgot-password" | "reset-password" | "verify-email";

export function AccountVerificationForm({
  action,
  token = "",
}: {
  action: VerificationAction;
  token?: string;
}) {
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setFailed(false);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await submitJson(`/api/auth/${action}`, data);
    setPending(false);

    if (!result.ok) {
      setFailed(true);
      setMessage(result.message);
      return;
    }

    const messages: Record<VerificationAction, string> = {
      "forgot-password":
        "If an account exists for this address, password reset instructions will be sent.",
      "reset-password": "Your password reset request was accepted.",
      "verify-email": "Your email verification request was accepted.",
    };
    setMessage(messages[action]);
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {action === "forgot-password" && (
        <>
          <h1>Reset your password</h1>
          <p className="muted">We will send instructions if an account exists.</p>
          <label className="field">
            Email address
            <input autoComplete="email" name="email" required type="email" />
          </label>
        </>
      )}
      {action === "reset-password" && (
        <>
          <h1>Choose a new password</h1>
          <input name="token" type="hidden" value={token} />
          <label className="field">
            New password
            <input autoComplete="new-password" minLength={10} name="password" required type="password" />
          </label>
        </>
      )}
      {action === "verify-email" && (
        <>
          <h1>Verify your email</h1>
          <input name="token" type="hidden" value={token} />
          <p className="muted">Confirm your email address to activate your account.</p>
        </>
      )}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Please wait…" : "Continue"}
      </button>
      {message && (
        <p aria-live="polite" className={failed ? "notice notice-error" : "notice"}>
          {message}
        </p>
      )}
    </form>
  );
}
