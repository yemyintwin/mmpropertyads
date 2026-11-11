import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-server";

export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const result = await getCurrentUser();
  if (!result.ok && result.status === 401) {
    redirect("/login?returnUrl=%2Faccount");
  }

  return (
    <main className="page-shell">
      <header className="page-heading">
        <span className="eyebrow" style={{ color: "var(--teal)" }}>YOUR ACCOUNT</span>
        <h1>{result.ok ? `Hello, ${result.value.displayName}` : "My account"}</h1>
      </header>
      {!result.ok ? (
        <div className="notice notice-error" role="status">{result.message}</div>
      ) : (
        <div className="listing-grid">
          <Link className="notice" href="/account/my-ads"><h2>My ads</h2><p>Manage your property listings.</p></Link>
          <Link className="notice" href="/account/favourites"><h2>Favourites</h2><p>Return to homes you have saved.</p></Link>
          <Link className="notice" href="/account/messages"><h2>Messages</h2><p>Review your enquiries.</p></Link>
          <Link className="notice" href="/account/settings"><h2>Settings</h2><p>Manage your profile and account.</p></Link>
        </div>
      )}
    </main>
  );
}
