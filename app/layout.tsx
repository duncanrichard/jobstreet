import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobStreat — Peluang Kerja Luar Negeri",
  description: "Informasi lowongan kerja luar negeri dan persiapan penempatan bagi pencari kerja Indonesia.",
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
