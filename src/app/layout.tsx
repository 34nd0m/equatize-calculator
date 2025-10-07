
import "@fontsource/outfit";
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Franchise Capital Value Calculator | Equatize",
  description: "Explore capital unlock vs traditional exit for franchise units."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
