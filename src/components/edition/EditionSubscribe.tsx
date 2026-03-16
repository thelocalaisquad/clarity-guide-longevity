const EditionSubscribe = () => (
  <section className="bg-secondary py-14 my-14">
    <div className="editorial-narrow text-center">
      <h2 className="font-serif text-2xl font-semibold text-foreground">Get the Next Edition</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Evidence-based longevity technology insights, delivered to your inbox.
      </p>
      {/* 
        This section is intentionally visual-only. 
        The Mailchimp popup script in index.html handles actual subscriptions.
        The button below triggers the Mailchimp popup if available.
      */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full sm:flex-1 h-11 px-4 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          aria-label="Email address"
        />
        <button
          type="button"
          className="h-11 px-8 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.12em] rounded-sm hover:bg-foreground/90 transition-colors whitespace-nowrap"
        >
          Subscribe
        </button>
      </div>
    </div>
  </section>
);

export default EditionSubscribe;
