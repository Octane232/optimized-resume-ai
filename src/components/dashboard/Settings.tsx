import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Lock, Bell, Shield, Trash2, Settings as SettingsIcon, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileDataResult, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileDataResult) {
        const fullName = profileDataResult.full_name || '';
        const nameParts = fullName.split(' ');
        setProfileData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user?.email || '',
          phone: profileDataResult.phone || '',
          location: profileDataResult.location || ''
        });
      } else {
        setProfileData(prev => ({
          ...prev,
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching settings data:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
        toast({
          title: "Missing Information",
          description: "First name and last name are required.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }

      const fullName = `${profileData.firstName.trim()} ${profileData.lastName.trim()}`;
      
      // Calculate profile completion
      let completedFields = 0;
      const totalFields = 5; // firstName, lastName, email, phone, location
      
      if (profileData.firstName.trim()) completedFields++;
      if (profileData.lastName.trim()) completedFields++;
      if (profileData.email) completedFields++; // Email is always present from auth
      if (profileData.phone?.trim()) completedFields++;
      if (profileData.location?.trim()) completedFields++;
      
      const profileCompletion = Math.round((completedFields / totalFields) * 100);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: fullName,
          phone: profileData.phone,
          location: profileData.location,
          profile_completion: profileCompletion
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Profile updated successfully (${profileCompletion}% complete)`
      });
      
      // Refresh data to show updated completion
      await fetchSettingsData();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-morphism border border-border/50">
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent/50 rounded-2xl border border-border/50">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Account Settings</span>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your profile and account settings
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Completion Card */}
        <Card className="glass-morphism border border-border/50 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-subtle p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Profile Completion
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your profile to get the best experience
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {(() => {
                    let completed = 0;
                    if (profileData.firstName?.trim()) completed++;
                    if (profileData.lastName?.trim()) completed++;
                    if (profileData.email) completed++;
                    if (profileData.phone?.trim()) completed++;
                    if (profileData.location?.trim()) completed++;
                    return Math.round((completed / 5) * 100);
                  })()}%
                </div>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(() => {
                    let completed = 0;
                    if (profileData.firstName?.trim()) completed++;
                    if (profileData.lastName?.trim()) completed++;
                    if (profileData.email) completed++;
                    if (profileData.phone?.trim()) completed++;
                    if (profileData.location?.trim()) completed++;
                    return Math.round((completed / 5) * 100);
                  })()}%` 
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant={profileData.firstName?.trim() ? "default" : "outline"} className="text-xs">
                {profileData.firstName?.trim() ? "✓" : "○"} First Name
              </Badge>
              <Badge variant={profileData.lastName?.trim() ? "default" : "outline"} className="text-xs">
                {profileData.lastName?.trim() ? "✓" : "○"} Last Name
              </Badge>
              <Badge variant={profileData.email ? "default" : "outline"} className="text-xs">
                {profileData.email ? "✓" : "○"} Email
              </Badge>
              <Badge variant={profileData.phone?.trim() ? "default" : "outline"} className="text-xs">
                {profileData.phone?.trim() ? "✓" : "○"} Phone
              </Badge>
              <Badge variant={profileData.location?.trim() ? "default" : "outline"} className="text-xs">
                {profileData.location?.trim() ? "✓" : "○"} Location
              </Badge>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="glass-morphism border border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
                <p className="text-sm text-muted-foreground font-normal">Update your personal details</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">First Name *</label>
                <Input 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="rounded-xl"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Last Name *</label>
                <Input 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="rounded-xl"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <Input 
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="rounded-xl"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <Input 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="rounded-xl"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                <Input 
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="rounded-xl"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={saveProfile}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 font-semibold rounded-xl"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fetchSettingsData()}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-morphism border border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground font-normal">Manage your notification preferences</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Resume tips and updates</p>
              </div>
              <Switch 
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
              <Switch 
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
              <div>
                <p className="font-semibold text-foreground">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Product updates and offers</p>
              </div>
              <Switch 
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="glass-morphism border border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Privacy & Security</h2>
                <p className="text-sm text-muted-foreground font-normal">Manage your account security</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Lock className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl border border-border/50">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                Enable
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl border border-destructive/50">
              <div>
                <h3 className="font-semibold text-destructive mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10 rounded-xl">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
