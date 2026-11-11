import Image from "next/image";
import Link from "next/link";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      aria-label="MM Property Ads home"
      className={`brand${footer ? " brand-footer" : ""}`}
      href="/"
    >
      <Image
        alt="MM Property Ads"
        className="brand-logo"
        height={footer ? 58 : 52}
        priority={!footer}
        src="/images/mm-property-ads-logo-horizontal.png"
        width={footer ? 154 : 142}
      />
    </Link>
  );
}
