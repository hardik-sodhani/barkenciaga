import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSession } from "@/lib/session";
import { getCartSummary } from "@/lib/cart";
import { getActiveDog } from "@/lib/dogs";
import { HeaderStateProvider } from "@/components/session-context";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Barkenciaga - High fashion. For dogs.",
    template: "%s · Barkenciaga",
  },
  description:
    "Couture, accessories, eyewear, and footwear for the discerning dog. Autumn/Woofer '26 now available.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cookie-backed session/active-dog reads are cheap (single cookie decrypt +
  // at most one PK lookup for the active dog), so we keep them at the layout
  // level. The heavier cart query streams via Suspense inside SiteHeader.
  const [session, activeDog, cart] = await Promise.all([
    getSession(),
    getActiveDog(),
    getCartSummary(),
  ]);

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        {process.env.NEXT_PUBLIC_FIGMA_CAPTURE === "1" && (
          <Script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            strategy="afterInteractive"
          />
        )}
        <HeaderStateProvider
          session={session}
          activeDog={activeDog}
          cartCount={cart.itemCount}
        >
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </HeaderStateProvider>
      </body>
    </html>
  );
}
