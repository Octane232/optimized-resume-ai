import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleSession = async () => {
      try {
        // First, check if we have a hash with recovery info
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get('type');
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (type === 'recovery' && accessToken) {
            // Set the session with the tokens from URL
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (!error) {
              setIsValidSession(true);
              setIsChecking(false);
              return;
            }
          }
        }

        // If no hash or invalid, check if we already have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if this is a recovery session
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            setIsValidSession(true);
          }
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    handleSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "Please make sure both passwords are the same.",
        variant: "destructive" 
      });
      return;
    }
    
    if (password.length < 6) {
      toast({ 
        title: "Password too short", 
        description: "Password must be at least 6 characters long.",
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        console.error('Update error:', error);
        
        if (error.message.includes('session') || error.message.includes('JWT')) {
          toast({ 
            title: "Session Expired", 
            description: "Your reset link has expired. Please request a new one.", 
            variant: "destructive" 
          });
          setIsValidSession(false);
        } else {
          toast({ 
            title: "Reset Failed", 
            description: error.message, 
            variant: "destructive" 
          });
        }
      } else {
        setIsSuccess(true);
        toast({ 
          title: "Password updated!", 
          description: "You can now sign in with your new password." 
        });
        
        // Sign out after password reset (optional, depends on your flow)
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate('/auth');
        }, 3000);
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "An unexpected error occurred.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="glass-morphism border-border/20 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Checking session...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none"></div>

      <header className="relative z-10 p-4 sm:p-6">
        <div className="container mx-auto">
          <Link to="/auth" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity w-fit">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-semibold text-sm sm:text-base">Back to Sign In</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Card className="glass-morphism border-border/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl">Set New Password</CardTitle>
              <CardDescription>
                {isValidSession 
                  ? "Enter your new password below" 
                  : "Please use a valid reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-foreground font-medium">Password updated successfully!</p>
                  <p className="text-muted-foreground text-sm">Redirecting to sign in...</p>
                </div>
              ) : !isValidSession ? (
                <div className="text-center space-y-4 py-4">
                  <p className="text-muted-foreground">
                    Invalid or expired reset link. Please request a new password reset.
                  </p>
                  <Link to="/auth">
                    <Button variant="outline">Back to Sign In</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={!isValidSession}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={!isValidSession}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}

                  {password && password.length < 6 && (
                    <p className="text-sm text-yellow-500">Password must be at least 6 characters</p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full gradient-bg" 
                    disabled={isLoading || password.length < 6 || password !== confirmPassword}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
