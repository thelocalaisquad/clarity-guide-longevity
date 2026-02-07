import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground py-16 lg:py-20">
    <div className="editorial-container">
      <div className="grid gap-10 md:grid-cols-5">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="font-serif text-2xl font-semibold text-background">
            Longevity Channel 1
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/50">
            An independent resource for understanding longevity technology —
            for individuals and operators alike.
          </p>
        </div>

        {/* Technologies */}
        <div>
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/40 mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Technologies
          </h4>
          <nav className="flex flex-col gap-2.5">
            <Link to="/technologies/infrared-sauna" className="text-sm text-background/60 hover:text-background transition-colors">Infrared Sauna</Link>
            <Link to="/technologies/red-light-therapy" className="text-sm text-background/60 hover:text-background transition-colors">Red Light Therapy</Link>
            <Link to="/technologies/cryotherapy" className="text-sm text-background/60 hover:text-background transition-colors">Cryotherapy</Link>
            <Link to="/technologies/hyperbaric-oxygen-therapy" className="text-sm text-background/60 hover:text-background transition-colors">Hyperbaric Oxygen</Link>
            <Link to="/technologies/pemf-therapy" className="text-sm text-background/60 hover:text-background transition-colors">PEMF Therapy</Link>
          </nav>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/40 mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Explore
          </h4>
          <nav className="flex flex-col gap-2.5">
            <Link to="/technologies" className="text-sm text-background/60 hover:text-background transition-colors">All Technologies</Link>
            <Link to="/products" className="text-sm text-background/60 hover:text-background transition-colors">Products</Link>
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">Business &amp; Operations</Link>
            <Link to="/videos" className="text-sm text-background/60 hover:text-background transition-colors">Videos</Link>
          </nav>
        </div>

        {/* About */}
        <div>
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/40 mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            About
          </h4>
          <p className="text-sm leading-relaxed text-background/50">
            Education-first. No medical advice. No product promotion.
            Structured information about longevity technologies.
          </p>
        </div>
      </div>

      <div className="mt-14 pt-6 border-t border-background/10">
        <p className="text-xs text-background/30">
          © {new Date().getFullYear()} Longevity Channel 1. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
