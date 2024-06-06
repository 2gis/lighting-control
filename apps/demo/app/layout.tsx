import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MapGL JS Shadows",
  description: "Shadows&Lighting inspector based on MapGL JS API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script src="https://unpkg.com/browser-geo-tz@latest/dist/geotz.js"></script>
        {children}
      </body>
    </html>
  );
}
