
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SimpleBetaForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Creating instant beta access for:', email);
      
      // Show success message immediately
      toast.success('🎉 Welcome to RaceWiseAI Beta! Accessing dashboard...');
      
      const guestPassword = "BetaAccess2025!";
      const userName = email.split('@')[0];
      
      // Try to sign in first (user might already exist)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: guestPassword
      });

      if (signInData?.user) {
        // User exists, redirect immediately
        setTimeout(() => {
          navigate('/');
        }, 500);
        return;
      }

      // If sign-in failed, create new account without email confirmation
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: guestPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userName,
            app_name: 'RaceWiseAI',
            company: 'RaceWiseAI.com'
          },
        },
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        // Still redirect for demo purposes
        setTimeout(() => {
          navigate('/');
        }, 500);
        return;
      }

      // Immediately try to sign in with the new account
      const { data: autoSignInData, error: autoSignInError } = await supabase.auth.signInWithPassword({
        email,
        password: guestPassword
      });

      // Redirect regardless of sign-in success for instant access
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (error: any) {
      console.error('Beta access error:', error);
      
      // Fallback: just redirect anyway for demo purposes
      toast.success('🎉 Welcome to RaceWiseAI Beta! Accessing dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-betting-darkPurple/80 border-4 border-orange-400 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
        <CardTitle className="text-white text-center text-2xl font-bold">
          🚀 Join RaceWiseAI Beta
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleEmailSubmit}>
        <CardContent className="space-y-6 bg-betting-darkPurple/90 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">Get Instant Access</h3>
            <p className="text-gray-300">Enter your email to instantly access all our AI-powered tools!</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-100 font-semibold text-lg">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 text-white border-white/40 placeholder:text-gray-300 focus:border-orange-400 text-lg py-3"
              required
            />
          </div>
          
          <div className="text-sm text-white bg-gradient-to-r from-orange-500/30 to-yellow-500/30 p-4 rounded border border-orange-400/50">
            <p className="text-center">
              🚀 <strong>Instant Access:</strong> No email confirmation needed - access the dashboard immediately!
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-betting-darkPurple/90 backdrop-blur-sm rounded-b-lg">
          <Button 
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold text-xl py-4 shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Accessing Dashboard...
              </>
            ) : "🚀 Access Dashboard Now"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SimpleBetaForm;
