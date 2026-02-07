import Layout from "@/components/layout/Layout";
import HeroIntro from "@/components/home/HeroIntro";
import WhatWeCover from "@/components/home/WhatWeCover";
import AudienceCards from "@/components/home/AudienceCards";
import TechnologyGrid from "@/components/home/TechnologyGrid";
import ApproachSection from "@/components/home/ApproachSection";
import CtaStrip from "@/components/home/CtaStrip";

const Index = () => (
  <Layout>
    <HeroIntro />
    <WhatWeCover />
    <AudienceCards />
    <TechnologyGrid />
    <ApproachSection />
    <CtaStrip />
  </Layout>
);

export default Index;
