
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Luxury vacation rental"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-aurum-navy/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="aurum-container relative z-10 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-shadow mb-4">
            Discover Your <span className="text-aurum-gold">Extraordinary</span> Escape
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
            Exclusive vacation rentals for the discerning traveler. Experience luxury in the world's most beautiful destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link to="/explore" className="flex items-center gap-2">
                Explore Properties
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/host">Become a Host</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
