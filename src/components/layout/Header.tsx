import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BannerAd from "./BannerAd";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Technologies", href: "/technologies" },
  { label: "Products", href: "/products" },
  { label: "Business & Operations", href: "/business" },
  { label: "Videos", href: "/videos" },
];

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background">
      {/* Banner ad */}
      <BannerAd />

      {/* Wordmark */}
      <div className="editorial-container flex items-center justify-center py-5 md:py-6">
        <Link
          to="/"
          className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
        >
          LONGEVITY CHANNEL 1
        </Link>
      </div>

      <div className="h-px bg-border" />

      {/* Nav row */}
      <div className="editorial-container flex h-12 items-center justify-between md:justify-center">
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors hover:text-foreground",
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href))
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="h-px bg-border" />

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-b border-border bg-background px-6 py-6 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-colors",
                location.pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
