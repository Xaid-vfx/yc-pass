import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL = "https://yc.okzaid.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "YC Pass — Share your YC Startup School India seat",
  description:
    "Can't make it to YC Startup School India on April 18th, Bengaluru? Pass your seat to someone who deserves it.",
  openGraph: {
    title: "YC Pass — Share your YC Startup School India seat",
    description:
      "Can't make it to YC Startup School India on April 18th, Bengaluru? Pass your seat to someone who deserves it.",
    url: BASE_URL,
    siteName: "YC Pass",
    images: [
      {
        url: "/og-image.png",
        width: 1512,
        height: 756,
        alt: "YC Startup School India — April 18, Bengaluru",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YC Pass — Share your YC Startup School India seat",
    description:
      "Can't make it to YC Startup School India on April 18th, Bengaluru? Pass your seat to someone who deserves it.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
