import bannerImage from "@/assets/banner-ad.jpg";

const BannerAd = () => (
  <a
    href="#"
    className="block w-full overflow-hidden"
    aria-label="Advertisement"
  >
    <img
      src={bannerImage}
      alt="Advertisement"
      className="w-full h-auto object-cover max-h-[120px] md:max-h-[160px]"
    />
  </a>
);

export default BannerAd;
