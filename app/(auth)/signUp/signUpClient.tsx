"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { postData } from "@/app/api/strapi";
import { setAuthSession, type AuthUser } from "@/lib/auth";
import { authToast } from "@/lib/auth-toast";

interface RegisterResponse {
  jwt: string;
  user: AuthUser;
}

export default function SignUpClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      authToast.passwordMismatch();
      return;
    }

    try {
      setLoading(true);

      const data = await postData<RegisterResponse>("/api/auth/local/register", {
        username: formData.username.trim(),
        email: formData.email,
        password: formData.password,
      });

      if (!data?.jwt) {
        throw new Error("Invalid register response");
      }

      // Strapi returns a JWT on signup — log the user in right away.
      setAuthSession(data.jwt, data.user);
      authToast.signupSuccess();

      router.push("/");
    } catch (error) {
      console.error("Register failed:", error);
      authToast.signupError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className=" section-container min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white selection:bg-black selection:text-white">
      {/* Left Pane - Editorial Identity */}
      <motion.section
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-brand-black text-white p-8 md:p-16 flex flex-col justify-between overflow-hidden"
      >
        {/* Abstract Architectural Background */}
        <div className="absolute inset-0 grayscale mix-blend-overlay opacity-30">
          <img
            src="https://images.unsplash.com/photo-1518005020481-4b881750b99a?q=80&w=2070&auto=format&fit=crop"
            alt="Interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.button
            // onClick={onBackToHome}
            variants={itemVariants}
            className="space-y-1 text-left"
          >
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] font-light uppercase">
              Atelier
            </h1>
            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-60 font-medium">
              Maison de Couture
            </p>
          </motion.button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md relative z-10"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-white/40 mb-4 block">
              Membership
            </span>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.1] font-medium mb-8">
              Join the inner circle
              <span className="text-neutral-500">.</span>
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-lg text-neutral-300 font-light leading-relaxed mb-8"
          >
            Members receive priority access to seasonal lookbooks, exclusive artisan collaborations, and private styling services.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/50"
          >
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white rounded-full" /> Early Access
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white rounded-full" /> Private Sales
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1 h-1 bg-white rounded-full" /> Artisan Stories
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-[10px] uppercase tracking-widest hidden md:block relative z-10"
        >
          Established 2026 — Paris / London / New York
        </motion.div>
      </motion.section>

      {/* Right Pane - Registration Section */}
      <section className="flex flex-col justify-center items-center p-8 md:p-16 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-sm space-y-10"
        >
          <header className="space-y-4">
            <h3 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-neutral-900">
              Create Account
            </h3>
            <p className="text-neutral-500 text-sm md:text-base font-light">
              Become part of a dialogue between heritage and modernity.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Username
              </label>
              <input
                type="text"
                placeholder="Jean Atelier"
                value={formData.username}
                onChange={handleChange("username")}
                className="w-full py-3 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light placeholder:text-neutral-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                className="w-full py-3 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light placeholder:text-neutral-300"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Create Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  className="w-full py-3 pr-10 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                className="w-full py-3 bg-transparent border-b border-neutral-200 focus:border-black transition-colors outline-none font-light placeholder:text-neutral-300"
                required
              />
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 accent-black border-neutral-200"
                required
              />
              <label
                htmlFor="terms"
                className="text-[11px] text-neutral-500 font-light leading-relaxed"
              >
                I agree to the{" "}
                <button className="text-black font-semibold underline underline-offset-4">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-black font-semibold underline underline-offset-4">
                  Privacy Policy
                </button>
                .
              </label>
            </div>

            <div className="space-y-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-5 bg-brand-black text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </form>

          <footer className="pt-4 text-center md:text-left">
            <p className="text-sm text-neutral-500 font-light">
              Already have an account?{" "}
              <Link href={"/login"}>
                <button
                  // onClick={onSwitchToLogin}
                  className="text-black font-semibold hover:underline decoration-1 underline-offset-4"
                >
                  Sign In
                </button>
              </Link>
            </p>
          </footer>
        </motion.div>
      </section>
    </main>
  );
}