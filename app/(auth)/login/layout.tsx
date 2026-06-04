// app/(auth)/layout.tsx
// Create this file to remove Footer and Header for all auth pages if needed.

import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
export default function AuthGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>
  <Header />
  {children}</>;
}