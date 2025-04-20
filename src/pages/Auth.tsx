
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import type { LoginFormData, SignupFormData } from "@/schemas/auth";

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: SignupFormData) => {
    setLoading(true);
    try {
      let avatarUrl = null;
      if (values.avatar?.[0]) {
        const file = values.avatar[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }
        
        avatarUrl = `${fileName}`;
        console.log("Avatar uploaded:", avatarUrl);
      }

      await signUp(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role,
        avatar_url: avatarUrl,
      });
      
      toast.success("Account created! Please check your email to confirm your registration.");
      setActiveTab("login");
      
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to VacationStay</CardTitle>
          <CardDescription>Login or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSubmit={handleLogin} loading={loading} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm onSubmit={handleSignup} loading={loading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
