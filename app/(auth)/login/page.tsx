import { Suspense } from "react";
import LoginPageClient from "./loginclinet";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageClient />
    </Suspense>
  );
}
