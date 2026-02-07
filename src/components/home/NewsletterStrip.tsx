import { useState } from "react";

const NewsletterStrip = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-foreground py-16 lg:py-20">
      <div className="editorial-container text-center max-w-xl mx-auto">
        <h2 className="font-serif text-2xl font-semibold text-background md:text-3xl">
          Want exclusive content?
        </h2>
        <p className="mt-3 text-sm text-background/60 leading-relaxed">
          Get the latest longevity technology guides, product breakdowns, and
          operator insights delivered to your inbox.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 px-4 bg-background/10 border border-background/20 text-background placeholder:text-background/40 text-sm rounded-sm focus:outline-none focus:border-background/50 sm:w-72"
          />
          <button
            type="submit"
            className="h-12 px-8 bg-background text-foreground text-sm font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-background/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterStrip;
