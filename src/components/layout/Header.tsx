import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import BannerAd from "./BannerAd";

const navItems = [
  { label: "Home Use", href: "/products" },
  { label: "Health and Wellness Businesses", href: "/business" },
  { label: "Designers and Architects", href: "/designers" },
];

const rightNavItems = [
  { label: "About", href: "/about" },
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
        <div className="text-center">
          <Link
            to="/"
            className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            LONGEVITY CHANNEL 1
          </Link>
          <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:text-[0.7rem]"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            How Longevity Technology Is Transforming Homes and Businesses
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Nav row */}
      <div className="editorial-wide flex h-12 items-center justify-between">
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-foreground whitespace-nowrap",
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

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {rightNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-foreground whitespace-nowrap",
                location.pathname === item.href
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
          className="md:hidden text-foreground ml-4"
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
          {[...navItems, ...rightNavItems].map((item) => (
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
