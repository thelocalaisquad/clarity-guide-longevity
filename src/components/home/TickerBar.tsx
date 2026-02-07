const headlines = [
  "INFRARED SAUNAS: THE COMPLETE GUIDE",
  "IS CRYOTHERAPY WORTH IT?",
  "RED LIGHT THERAPY EXPLAINED",
  "HYPERBARIC OXYGEN: WHAT THE EVIDENCE SAYS",
  "PEMF THERAPY FOR RECOVERY",
  "COLD PLUNGE VS CRYOTHERAPY",
  "THE SCIENCE OF HEALTHSPAN",
  "LONGEVITY TECH FOR YOUR HOME",
];

const TickerBar = () => (
  <div className="bg-foreground overflow-hidden py-3 border-b border-border">
    <div className="animate-marquee flex whitespace-nowrap">
      {[...headlines, ...headlines].map((h, i) => (
        <span
          key={i}
          className="mx-8 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-background"
          style={{ fontFamily: "'Source Sans 3', sans-serif" }}
        >
          {h}
        </span>
      ))}
    </div>
  </div>
);

export default TickerBar;
