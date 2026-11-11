import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "MM Property Ads",
    template: "%s | MM Property Ads",
  },
  description: "Find a home or advertise a property with MM Property Ads.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <Brand footer />
          <span>Thoughtful homes, all in one place.</span>
          <nav aria-label="Footer navigation">
            <Link href="/search">Search homes</Link>
            <Link href="/login">Log in</Link>
            <Link href="/register">Register</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
