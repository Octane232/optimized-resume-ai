import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ===== Helper Functions =====
const extractRecoveryTokens = (hash: string): { accessToken: string | null; refreshToken: string | null } => {
  if (!hash) return { accessToken: null, refreshToken: null };
  
  const hashParams = new URLSearchParams(hash.substring(1));
  const type = hashParams.get('type');
  const accessToken = hashParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token');
  
  if (type === 'recovery' && accessToken) {
    return { accessToken, refreshToken: refreshToken || '' };
  }
  
  return { accessToken: null, refreshToken: null };
};

const validatePassword = (password: string, confirmPassword: string): { isValid: boolean; error: string | null } => {
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords don't match" };
  }
  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }
  return { isValid: true, error: null };
};

const isSessionExpiredError = (error: any): boolean => {
  return error?.message?.includes('session') || error?.message?.includes('JWT');
};

// ===== Custom Hooks =====
const useResetPasswordSession = () => {
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const setSessionFromHash = useCallback(async (accessToken: string, refreshToken: string): Promise<boolean> => {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return !error;
  }, []);

  const checkCurrentSession = useCallback(async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data: { user } } = await supabase.auth.getUser();
    return Boolean(user?.email);
  }, []);

  useEffect(() => {
    const handleSession = async () => {
      try {
        const { accessToken, refreshToken } = extractRecoveryTokens(window.location.hash);
        
        if (accessToken && refreshToken) {
          const success = await setSessionFromHash(accessToken, refreshToken);
          if (success) {
            setIsValidSession(true);
            setIsChecking(false);
            return;
          }
        }

        const hasValidSession = await checkCurrentSession();
        setIsValidSession(hasValidSession);
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setIsChecking(false);
      }
    };

    handleSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setIsValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [setSessionFromHash, checkCurrentSession]);

  return { isValidSession, isChecking };
};

const usePasswordReset = (onSuccess: () => void) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        if (isSessionExpiredError(error)) {
          toast({ 
            title: "Session Expired", 
            description: "Your reset link has expired. Please request a new one.", 
            variant: "destructive" 
          });
          return false;
        }
        
        toast({ 
          title: "Reset Failed", 
          description: error.message, 
          variant: "destructive" 
        });
        return false;
      }
      
      toast({ 
        title: "Password updated!", 
        description: "You can now sign in with your new password." 
      });
      
      onSuccess();
      return true;
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "An unexpected error occurred.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, resetPassword };
};

// ===== Subcomponents =====
const LoadingState: React.FC = () => (
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

const Header: React.FC = () => (
  <header className="relative z-10 p-4 sm:p-6">
    <div className="container mx-auto">
      <Link to="/auth" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity w-fit">
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="font-semibold text-sm sm:text-base">Back to Sign In</span>
      </Link>
    </div>
  </header>
);

const SuccessState: React.FC = () => (
  <div className="text-center space-y-4 py-4">
    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
    <p className="text-foreground font-medium">Password updated successfully!</p>
    <p className="text-muted-foreground text-sm">Redirecting to sign in...</p>
  </div>
);

const InvalidSessionState: React.FC = () => (
  <div className="text-center space-y-4 py-4">
    <p className="text-muted-foreground">
      Invalid or expired reset link. Please request a new password reset.
    </p>
    <Link to="/auth">
      <Button variant="outline">Back to Sign In</Button>
    </Link>
  </div>
);

const PasswordInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  disabled?: boolean;
}> = ({ id, label, value, onChange, showPassword, onToggleShow, disabled }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
        required
        disabled={disabled}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

const PasswordValidationMessages: React.FC<{
  password: string;
  confirmPassword: string;
}> = ({ password, confirmPassword }) => {
  const validation = validatePassword(password, confirmPassword);
  
  if (!password && !confirmPassword) return null;
  
  return (
    <>
      {password && confirmPassword && password !== confirmPassword && (
        <p className="text-sm text-red-500">Passwords do not match</p>
      )}
      {password && password.length < 6 && (
        <p className="text-sm text-yellow-500">Password must be at least 6 characters</p>
      )}
    </>
  );
};

const PasswordForm: React.FC<{
  onSubmit: (e: React.FormEvent) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  showConfirmPassword: boolean;
  onToggleShowConfirmPassword: () => void;
  isLoading: boolean;
  isValidSession: boolean;
}> = ({
  onSubmit,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  showPassword,
  onToggleShowPassword,
  showConfirmPassword,
  onToggleShowConfirmPassword,
  isLoading,
  isValidSession,
}) => {
  const isDisabled = isLoading || password.length < 6 || password !== confirmPassword;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordInput
        id="new-password"
        label="New Password"
        value={password}
        onChange={onPasswordChange}
        showPassword={showPassword}
        onToggleShow={onToggleShowPassword}
        disabled={!isValidSession}
      />
      
      <PasswordInput
        id="confirm-new-password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        showPassword={showConfirmPassword}
        onToggleShow={onToggleShowConfirmPassword}
        disabled={!isValidSession}
      />

      <PasswordValidationMessages password={password} confirmPassword={confirmPassword} />

      <Button 
        type="submit" 
        className="w-full gradient-bg" 
        disabled={!isValidSession || isDisabled}
      >
        {isLoading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
};

// ===== Main Component =====
const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isValidSession, isChecking } = useResetPasswordSession();
  const { isLoading, resetPassword } = usePasswordReset(() => setIsSuccess(true));
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePassword(password, confirmPassword);
    if (!validation.isValid) {
      const { toast } = useToast();
      toast({ 
        title: validation.error || "Validation Error", 
        variant: "destructive" 
      });
      return;
    }

    const success = await resetPassword(password);
    
    if (success) {
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/auth');
      }, 3000);
    }
  };

  // Loading state
  if (isChecking) {
    return <LoadingState />;
  }

  // Determine which content to show
  const renderContent = () => {
    if (isSuccess) {
      return <SuccessState />;
    }
    
    if (!isValidSession) {
      return <InvalidSessionState />;
    }
    
    return (
      <PasswordForm
        onSubmit={handleResetPassword}
        password={password}
        onPasswordChange={setPassword}
        confirmPassword={confirmPassword}
        onConfirmPasswordChange={setConfirmPassword}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
        showConfirmPassword={showConfirmPassword}
        onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        isLoading={isLoading}
        isValidSession={isValidSession}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient pointer-events-none"></div>

      <Header />

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
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
