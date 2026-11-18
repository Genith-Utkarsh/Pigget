import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Pigget — Smart Expense Tracker",
  applicationName: "Pigget",
  description:
    "Track expenses, split bills with friends, and manage your khatabook — all in one beautiful app.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pigget",
  },
  icons: {
    icon: [
      { url: "/pigget-icon.svg", type: "image/svg+xml" },
      { url: "/pigget-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080d18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <div className="ambient-bg" aria-hidden="true" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
