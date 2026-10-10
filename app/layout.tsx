import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobStreat — Temukan Kariermu",
  description: "Temukan peluang kerja terbaik bersama JobStreat.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
