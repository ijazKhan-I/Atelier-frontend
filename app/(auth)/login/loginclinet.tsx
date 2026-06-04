"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { postData } from "@/app/api/strapi";
import { setAuthSession, type AuthUser } from "@/lib/auth";
import { authToast } from "@/lib/auth-toast";

interface LoginResponse {
  jwt: string;
  user: AuthUser;
}

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const login = await postData<LoginResponse>("/api/auth/local", {
        identifier: email,
        password,
      });

      if (!login?.jwt) {
        throw new Error("Invalid login response");
      }

      // Save session for client checks + middleware cookie.
      setAuthSession(login.jwt, login.user);
      authToast.loginSuccess(login.user.username);

      // Return user to checkout (or any page they tried to open).
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (error) {
      console.error("Login failed:", error);
      authToast.loginError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className=" section-container min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white selection:bg-black selection:text-white">
      {/* Left Pane - Editorial Section */}
      <motion.section
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-black text-white p-8 md:p-16 flex flex-col justify-between overflow-hidden"
      >
        {/* Decorative background element - subtle grain or gradient */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-500 to-transparent pointer-events-none" />

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="space-y-1">
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] font-light uppercase">
              Atelier
            </h1>
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-60 font-medium">
              Defining Modern Elegance
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md"
        >
          <motion.h2
            variants={itemVariants}
            className="font-serif text-5xl md:text-7xl leading-[1.1] font-medium mb-8"
          >
            The curated archive for the discerning eye
            <span className="text-neutral-500">.</span>
          </motion.h2>

          <motion.div variants={itemVariants} className="h-[1px] w-12 bg-neutral-800 mb-8" />

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-neutral-400 font-light leading-relaxed"
          >
            Experience the intersection of heritage craftsmanship and avant-garde vision.
            Access our private collection of timeless pieces and modern artifacts.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] uppercase tracking-widest hidden md:block"
        >
          © 2024 Atelier Archive — All Rights Reserved
        </motion.div>
      </motion.section>

      {/* Right Pane - Login Section */}
      <section className="flex flex-col justify-center items-center p-8 md:p-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-sm space-y-12"
        >
          <header className="space-y-4">
            <h3 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-neutral-900">
              Welcome Back
            </h3>
            <p className="text-neutral-500 text-sm md:text-base font-light">
              Please enter your credentials to access your private collection.
            </p>
          </header>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full py-4 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light placeholder:text-neutral-300"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 hover:text-black transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 pr-10 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-colors shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                className="w-full py-5 bg-white border border-neutral-200 text-neutral-900 text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </motion.button>
            </div>
          </form>

          <footer className="pt-8 text-center md:text-left">
            <p className="text-sm text-neutral-500 font-light">
              Don't have an account?{" "}
              <Link href={"/signUp"}>
                <button className="text-black font-semibold hover:underline decoration-1 underline-offset-4">
                  Join the Circle
                </button>
              </Link>
            </p>
          </footer>
        </motion.div>
      </section>
    </main>
  );
}