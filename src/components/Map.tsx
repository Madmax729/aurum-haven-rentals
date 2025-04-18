
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Map as MapIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PropertyCardProps } from './listings/PropertyCard';

// You'll need to create a Mapbox account and get a token
// For now, using a placeholder token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xrdXFiamZ2MDZhYTNtbGZxZWM0bm5jdyJ9.QdcxSRvBPNQAkIYGqzG7vQ';

const PropertyMap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Fetch properties when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchProperties();
    }
  }, [isOpen]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)');
      
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Initialize map when dialog is open and properties are loaded
  useEffect(() => {
    if (!isOpen || !mapContainer.current || !properties.length) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initializeMap = () => {
      // Find center point based on average lat/long
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      const center = validProperties.length ? 
        [
          validProperties.reduce((sum, p) => sum + Number(p.longitude), 0) / validProperties.length,
          validProperties.reduce((sum, p) => sum + Number(p.latitude), 0) / validProperties.length
        ] : 
        [-74.5, 40]; // Default center (New York area)

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center as [number, number],
        zoom: 9
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add markers for each property
        validProperties.forEach(property => {
          const primaryImage = property.property_images?.find(img => img.is_primary) || 
                              property.property_images?.[0];
          
          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="max-width: 200px;">
              <img src="${primaryImage?.image_url}" alt="${property.title}" style="width: 100%; height: auto; border-radius: 4px;" />
              <h3 style="margin: 8px 0 4px; font-weight: 600;">${property.title}</h3>
              <p style="margin: 0; color: #666;">${property.location}</p>
              <p style="margin: 4px 0 0; font-weight: 500;">$${property.price_per_night}/night</p>
            </div>`
          );

          new mapboxgl.Marker({ color: '#FF385C' })
            .setLngLat([Number(property.longitude), Number(property.latitude)])
            .setPopup(popup)
            .addTo(map.current!);
        });
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, properties]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        size="lg"
      >
        <MapIcon className="mr-2" /> Show Map
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0">
          <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div ref={mapContainer} className="w-full h-full rounded-md" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyMap;
