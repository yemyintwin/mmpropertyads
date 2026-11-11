"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { submitJson } from "@/lib/api";

export function ListingActions({
  listingId,
  slug,
}: {
  listingId: string;
  slug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  async function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setFailed(false);
    const form = event.currentTarget;
    const fields = new FormData(form);
    const result = await submitJson(
      `/api/listings/${encodeURIComponent(listingId)}/enquiries`,
      {
        message: fields.get("message"),
        phone: fields.get("phone") || undefined,
      },
    );
    setPending(false);

    if (!result.ok && result.status === 401) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(`/listings/${slug}`)}`,
      );
      return;
    }
    if (!result.ok) {
      setFailed(true);
      setMessage(result.message);
      return;
    }

    form.reset();
    setMessage("Your enquiry was sent.");
  }

  return (
    <section className="contact-panel">
      <h2>Interested in this property?</h2>
      <p className="muted">Sign in to contact the advertiser or save this listing.</p>
      {!open ? (
        <button
          className="button button-primary"
          onClick={() => setOpen(true)}
          type="button"
        >
          Contact advertiser
        </button>
      ) : (
        <form className="enquiry-form" onSubmit={sendEnquiry}>
          <label className="field">
            Message
            <textarea maxLength={1000} minLength={10} name="message" required />
          </label>
          <label className="field">
            Phone (optional)
            <input autoComplete="tel" name="phone" type="tel" />
          </label>
          <button className="button button-primary" disabled={pending} type="submit">
            {pending ? "Sending…" : "Send enquiry"}
          </button>
          {message && (
            <p aria-live="polite" className={failed ? "notice notice-error" : "notice"}>
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
