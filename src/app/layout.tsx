// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import ToasterProvider from "@/providers/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Manajemen PKM",
  description: "Aplikasi untuk mengelola proposal PKM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          <ToasterProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
