import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-server";
import { PostAdForm } from "@/components/post-ad-form";

export const metadata: Metadata = { title: "Post an ad", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PostAdPage() {
  const user = await getCurrentUser();
  if (!user.ok && user.status === 401) {
    redirect("/login?returnUrl=%2Fpost-ad");
  }

  return (
    <main className="page-shell">
      <header className="page-heading">
        <span className="eyebrow" style={{ color: "var(--teal)" }}>YOUR PROPERTY</span>
        <h1>Post an ad</h1>
      </header>
      {!user.ok ? (
        <div className="notice notice-error" role="status">{user.message}</div>
      ) : (
        <PostAdForm />
      )}
    </main>
  );
}
