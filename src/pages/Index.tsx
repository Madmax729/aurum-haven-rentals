
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Testimonials from "@/components/home/Testimonials";
import DestinationSpotlight from "@/components/home/DestinationSpotlight";
import CTASection from "@/components/home/CTASection";
import PropertyMap from "@/components/Map";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategoryShowcase />
        <FeaturedProperties />
        <DestinationSpotlight />
        <Testimonials />
        <CTASection />
        <PropertyMap />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
