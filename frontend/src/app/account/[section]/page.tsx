import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { isSearchResponse } from "@/lib/api";
import { getCurrentUser, requestAsUser } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AccountSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const user = await getCurrentUser();
  if (!user.ok && user.status === 401) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/account/${section}`)}`);
  }
  if (!user.ok) {
    return (
      <main className="page-shell">
        <div className="notice notice-error" role="status">{user.message}</div>
      </main>
    );
  }

  if (section === "settings") {
    return (
      <main className="page-shell">
        <header className="page-heading"><h1>Account settings</h1></header>
        <div className="notice">
          <p><strong>Name:</strong> {user.value.displayName}</p>
          <p><strong>Email:</strong> {user.value.email}</p>
          <p className="muted">Profile editing requires the account update API contract.</p>
        </div>
      </main>
    );
  }

  let title: string;
  let endpoint: string;
  switch (section) {
    case "my-ads":
      title = "My ads";
      endpoint = "/api/my/listings";
      break;
    case "favourites":
      title = "Favourites";
      endpoint = "/api/my/favourites";
      break;
    case "messages":
      title = "Messages";
      endpoint = "/api/my/enquiries?box=inbox";
      break;
    default:
      notFound();
  }

  const result = await requestAsUser(endpoint);
  if (!result.ok) {
    return (
      <main className="page-shell">
        <header className="page-heading"><h1>{title}</h1></header>
        <div className="notice notice-error" role="status">
          <p>{result.message}</p>
          <Link href="/account">Return to account</Link>
        </div>
      </main>
    );
  }

  if (section === "messages") {
    return (
      <main className="page-shell">
        <header className="page-heading"><h1>{title}</h1></header>
        <div className="notice" role="status">
          Messages were returned, but their API response schema is not documented yet.
        </div>
      </main>
    );
  }

  if (!isSearchResponse(result.value)) {
    return (
      <main className="page-shell">
        <header className="page-heading"><h1>{title}</h1></header>
        <div className="notice" role="status">
          The service response cannot be displayed until its response schema is agreed.
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-heading"><h1>{title}</h1></header>
      {result.value.items.length === 0 ? (
        <div className="notice">
          <p>No items are available yet.</p>
          <Link href={section === "my-ads" ? "/post-ad" : "/search"}>
            {section === "my-ads" ? "Post an ad" : "Find a home"}
          </Link>
        </div>
      ) : (
        <div className="listing-grid">
          {result.value.items.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
