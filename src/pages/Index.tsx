
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Testimonials from "@/components/home/Testimonials";
import DestinationSpotlight from "@/components/home/DestinationSpotlight";
import CTASection from "@/components/home/CTASection";
import PropertyMap from "@/components/Map";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="aurum-container flex justify-center my-8">
          <Button size="lg" onClick={() => navigate('/explore')} className="gap-2">
            Explore All Properties <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
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
