import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Home, 
  BedDouble, 
  Bath, 
  Star, 
  CalendarIcon,
  MapPin,
  ChevronLeft 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState('1');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (property && dateRange.from && dateRange.to) {
      const nights = differenceInDays(dateRange.to, dateRange.from);
      setTotalPrice(property.price_per_night * nights);
    } else {
      setTotalPrice(0);
    }
  }, [dateRange, property]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(*),
          host:profiles(*)
        `)
        .eq('id', id)
        .single();
      
      if (propertyError) throw propertyError;
      
      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          guest:profiles(first_name, last_name, avatar_url)
        `)
        .eq('property_id', id);
        
      if (reviewsError) throw reviewsError;
      
      setProperty({
        ...propertyData,
        reviews: reviewsData || [],
        averageRating: reviewsData?.length 
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length 
          : 0
      });
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to book this property",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Date Selection Required",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          property_id: id,
          guest_id: user.id,
          check_in_date: dateRange.from.toISOString(),
          check_out_date: dateRange.to.toISOString(),
          guest_count: parseInt(guests),
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Redirect to booking summary page
      navigate(`/booking/${data.id}`);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  // Find primary image or use first image
  const primaryImage = property.property_images?.find(img => img.is_primary) || 
                      property.property_images?.[0];
  
  // Other images excluding primary
  const otherImages = property.property_images?.filter(img => 
    img.id !== (primaryImage?.id)).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        
        <div className="flex items-center mb-6">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="font-medium mr-2">
            {property.averageRating.toFixed(2)}
          </span>
          <span className="text-muted-foreground mr-2">
            ({property.reviews.length} reviews)
          </span>
          <span className="mx-2">•</span>
          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{property.location}</span>
        </div>
        
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden h-[400px]">
          {primaryImage && (
            <div className="md:col-span-1 h-full">
              <img 
                src={primaryImage.image_url} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="hidden md:grid grid-cols-2 gap-2 h-full">
            {otherImages?.map((image) => (
              <div key={image.id} className="h-full">
                <img 
                  src={image.image_url} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Hosted by {property.host?.first_name} {property.host?.last_name}
                </h2>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{property.max_guests} guests</span>
                  <span className="mx-2">•</span>
                  <BedDouble className="h-4 w-4 mr-2" />
                  <span>{property.bedrooms} bedrooms</span>
                  <span className="mx-2">•</span>
                  <Bath className="h-4 w-4 mr-2" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
              </div>
              {property.host?.avatar_url && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={property.host.avatar_url} 
                    alt={`${property.host.first_name} ${property.host.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="border-t border-border pt-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
            </div>
            
            {/* Reviews */}
            <div className="border-t border-border pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                {property.averageRating.toFixed(2)} · {property.reviews.length} reviews
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      {review.guest?.avatar_url ? (
                        <img 
                          src={review.guest.avatar_url} 
                          alt={`${review.guest.first_name}`}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                          <span className="text-muted-foreground">
                            {review.guest?.first_name?.[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">
                          {review.guest?.first_name} {review.guest?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(review.created_at), 'MMMM yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              {property.reviews.length > 4 && (
                <Button variant="outline" className="mt-4">
                  Show all {property.reviews.length} reviews
                </Button>
              )}
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-2xl font-bold">${property.price_per_night}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{property.averageRating.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg mb-4">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-3">
                      <p className="text-sm font-medium">CHECK-IN</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto font-normal text-left"
                          >
                            {dateRange.from ? (
                              format(dateRange.from, 'PPP')
                            ) : (
                              <span className="text-muted-foreground">Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => 
                              setDateRange(prev => ({ 
                                from: date, 
                                to: date ? addDays(date, 1) : undefined
                              }))
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={`p-3 pointer-events-auto`}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium">CHECKOUT</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto font-normal text-left"
                          >
                            {dateRange.to ? (
                              format(dateRange.to, 'PPP')
                            ) : (
                              <span className="text-muted-foreground">Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => 
                              setDateRange(prev => ({ 
                                ...prev, 
                                to: date 
                              }))
                            }
                            disabled={(date) => (
                              date < (dateRange.from ? addDays(dateRange.from, 1) : new Date())
                            )}
                            initialFocus
                            className={`p-3 pointer-events-auto`}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="border-t border-border p-3">
                    <p className="text-sm font-medium mb-2">GUESTS</p>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: property.max_guests }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} guest{i !== 0 && 's'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!dateRange.from || !dateRange.to || isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Reserve'}
                </Button>
                
                {totalPrice > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="underline">
                        ${property.price_per_night} x {differenceInDays(dateRange.to!, dateRange.from!)} nights
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;
