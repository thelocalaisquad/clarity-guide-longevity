import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import facilityImage from "@/assets/editorial-facility.jpg";

const steps = [
  { num: "01", label: "What it is & how it works" },
  { num: "02", label: "Current state of evidence" },
  { num: "03", label: "Individual & operator use" },
];

const ApproachSection = () => (
  <section className="bg-card py-20 lg:py-28">
    <div className="editorial-container">
      <div className="grid gap-16 lg:grid-cols-[0.55fr_1fr] items-center">
        <div className="relative hidden lg:block">
          <img
            src={facilityImage}
            alt="Modern wellness facility"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
        </div>
        <div>
          <span className="editorial-label">Our Approach</span>
          <div className="editorial-divider mt-4" />
          <h2 className="mt-6 font-serif text-3xl font-semibold text-foreground md:text-4xl leading-tight">
            How we evaluate technologies
          </h2>
          <p className="editorial-prose mt-6 max-w-lg">
            Every technology page follows the same structured format. We don't rank
            technologies or make health claims — we present factual information so
            you can make informed decisions.
          </p>

          {/* Numbered steps */}
          <div className="mt-10 space-y-5">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-5">
                <span className="text-2xl font-serif font-semibold text-primary/50 leading-none pt-0.5">
                  {s.num}
                </span>
                <span className="text-sm font-medium text-foreground leading-snug">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/technologies"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all technologies <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ApproachSection;
