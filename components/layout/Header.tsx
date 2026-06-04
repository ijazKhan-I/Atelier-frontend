"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCartCount } from "../shop/cartStorage";
import { clearAuthSession, getAuthUser, isLoggedIn } from "@/lib/auth";
import { authToast } from "@/lib/auth-toast";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isNavLinkActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const syncCartCount = () => setCartCount(getCartCount());
    const syncAuth = () => {
      setLoggedIn(isLoggedIn());
      setUsername(getAuthUser()?.username ?? "");
    };

    syncCartCount();
    syncAuth();

    window.addEventListener("storage", syncCartCount);
    window.addEventListener("cart-change", syncCartCount);
    window.addEventListener("auth-change", syncAuth);

    return () => {
      window.removeEventListener("storage", syncCartCount);
      window.removeEventListener("cart-change", syncCartCount);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setLoggedIn(false);
    setUsername("");
    authToast.logoutSuccess();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header>
      <nav className="fixed top-0 w-full z-50 bg-brand-offwhite/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center space-x-12">

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-serif tracking-tighter uppercase font-bold"
            >
              Atelier
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(link.href, pathname);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`nav-link ${
                      isActive ? "!opacity-100 border-b border-black pb-1" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">

            <button
              type="button"
              className="p-2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 p-2 opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Logout"
                title={username ? `Logout (${username})` : "Logout"}
              >
                <LogOut size={18} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
                  Logout
                </span>
              </button>
            ) : (
              <Link href="/login">
                <button
                  type="button"
                  className="hidden sm:flex p-2 opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Login"
                >
                  <User size={18} />
                </button>
              </Link>
            )}

            <Link href="/cart" className="relative p-2 opacity-70 hover:opacity-100 transition-opacity">
              <ShoppingBag size={18} />

              <span className="absolute top-1 right-1 min-w-3 h-3 px-1 bg-brand-black text-white text-[7px] flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen
              ? "max-h-96 border-t border-black/5"
              : "max-h-0"
            }`}
        >
          <div className="bg-brand-offwhite/95 backdrop-blur-md px-6 py-6 flex flex-col space-y-6">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link.href, pathname);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-wide transition-opacity duration-300 w-fit ${
                    isActive
                      ? "opacity-100 border-b border-black pb-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity w-fit"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity w-fit"
              >
                <User size={16} />
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
