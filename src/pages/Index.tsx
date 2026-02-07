import Layout from "@/components/layout/Layout";
import HeroIntro from "@/components/home/HeroIntro";
import TickerBar from "@/components/home/TickerBar";
import TechnologyGrid from "@/components/home/TechnologyGrid";
import WhatWeCover from "@/components/home/WhatWeCover";
import NewsletterStrip from "@/components/home/NewsletterStrip";
import AudienceCards from "@/components/home/AudienceCards";
import ApproachSection from "@/components/home/ApproachSection";
import CtaStrip from "@/components/home/CtaStrip";

const Index = () => (
  <Layout>
    <HeroIntro />
    <TickerBar />
    <TechnologyGrid />
    <WhatWeCover />
    <NewsletterStrip />
    <AudienceCards />
    <ApproachSection />
    <CtaStrip />
  </Layout>
);

export default Index;
