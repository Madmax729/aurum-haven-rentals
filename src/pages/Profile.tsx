import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Label } from '@/components/ui/label';
import { Camera, Loader2, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Profile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    bio: '',
    phone: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        phone: data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    try {
      setUploadingAvatar(true);
      
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingAvatar(false);
      setAvatarFile(null);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      
      // Upload avatar if a new one is selected
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) avatarUrl = newAvatarUrl;
      }
      
      const updates = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar_url: avatarUrl,
        bio: formData.bio,
        phone: formData.phone,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Refresh profile data
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
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
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-6">
              You'll need to sign in to view and edit your profile.
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="aurum-container py-10">
          <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-2 border-muted">
                        {formData.avatar_url ? (
                          <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : formData.avatar_url} alt={formData.first_name} />
                        ) : (
                          <AvatarFallback className="text-xl">
                            {formData.first_name?.[0]}{formData.last_name?.[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Label htmlFor="avatar" className="absolute -right-2 -bottom-2 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4" />
                        <Input 
                          id="avatar" 
                          type="file" 
                          accept="image/*" 
                          className="sr-only" 
                          onChange={handleAvatarChange}
                        />
                      </Label>
                    </div>
                    <div className="space-y-6 flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name" 
                            name="first_name" 
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="Your first name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name" 
                            name="last_name" 
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Your last name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us a bit about yourself"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" onClick={fetchUserProfile} disabled={updating}>
                    Cancel
                  </Button>
                  <Button onClick={updateProfile} disabled={updating}>
                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base">Email</Label>
                      <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-base">Account Type</Label>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">{profile.role || 'Guest'}</p>
                    </div>
                    <div>
                      <Label className="text-base">Member Since</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                  <Button variant="destructive" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
