import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-16 lg:py-20">
    <div className="editorial-container">
      {/* B2B Highlight Strip */}
      <div className="mb-14 rounded-sm border border-background/15 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-semibold text-background">
            Adding longevity tech to your business?
          </h3>
          <p className="mt-1 text-sm text-background/50">
            Equipment selection, compliance, ROI analysis — everything operators need.
          </p>
        </div>
        <Link
          to="/business"
          className="inline-flex items-center gap-2 h-10 px-6 bg-background text-foreground text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors shrink-0"
        >
          Business Solutions <ArrowRight size={12} />
        </Link>
      </div>

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
            <Link to="/products" className="text-sm text-background/60 hover:text-background transition-colors">Products</Link>
            <Link to="/technologies" className="text-sm text-background/60 hover:text-background transition-colors">Technology FAQs</Link>
            <Link to="/reviews" className="text-sm text-background/60 hover:text-background transition-colors">Product Reviews</Link>
            <Link to="/videos" className="text-sm text-background/60 hover:text-background transition-colors">Videos</Link>
            <Link to="/compare" className="text-sm text-background/60 hover:text-background transition-colors">Compare</Link>
          </nav>
        </div>

        {/* For Business */}
        <div>
          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/40 mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            For Business
          </h4>
          <nav className="flex flex-col gap-2.5">
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">Business Solutions</Link>
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">Implementation</Link>
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">Legal & Compliance</Link>
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">Case Studies</Link>
            <Link to="/business" className="text-sm text-background/60 hover:text-background transition-colors">ROI Tools</Link>
          </nav>
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
