
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Lock, Palette, Bell, Globe, Shield, Trash2, Download, Upload, Settings as SettingsIcon, Sparkles, Brain, Target } from 'lucide-react';

const Settings = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    resumeFormat: 'chronological',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    aiSuggestions: true,
    autoSave: true
  });

  const connectedServices = [
    {
      name: 'Gmail',
      description: 'Send resumes directly to employers',
      connected: true,
      icon: Mail,
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Google Drive',
      description: 'Backup and sync your resumes',
      connected: false,
      icon: Upload,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Dropbox',
      description: 'Cloud storage integration',
      connected: false,
      icon: Download,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const aiSettings = [
    {
      title: 'Smart Content Suggestions',
      description: 'Get AI-powered suggestions for improving your resume content',
      enabled: preferences.aiSuggestions,
      key: 'aiSuggestions'
    },
    {
      title: 'Auto-Complete',
      description: 'Automatically complete sentences and bullet points',
      enabled: true,
      key: 'autoComplete'
    },
    {
      title: 'Industry Optimization',
      description: 'Tailor content based on your target industry',
      enabled: true,
      key: 'industryOptimization'
    },
    {
      title: 'ATS Optimization',
      description: 'Ensure your resume passes applicant tracking systems',
      enabled: true,
      key: 'atsOptimization'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-950/30 dark:to-blue-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-500 to-blue-600 rounded-xl flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Account Settings</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Settings & Preferences
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Customize your experience and manage your account settings
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Profile Information */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Update your personal details</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                  <Input 
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                  <Input 
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <Input 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                  <Input 
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl">
                  Save Changes
                </Button>
                <Button variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Features</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Configure AI-powered assistance</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {aiSettings.map((setting, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{setting.title}</h3>
                        {setting.enabled && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{setting.description}</p>
                    </div>
                    <Switch 
                      checked={setting.enabled}
                      className="ml-4"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Privacy & Security</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Manage your account security</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Change Password</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Update your account password</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                  <Lock className="w-4 h-4 mr-2" />
                  Change
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50/50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div>
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-1">Delete Account</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">Permanently delete your account and data</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Preferences */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Customize your experience</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Language</label>
                <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Default Resume Format</label>
                <Select value={preferences.resumeFormat} onValueChange={(value) => setPreferences({...preferences, resumeFormat: value})}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chronological">Chronological</SelectItem>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Manage your notifications</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Resume tips and updates</p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Browser notifications</p>
                </div>
                <Switch 
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Marketing Emails</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Product updates and offers</p>
                </div>
                <Switch 
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => setPreferences({...preferences, marketingEmails: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Auto-Save</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automatically save changes</p>
                </div>
                <Switch 
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Connected Services */}
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Connected Services</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Manage integrations</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {connectedServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                          {service.connected && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`rounded-xl ${
                        service.connected 
                          ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {service.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
