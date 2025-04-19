
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, Check, Clock, MapPin, Printer, Share2, Download, Home as HomeIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeSVG } from 'qrcode.react';

const BookingSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*),
          property_images:properties(property_images(*)),
          guest:profiles(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Format the data
      setBooking({
        ...data,
        property: data.property,
        property_images: data.property_images?.property_images,
        guest: data.guest
      });
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Create booking data for QR code
  const getQRCodeData = () => {
    if (!booking) return '';
    
    return JSON.stringify({
      bookingId: booking.id,
      property: booking.property.title,
      guest: `${booking.guest.first_name} ${booking.guest.last_name}`,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      guests: booking.guest_count,
      totalPrice: booking.total_price
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  // Find primary image or use first image
  const primaryImage = booking.property_images?.find(img => img.is_primary) || 
                      booking.property_images?.[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center">
            <Check className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-green-800">Booking Confirmed!</h2>
              <p className="text-green-700">Your reservation has been successfully booked.</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Booking Summary</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
                  
                  <div className="flex mb-6">
                    {primaryImage ? (
                      <img 
                        src={primaryImage.image_url} 
                        alt={booking.property.title} 
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-muted rounded-md mr-4 flex items-center justify-center">
                        <HomeIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{booking.property.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm my-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{booking.property.location}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                      <p className="font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(new Date(booking.check_in_date), 'EEE, MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                      <p className="font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {format(new Date(booking.check_out_date), 'EEE, MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Guest</p>
                    <p className="font-medium">
                      {booking.guest.first_name} {booking.guest.last_name}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.guest_count} guest{booking.guest_count !== 1 && 's'}
                    </p>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="font-semibold mb-3">Price Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-semibold">${booking.total_price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Status</span>
                      <span>
                        {booking.status === 'confirmed' ? 'Paid' : (
                          booking.status === 'pending' ? 'Payment Pending' : booking.status
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Booking QR Code</h2>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <QRCodeSVG 
                        value={getQRCodeData()}
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Show this QR code upon arrival for quick check-in
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full mb-3"
                  onClick={() => navigate(`/property/${booking.property.id}`)}
                >
                  View Property
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingSummary;
