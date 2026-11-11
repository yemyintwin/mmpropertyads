import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { ListingResults } from "@/components/listing-results";

export const revalidate = 300;
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: "MM Property Ads", description: "Find a home or advertise a property." },
};

export default async function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const structuredData = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MM Property Ads",
      url: siteUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MM Property Ads",
      url: siteUrl,
    },
  ]).replace(/</g, "\\u003c");

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: structuredData }}
        type="application/ld+json"
      />
      <section className="hero">
        <Image
          alt=""
          className="hero-bg"
          fill
          priority
          sizes="100vw"
          src="/images/home-banner.jpg"
        />
        <div aria-hidden="true" className="hero-overlay" />
        <div className="hero-inner">
          <span className="eyebrow">Property, made personal</span>
          <h1>Find a place that<br /><em>feels like you.</em></h1>
          <p>Thoughtfully selected homes for every way of living, all in one place.</p>
          <div className="search-panel home-search-panel">
            <nav aria-label="Search by listing type" className="home-search-tabs">
              <a className="active" href="#home-search">Buy</a>
              <a href="/search?type=ForRent">Rent</a>
            </nav>
            <form action="/search" className="search-form home-search-form" id="home-search">
              <label className="field">
                <span className="field-label">Location</span>
                <input autoComplete="address-level2" name="area" placeholder="Area or neighbourhood" />
              </label>
              <label className="field">
                <span className="field-label">Listing type</span>
                <select defaultValue="ForSale" name="type">
                  <option value="ForSale">For sale</option>
                  <option value="ForRent">For rent</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Property type</span>
                <select defaultValue="" name="propertyType">
                  <option value="">All homes</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Bedrooms</span>
                <select defaultValue="" name="beds">
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </label>
              <button aria-label="Search homes" className="button button-primary home-search-submit" type="submit">Search homes</button>
            </form>
          </div>
          <p className="popular-searches"><span>Popular:</span> <Link href="/search?area=Bahan">Bahan</Link> <Link href="/search?area=Sanchaung">Sanchaung</Link> <Link href="/search?area=Kamayut">Kamayut</Link></p>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow" style={{ color: "var(--teal)" }}>CURATED FOR YOU</span>
            <h2>Homes worth discovering</h2>
            <p className="muted">Browse available listings selected for quality and location.</p>
          </div>
          <Link className="button button-light" href="/search">View all homes</Link>
        </div>
        <ListingResults params={new URLSearchParams({ pageSize: "3" })} />
      </section>
    </main>
  );
}
