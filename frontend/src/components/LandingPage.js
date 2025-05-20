import React from 'react';
import HeroSection from './common/HeroSection';
import FeaturedCollections from './common/FeaturedCollections';
import Footer from './common/Footer';
import Categories from './common/Categories';
import LiveMetalRates from './common/LiveMetalRates';
import Newsletter from './common/Newsletter';
import Testimonials from './common/Testimonials';
import Header from './common/Header';
function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-800">
<Header></Header>

      <HeroSection />
      <FeaturedCollections />
      <Categories />
      <Testimonials />
      <Newsletter />
      <LiveMetalRates></LiveMetalRates>
      <Footer />
    </div>
  );
}

export default LandingPage;