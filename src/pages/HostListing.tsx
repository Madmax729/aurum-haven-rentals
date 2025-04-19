import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  Home,
  Upload,
  MapPin,
  BedDouble,
  Bath,
  Users,
  DollarSign,
  Camera,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const HostListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Apartment' as 'Apartment' | 'House' | 'Condo' | 'Villa' | 'Cabin' | 'Cottage',
    location: '',
    address: '',
    price_per_night: '',
    bedrooms: '1',
    bathrooms: '1',
    max_guests: '2',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);
    
    // Create temporary URLs for preview
    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...newUrls]);
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
    
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to list your property",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Insert property data
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          address: formData.address,
          price_per_night: parseFloat(formData.price_per_night),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          max_guests: parseInt(formData.max_guests),
          host_id: user.id,
        })
        .select()
        .single();
      
      if (propertyError) throw propertyError;
      
      // Upload images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property_images')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('property_images')
            .getPublicUrl(fileName);
          
          // Insert image reference to database
          const { error: imageInsertError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyData.id,
              image_url: publicUrlData.publicUrl,
              is_primary: i === primaryImageIndex,
            });
          
          if (imageInsertError) throw imageInsertError;
        }
      }
      
      toast({
        title: "Property Listed",
        description: "Your property has been successfully listed!",
      });
      
      navigate(`/property/${propertyData.id}`);
    } catch (error: any) {
      console.error('Error listing property:', error);
      toast({
        title: "Listing Failed",
        description: error.message || "Failed to list your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">List Your Property</h1>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Home className="mr-2 h-5 w-5" /> 
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Cozy Apartment in Downtown"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Property Type</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Cabin">Cabin</SelectItem>
                        <SelectItem value="Cottage">Cottage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> 
                  Location
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">City/Area</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="New York, NY"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St, Apt 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <BedDouble className="mr-2 h-5 w-5" /> 
                  Property Details
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select 
                      value={formData.bedrooms} 
                      onValueChange={(value) => handleSelectChange('bedrooms', value)}
                    >
                      <SelectTrigger id="bedrooms">
                        <SelectValue placeholder="Bedrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Select 
                      value={formData.bathrooms} 
                      onValueChange={(value) => handleSelectChange('bathrooms', value)}
                    >
                      <SelectTrigger id="bathrooms">
                        <SelectValue placeholder="Bathrooms" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_guests">Max Guests</Label>
                    <Select 
                      value={formData.max_guests} 
                      onValueChange={(value) => handleSelectChange('max_guests', value)}
                    >
                      <SelectTrigger id="max_guests">
                        <SelectValue placeholder="Max Guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 16 }).map((_, i) => (
                          <SelectItem key={i} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price_per_night">Price per Night ($)</Label>
                    <Input
                      id="price_per_night"
                      name="price_per_night"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Camera className="mr-2 h-5 w-5" /> 
                  Property Photos
                </h2>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-muted/50"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload photos</p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </Label>
                  </div>
                  
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property preview ${index + 1}`}
                            className={`h-40 w-full object-cover rounded-lg ${
                              index === primaryImageIndex ? 'ring-2 ring-primary' : ''
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <div className="flex space-x-2">
                              {index !== primaryImageIndex && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPrimaryImage(index)}
                                  className="bg-white text-black hover:bg-white/90"
                                >
                                  Set as Primary
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          {index === primaryImageIndex && (
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Listing Property...' : 'List Property'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default HostListing;
