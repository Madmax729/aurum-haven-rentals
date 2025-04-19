
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInDays } from 'date-fns';
import { 
  CalendarIcon, 
  MapPin, 
  User, 
  Clock,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import TripQRCode from '@/components/trips/TripQRCode';
import PropertyMapButton from '@/components/PropertyMapButton';
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
  property_images: {
    image_url: string;
    is_primary: boolean;
  }[];
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const Trips = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guest_count,
          total_price,
          status,
          property:properties(
            id, 
            title, 
            location
          ),
          property_images:properties(
            property_images(*)
          )
        `)
        .eq('guest_id', user?.id)
        .order('check_in_date', { ascending: false });
      
      if (error) throw error;
      
      const formattedBookings = data.map(booking => ({
        ...booking,
        property: booking.property,
        property_images: booking.property_images.property_images
      }));
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('guest_id', user?.id);
      
      if (error) throw error;
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const upcomingBookings = bookings.filter(booking => 
    (booking.status === 'confirmed' || booking.status === 'pending') && 
    new Date(booking.check_in_date) >= new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || new Date(booking.check_out_date) < new Date()
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled'
  );

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your trips</h2>
            <p className="text-muted-foreground mb-6">
              You'll need to sign in to view your bookings and trips.
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
        <div className="aurum-container py-8">
          <h1 className="text-3xl font-bold mb-6">Your Trips</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : bookings.length > 0 ? (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({cancelledBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingBookings.map(booking => {
                      const primaryImage = booking.property_images?.find(img => img.is_primary);
                      const firstImage = booking.property_images?.[0];
                      const imageUrl = primaryImage?.image_url || firstImage?.image_url;
                      const nights = differenceInDays(new Date(booking.check_out_date), new Date(booking.check_in_date));
                      
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                              <div className="h-48 md:h-full bg-muted relative">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={booking.property.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <MapPin className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="md:col-span-2 p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-1">{booking.property.title}</h3>
                                    <div className="flex items-center text-muted-foreground mb-2">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{booking.property.location}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                                    {getStatusDisplay(booking.status)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-in</span>
                                    </div>
                                    <p>{format(new Date(booking.check_in_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-out</span>
                                    </div>
                                    <p>{format(new Date(booking.check_out_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Guests</span>
                                    </div>
                                    <p>{booking.guest_count} {booking.guest_count === 1 ? 'guest' : 'guests'}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Duration</span>
                                    </div>
                                    <p>{nights} {nights === 1 ? 'night' : 'nights'}</p>
                                  </div>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                  <div className="mb-4 sm:mb-0">
                                    <span className="text-muted-foreground">Total price</span>
                                    <p className="text-xl font-semibold">${booking.total_price}</p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    {booking.status !== 'cancelled' && (
                                      <Button 
                                        variant="outline" 
                                        onClick={() => cancelBooking(booking.id)}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                    <TripQRCode booking={booking} />
                                    <Button asChild>
                                      <Link to={`/booking/${booking.id}`}>View details</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No upcoming trips</h3>
                    <p className="text-muted-foreground mb-6">
                      Time to start planning your next adventure!
                    </p>
                    <Button onClick={() => navigate('/explore')}>
                      Find a place to stay
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length > 0 ? (
                  <div className="space-y-6">
                    {pastBookings.map(booking => {
                      const primaryImage = booking.property_images?.find(img => img.is_primary);
                      const firstImage = booking.property_images?.[0];
                      const imageUrl = primaryImage?.image_url || firstImage?.image_url;
                      const nights = differenceInDays(new Date(booking.check_out_date), new Date(booking.check_in_date));
                      
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                              <div className="h-48 md:h-full bg-muted relative">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={booking.property.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <MapPin className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="md:col-span-2 p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-1">{booking.property.title}</h3>
                                    <div className="flex items-center text-muted-foreground mb-2">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{booking.property.location}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={getStatusColor('completed')}>
                                    Completed
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-in</span>
                                    </div>
                                    <p>{format(new Date(booking.check_in_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-out</span>
                                    </div>
                                    <p>{format(new Date(booking.check_out_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                  <div>
                                    <span className="text-muted-foreground">Total paid</span>
                                    <p className="text-xl font-semibold">${booking.total_price}</p>
                                  </div>
                                  <div className="flex gap-2 mt-4 sm:mt-0">
                                    <TripQRCode booking={booking} />
                                    <Button asChild>
                                      <Link to={`/booking/${booking.id}`}>View details</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No past trips</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't completed any trips yet.
                    </p>
                    <Button onClick={() => navigate('/explore')}>
                      Find a place to stay
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cancelled">
                {cancelledBookings.length > 0 ? (
                  <div className="space-y-6">
                    {cancelledBookings.map(booking => {
                      const primaryImage = booking.property_images?.find(img => img.is_primary);
                      const firstImage = booking.property_images?.[0];
                      const imageUrl = primaryImage?.image_url || firstImage?.image_url;
                      
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 md:grid-cols-3">
                              <div className="h-48 md:h-full bg-muted relative">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={booking.property.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <MapPin className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="md:col-span-2 p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-semibold mb-1">{booking.property.title}</h3>
                                    <div className="flex items-center text-muted-foreground mb-2">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{booking.property.location}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className={getStatusColor('cancelled')}>
                                    Cancelled
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-in</span>
                                    </div>
                                    <p>{format(new Date(booking.check_in_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="font-medium">Check-out</span>
                                    </div>
                                    <p>{format(new Date(booking.check_out_date), 'EEE, MMM d, yyyy')}</p>
                                  </div>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-muted-foreground">Total (refunded)</span>
                                    <p className="text-xl font-semibold">${booking.total_price}</p>
                                  </div>
                                  <Button variant="outline" onClick={() => navigate('/explore')}>
                                    Book again
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No cancelled trips</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't cancelled any bookings.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't booked any trips yet. Start exploring and find your perfect getaway!
              </p>
              <Button onClick={() => navigate('/explore')}>
                Start exploring
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <PropertyMapButton />
    </div>
  );
};

export default Trips;
