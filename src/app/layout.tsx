import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSession } from "@/lib/session";
import { getCartSummary } from "@/lib/cart";
import { getActiveDog } from "@/lib/dogs";
import { SessionContextProvider } from "@/components/session-context";
import { ThemeScript } from "@/components/theme/theme-script";

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
  const session = await getSession();
  const cart = await getCartSummary();
  const activeDog = await getActiveDog();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        <ThemeScript />
        {process.env.NEXT_PUBLIC_FIGMA_CAPTURE === "1" && (
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        )}
      </head>
      <body>
        <SessionContextProvider value={{ session, activeDog }}>
          <SiteHeader
            session={session}
            cartCount={cart.itemCount}
            activeDog={activeDog}
          />
          <main>{children}</main>
          <SiteFooter />
        </SessionContextProvider>
      </body>
    </html>
  );
}
