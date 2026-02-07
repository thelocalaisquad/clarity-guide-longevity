import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card py-20">
      <div className="editorial-container">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="font-serif text-2xl font-semibold text-foreground">
              Longevity Channel 1
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An independent resource for understanding longevity technology — 
              for individuals exploring personal use and operators building wellness businesses.
            </p>
          </div>
          <div>
            <h4 className="editorial-label">Explore</h4>
            <nav className="mt-5 flex flex-col gap-3">
              <Link to="/technologies" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Technologies</Link>
              <Link to="/products" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Products</Link>
              <Link to="/business" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Business &amp; Operations</Link>
              <Link to="/videos" className="text-sm text-foreground/70 hover:text-foreground transition-colors">Videos</Link>
            </nav>
          </div>
          <div>
            <h4 className="editorial-label">About</h4>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Education-first. No medical advice. No product promotion. 
              Structured information about longevity technologies.
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Longevity Channel 1. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
