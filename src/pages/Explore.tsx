import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PropertyCard from '@/components/listings/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin } from 'lucide-react';
import { PropertyCardProps } from '@/components/listings/PropertyCard';
import PropertyMapButton from '@/components/PropertyMapButton';

const Explore = () => {
  const [properties, setProperties] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          location,
          price_per_night,
          category,
          property_images(*)
        `);
      
      if (error) throw error;
      
      const formattedProperties = data.map(property => {
        const primaryImage = property.property_images.find(img => img.is_primary);
        const firstImage = property.property_images[0];
        const imageUrl = primaryImage?.image_url || firstImage?.image_url;
        
        return {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price_per_night,
          rating: 4.85,
          image: imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          category: property.category,
          isSuperHost: Math.random() > 0.5,
        };
      });
      
      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
      
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-8 bg-background">
          <div className="aurum-container">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Explore Properties</h1>
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search by location, title, or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              </div>
              <Button variant="outline" className="ml-2">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden border border-border h-[300px] animate-pulse">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 
                    "We couldn't find any properties matching your search. Try different keywords or explore all properties." :
                    "There are no properties available at the moment. Please check back later."}
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <PropertyMapButton />
    </div>
  );
};

export default Explore;
