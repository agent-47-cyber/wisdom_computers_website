import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Wisdom Stock",
  manifest: "/staff.webmanifest",
  robots: { index: false, follow: false },
  icons: { icon: "/icons/staff-192.png", apple: "/icons/staff-apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Wisdom Stock", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#1f1b17" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
