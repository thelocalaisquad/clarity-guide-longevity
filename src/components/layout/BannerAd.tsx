

const BannerAd = () => (
  <div className="w-full bg-foreground text-background">
    <div className="editorial-wide flex flex-col items-center gap-3 py-3 md:flex-row md:justify-between md:py-2.5">
      <p className="font-serif text-sm md:text-base font-medium text-center md:text-left leading-snug">
        How The Best Gyms Are Quietly Becoming Longevity Hubs{" "}
        <span className="italic">(and adding $10-50k a month)</span>
      </p>
      <a
        href="https://info.longevitychannel1.com"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-sm bg-background text-foreground px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-background/90"
      >
        Free Training
      </a>
    </div>
  </div>
);

export default BannerAd;
