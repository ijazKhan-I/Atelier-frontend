import Link from "next/link";

const collectionsLinks = [
  { label: "New Arrivals", href: "/" },
  { label: "Womenswear", href: "/" },
  { label: "Menswear", href: "/" },
  { label: "Accessories", href: "/" },
];

const aboutLinks = [
  { label: "Sustainability", href: "/" },
  { label: "Shipping", href: "/" },
  { label: "Returns", href: "/" },
  { label: "Privacy Policy", href: "/" },
];

const connectLinks = [
  { label: "Instagram", href: "/" },
  { label: "Pinterest", href: "/" },
  { label: "Threads", href: "/" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-24 pb-12 border-t border-white/5">
      
      {/* Top Footer */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
        
        {/* Brand */}
        <div className="space-y-8">
          <h3 className="text-xl font-serif tracking-tighter uppercase font-bold">
            Atelier
          </h3>

          <p className="text-sm text-white/40 leading-relaxed max-w-xs">
            Defining modern luxury through meticulous craft and quiet expression.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">
            Collections
          </h4>

          <ul className="space-y-4 text-sm font-medium">
            {collectionsLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">
            About
          </h4>

          <ul className="space-y-4 text-sm font-medium">
            {aboutLinks.map((link, index) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`hover:opacity-60 transition-opacity ${
                    index === 0
                      ? "border-b border-white pb-1"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-8 opacity-40">
            Connect
          </h4>

          <ul className="space-y-4 text-sm font-medium">
            {connectLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 text-[10px] uppercase tracking-widest opacity-40 gap-4">
        
        <p>© 2026 Atelier. All rights reserved.</p>

        <div className="flex space-x-12">
          <span>United States / EN</span>

          <button className="hover:opacity-100 transition-opacity">
            Cookie Settings
          </button>
        </div>
      </div>
    </footer>
  );
}