
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import PropertyCard from '@/components/listings/PropertyCard';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PropertyCardProps } from '@/components/listings/PropertyCard';
import { Button } from '@/components/ui/button';

const Wishlist = () => {
  const [favorites, setFavorites] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          property_id,
          properties(
            id,
            title,
            location,
            price_per_night,
            category,
            property_images(*)
          )
        `)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Transform data to match PropertyCardProps
      const formattedProperties = data.map(favorite => {
        const property = favorite.properties;
        // Find primary image or default to first image
        const primaryImage = property.property_images.find(img => img.is_primary);
        const firstImage = property.property_images[0];
        const imageUrl = primaryImage?.image_url || firstImage?.image_url;
        
        return {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price_per_night,
          rating: 4.85, // Default rating until we implement reviews
          image: imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          category: property.category,
          isSuperHost: Math.random() > 0.5, // Random for now
        };
      });
      
      setFavorites(formattedProperties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
      
      // Fallback to empty array
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('property_id', propertyId);
      
      if (error) throw error;
      
      // Update local state
      setFavorites(favorites.filter(fav => fav.id !== propertyId));
      
      toast({
        title: "Success",
        description: "Property removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove property from favorites",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your Wishlist</h2>
            <p className="text-muted-foreground mb-6">
              You'll need to sign in to create and view your saved properties.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Sign in
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-8 bg-background">
          <div className="aurum-container">
            <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Save your favorite properties by clicking the heart icon on any property.
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Explore Properties
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
