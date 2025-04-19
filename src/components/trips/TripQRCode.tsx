
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TripQRCodeProps {
  booking: {
    id: string;
    property: {
      title: string;
      location: string;
    };
    check_in_date: string;
    check_out_date: string;
    guest_count: number;
    total_price: number;
    status: string;
  };
}

const TripQRCode = ({ booking }: TripQRCodeProps) => {
  const [open, setOpen] = useState(false);

  const bookingDetails = {
    id: booking.id,
    property: booking.property.title,
    location: booking.property.location,
    checkIn: format(new Date(booking.check_in_date), 'MMM d, yyyy'),
    checkOut: format(new Date(booking.check_out_date), 'MMM d, yyyy'),
    guests: booking.guest_count,
    totalPrice: booking.total_price,
    status: booking.status
  };

  const qrCodeData = JSON.stringify(bookingDetails);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Show QR Code
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG 
                value={qrCodeData} 
                size={240} 
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Scan this QR code to quickly access your booking details.
              </p>
              <p className="text-sm font-medium mt-2">
                {booking.property.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(booking.check_in_date), 'MMM d')} - {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TripQRCode;
