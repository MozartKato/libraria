import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Libraria - Sistem Manajemen Perpustakaan",
  description: "Sistem manajemen perpustakaan modern untuk mengelola koleksi buku dan peminjaman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="h-full bg-secondary-50 text-secondary-900 antialiased">
        <main className="min-h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
