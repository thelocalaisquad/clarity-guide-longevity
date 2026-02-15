import straplineBg from "@/assets/strapline-bg.jpg";

const BannerAd = () => (
  <a
    href="https://info.longevitychannel1.com"
    target="_blank"
    rel="noopener noreferrer"
    className="relative block w-full overflow-hidden"
    aria-label="Free gym longevity training"
  >
    <img
      src={straplineBg}
      alt=""
      className="w-full h-[130px] md:h-[170px] object-cover object-center"
    />
    {/* Text overlay */}
    <div className="absolute inset-0 flex items-center">
      <div className="editorial-wide flex w-full items-center justify-between gap-4">
        <p className="font-serif text-base md:text-xl lg:text-2xl font-semibold text-white leading-tight max-w-[60%]">
          How The Best Gyms Are Quietly Becoming Longevity Hubs{" "}
          <span className="italic font-normal">(and adding $10-50k a month)</span>
        </p>
        <span className="shrink-0 rounded-sm bg-amber-500 text-black px-4 py-1.5 text-[0.6rem] md:text-[0.65rem] font-bold uppercase tracking-[0.16em] hover:bg-amber-400 transition-colors">
          Free Training
        </span>
      </div>
    </div>
  </a>
);

export default BannerAd;
