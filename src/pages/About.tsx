import Layout from "@/components/layout/Layout";

const About = () => (
  <Layout>
    <article className="editorial-container py-16 md:py-24">
      {/* Page title */}
      <header className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground mb-4"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          About
        </p>
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.15] text-foreground">
          How Longevity Technology Is Transforming Lives, Homes,&nbsp;and&nbsp;Businesses
        </h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-14 text-base leading-relaxed text-foreground/80">
        {/* The Applied Longevity Platform */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            The Applied Longevity Platform
          </h2>
          <div className="space-y-4">
            <p>Longevity technology is evolving faster than most people realize.</p>
            <p>
              In some areas, modern science is finally validating practices humans have used for
              thousands of years — heat exposure, cold exposure, breath work, light, movement,
              compression, oxygen. What was once tradition is now measurable, trackable, and
              optimizable.
            </p>
            <p>
              In other areas, entirely new frontiers are emerging. Advanced light therapy systems.
              Hyperbaric oxygen chambers. Precision recovery devices. Biofeedback hardware.
              AI-enhanced diagnostics. Science is not just confirming ancient wisdom — it is pushing
              the boundaries of human performance and long-term health.
            </p>
            <p>
              The result is an explosion of hardware designed to extend healthspan, accelerate
              recovery, improve cognition, and optimize physical resilience.
            </p>
            <p className="font-serif text-lg text-foreground italic">But there is a problem.</p>
          </div>
        </section>

        {/* The Gap */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            The Gap Between Innovation and Understanding
          </h2>
          <div className="space-y-4">
            <p>There is no clear, trusted guide to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Which technologies are credible</li>
              <li>Which products are well-designed and safe</li>
              <li>What actually delivers measurable benefit</li>
              <li>What is marketing hype</li>
              <li>How to integrate these tools into daily life</li>
              <li>How to justify them commercially</li>
            </ul>
            <p>
              Consumers are left guessing.
              <br />
              Businesses are left experimenting.
            </p>
            <p>
              The longevity space is filled with devices, claims, and competing voices. What is
              missing is practical clarity.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            What We Do
          </h2>
          <div className="space-y-4">
            <p>We go beyond surface-level reviews.</p>
            <p>We speak directly with:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>The inventors and engineers who design the hardware</li>
              <li>The clinicians and researchers validating the science</li>
              <li>The early adopters using these tools in their homes</li>
              <li>
                The gym owners, wellness studios, clinics, and recovery centers building businesses
                around them
              </li>
            </ul>

            <p className="mt-6">We ask the real questions:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>What problem does this solve?</li>
              <li>Who is it truly for?</li>
              <li>What results can someone realistically expect?</li>
              <li>What are the operating costs?</li>
              <li>What space does it require?</li>
              <li>What is the ROI for a business?</li>
              <li>How does it integrate into an existing service model?</li>
            </ul>

            <p className="mt-6">We explore both sides of the equation:</p>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="border border-border rounded-sm p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">At Home</h3>
                <p className="text-sm">
                  How individuals can build a longevity-focused environment that supports energy,
                  recovery, cognitive clarity, and long-term health.
                </p>
              </div>
              <div className="border border-border rounded-sm p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  In Business
                </h3>
                <p className="text-sm">
                  How operators can add high-value longevity technology into their portfolio — or
                  build entirely new offerings around it — in a way that is commercially viable,
                  differentiated, and sustainable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* From Hardware to Business Model */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            From Hardware to Business Model
          </h2>
          <div className="space-y-4">
            <p className="font-serif text-lg text-foreground italic">
              This is not just about products. It is about systems.
            </p>
            <p>
              A sauna is not just a sauna.
              <br />
              A hyperbaric chamber is not just equipment.
              <br />
              A red light system is not just a device.
            </p>
            <p>Each one sits inside a wider ecosystem:</p>
            <ul className="list-disc pl-6 space-y-1.5 columns-2">
              <li>Client experience</li>
              <li>Pricing strategy</li>
              <li>Membership structure</li>
              <li>Utilization rates</li>
              <li>Operational workflows</li>
              <li>Education and positioning</li>
              <li>Long-term customer retention</li>
            </ul>
            <p>
              We go deep into the business models behind longevity technology so that businesses can
              make informed decisions — not expensive guesses.
            </p>
          </div>
        </section>

        {/* Why This Matters Now */}
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Why This Matters Now
          </h2>
          <div className="space-y-4">
            <p className="font-serif text-lg text-foreground italic">
              The longevity economy is forming.
            </p>
            <p>
              Forward-thinking homeowners are investing in recovery and resilience as seriously as
              previous generations invested in kitchens and home offices.
            </p>
            <p>
              Gyms, clinics, and wellness operators are competing not just on training or treatment,
              but on measurable recovery, performance, and optimization.
            </p>
            <p>
              Those who understand how to select, integrate, and operate longevity technology will
              lead. Those who hesitate risk falling behind.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="border-t border-border pt-14">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Our Mission
          </h2>
          <div className="space-y-4">
            <p className="font-serif text-xl text-foreground">
              To make longevity technology practical.
            </p>
            <ul className="space-y-2">
              <li>To bring clarity to a fast-moving market.</li>
              <li>To help individuals build environments that support long, high-quality lives.</li>
              <li>
                To help businesses integrate and monetize longevity technology intelligently and
                responsibly.
              </li>
            </ul>
            <p className="mt-6 italic text-foreground/60">
              We are not here to chase trends.
              <br />
              We are here to explore what works — and show how it can be applied in the real world.
            </p>
          </div>
        </section>
      </div>
    </article>
  </Layout>
);

export default About;
