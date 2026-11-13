import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SITE } from "@/lib/site";
import Providers from "@/components/layout/Providers";


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Refurbished laptops, PCs, repairs and computer courses in Pratap Nagar, Jaipur`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Refurbished and new laptops, desktops, custom PCs and accessories. Laptop and PC repair, printing and online forms. RS-CIT, Tally with GST, typing, Excel and AutoCAD classes. Kumbha Marg, Pratap Nagar, Jaipur.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "Wisdom", statusBarStyle: "default" },
  openGraph: {
    title: `${SITE.name}, Pratap Nagar, Jaipur`,
    description: "Refurbished laptops and PCs, repairs, and RS-CIT, Tally and typing classes. Ask price on WhatsApp.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Wisdom Computers, Pratap Nagar, Jaipur" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3eee7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ComputerStore",
  name: SITE.name,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", streetAddress: SITE.street, addressLocality: "Pratap Nagar, Jaipur", addressRegion: "Rajasthan", postalCode: "302033", addressCountry: "IN" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "21:00" }],
  aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.google.rating, reviewCount: SITE.google.reviews },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
