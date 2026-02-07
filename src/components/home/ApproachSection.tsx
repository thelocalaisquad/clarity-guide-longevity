import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import facilityImage from "@/assets/editorial-facility.jpg";

const steps = [
  { num: "01", title: "What it is", desc: "Clear definition and mechanism of action." },
  { num: "02", title: "The evidence", desc: "What the research actually says — and doesn't." },
  { num: "03", title: "Practical use", desc: "Individual and commercial considerations." },
];

const ApproachSection = () => (
  <section className="py-16 lg:py-24 border-b border-border">
    <div className="editorial-container">
      <div className="grid gap-12 lg:grid-cols-[0.5fr_1fr] items-start">
        <div className="hidden lg:block">
          <img
            src={facilityImage}
            alt="Wellness facility"
            className="w-full aspect-[3/4] object-cover rounded-sm"
          />
        </div>

        <div>
          <span className="editorial-label text-primary">Our Approach</span>
          <h2 className="mt-3 font-serif text-2xl font-semibold text-foreground md:text-3xl leading-tight">
            HOW <em className="font-normal">we evaluate</em>
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground max-w-lg">
            Every technology page follows the same structured format. We don't
            rank technologies or make health claims — we present factual
            information so you can make informed decisions.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.num}
                className="rounded-sm border border-border bg-card p-6"
              >
                <span className="text-3xl font-serif font-semibold text-primary/30 leading-none">
                  {s.num}
                </span>
                <h4 className="mt-3 font-serif text-base font-semibold text-foreground">
                  {s.title}
                </h4>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/technologies"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all technologies <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ApproachSection;
