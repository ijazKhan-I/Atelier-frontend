

// app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import AppToaster from "@/components/ui/AppToaster";

export const metadata: Metadata = {
  title: "Atelier",
  description: "Modern luxury fashion and timeless essentials.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-offwhite text-brand-black font-sans flex flex-col">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}