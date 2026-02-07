import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="editorial-container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="font-serif text-lg font-semibold text-foreground">
              Longevity Channel 1
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An independent resource for understanding longevity technology — 
              for individuals and operators.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/technologies" className="text-sm text-foreground/80 hover:text-primary transition-colors">Technologies</Link>
              <Link to="/products" className="text-sm text-foreground/80 hover:text-primary transition-colors">Products</Link>
              <Link to="/business" className="text-sm text-foreground/80 hover:text-primary transition-colors">Business &amp; Operations</Link>
              <Link to="/videos" className="text-sm text-foreground/80 hover:text-primary transition-colors">Videos</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              About
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Education-first. No medical advice. No product promotion. 
              Just clear, structured information about longevity technologies.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Longevity Channel 1. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
