"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitJson } from "@/lib/api";

export function AuthForm({
  mode,
  returnUrl = "/account",
}: {
  mode: "login" | "register";
  returnUrl?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setFailed(false);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const result = await submitJson(
      mode === "login" ? "/api/auth/login" : "/api/auth/register",
      payload,
    );
    setPending(false);
    if (!result.ok) {
      setFailed(true);
      setMessage(result.message);
      return;
    }

    if (mode === "login") {
      router.replace(returnUrl);
      return;
    }

    setMessage("Registration submitted. Check your email for a verification link.");
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="muted">
        {mode === "login"
          ? "Sign in to manage your property journey."
          : "Register to post, save, and enquire about homes."}
      </p>
      {mode === "register" && (
        <label className="field">
          Full name
          <input autoComplete="name" name="displayName" required />
        </label>
      )}
      <div className="social-login">
        {process.env.NEXT_PUBLIC_API_BASE_URL ? (
          <>
            <a className="button button-light" href={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/api/auth/external/google?returnUrl=${encodeURIComponent(returnUrl)}`}>
              Continue with Google
            </a>
            <a className="button button-light" href={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")}/api/auth/external/facebook?returnUrl=${encodeURIComponent(returnUrl)}`}>
              Continue with Facebook
            </a>
          </>
        ) : (
          <p className="notice notice-error" role="status">
            Social login is unavailable because the API URL is not configured.
          </p>
        )}
      </div>
      <p className="muted form-divider">or continue with email</p>
      <label className="field">
        Email address
        <input autoComplete="email" name="email" required type="email" />
      </label>
      <label className="field">
        Password
        <input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "register" ? 10 : undefined}
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="button button-primary"
        disabled={pending || mode === "register"}
        type="submit"
      >
        {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      {mode === "register" && (
        <p className="notice" role="note">
          Registration is disabled until the required CAPTCHA verification is integrated.
        </p>
      )}
      {message && (
        <p aria-live="polite" className={failed ? "notice notice-error" : "notice"}>
          {message}
        </p>
      )}
      {mode === "login" && (
        <p className="form-switch"><Link href="/forgot-password">Forgot your password?</Link></p>
      )}
      <p className="form-switch">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
