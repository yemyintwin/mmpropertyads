import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Brand />
      <nav aria-label="Main navigation" className="main-nav">
        <Link href="/search?type=ForSale">Buy</Link>
        <Link href="/search?type=ForRent">Rent</Link>
        <Link href="/search">Explore</Link>
      </nav>
      <div className="header-actions">
        <Link className="button button-accent" href="/post-ad">Post an ad</Link>
        <Link className="button button-light" href="/login">Log in</Link>
      </div>
    </header>
  );
}
