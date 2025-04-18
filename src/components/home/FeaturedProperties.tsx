
import { useState, useEffect } from "react";
import PropertyCard, { PropertyCardProps } from "../listings/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch featured properties and their images
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          location,
          price_per_night,
          category,
          property_images(*)
        `)
        .eq('featured', true)
        .limit(4);
      
      if (error) throw error;
      
      // Transform data to match PropertyCardProps
      const formattedProperties = data.map(property => {
        // Find primary image or default to first image
        const primaryImage = property.property_images.find(img => img.is_primary);
        const firstImage = property.property_images[0];
        const imageUrl = primaryImage?.image_url || firstImage?.image_url;
        
        return {
          id: property.id,
          title: property.title,
          location: property.location,
          price: Number(property.price_per_night),
          rating: 4.85, // Default rating until we implement reviews
          image: imageUrl,
          category: property.category,
          isSuperHost: Math.random() > 0.5, // Random for now
        };
      });
      
      // If we don't have enough featured properties, use mock data to fill in
      if (formattedProperties.length < 4) {
        const mockProperties: PropertyCardProps[] = [
          {
            id: "1",
            title: "Luxury Villa with Ocean View",
            location: "Malibu, California",
            price: 550,
            rating: 4.98,
            image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            isSuperHost: true,
            category: "Villa",
          },
          {
            id: "2",
            title: "Modern Downtown Apartment",
            location: "New York City, New York",
            price: 320,
            rating: 4.85,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            category: "Apartment",
          },
          {
            id: "3",
            title: "Rustic Mountain Cabin",
            location: "Aspen, Colorado",
            price: 275,
            rating: 4.92,
            image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            isSuperHost: true,
            category: "Cabin",
          },
          {
            id: "4",
            title: "Beachfront Bungalow",
            location: "Miami Beach, Florida",
            price: 410,
            rating: 4.89,
            image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            category: "Bungalow",
          },
        ];
        
        // Fill in with mock data if needed
        setProperties([
          ...formattedProperties, 
          ...mockProperties.slice(0, 4 - formattedProperties.length)
        ]);
      } else {
        setProperties(formattedProperties);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      toast({
        title: "Error",
        description: "Failed to load featured properties",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setProperties([
        {
          id: "1",
          title: "Luxury Villa with Ocean View",
          location: "Malibu, California",
          price: 550,
          rating: 4.98,
          image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          isSuperHost: true,
          category: "Villa",
        },
        {
          id: "2",
          title: "Modern Downtown Apartment",
          location: "New York City, New York",
          price: 320,
          rating: 4.85,
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          category: "Apartment",
        },
        {
          id: "3",
          title: "Rustic Mountain Cabin",
          location: "Aspen, Colorado",
          price: 275,
          rating: 4.92,
          image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          isSuperHost: true,
          category: "Cabin",
        },
        {
          id: "4",
          title: "Beachfront Bungalow",
          location: "Miami Beach, Florida",
          price: 410,
          rating: 4.89,
          image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          category: "Bungalow",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted">
      <div className="aurum-container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our hand-picked selection of extraordinary properties from around the world
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border h-[300px] animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
