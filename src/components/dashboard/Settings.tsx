
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Palette, BarChart3, Mail, Linkedin, MessageSquare, CreditCard, Zap } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [resumeFormat, setResumeFormat] = useState('chronological');
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [gmailConnected, setGmailConnected] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account preferences and integrations</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+1 (555) 123-4567" />
          </div>
          <div>
            <Label htmlFor="jobTitle">Current Job Title</Label>
            <Input id="jobTitle" placeholder="Software Engineer" />
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Appearance & Preferences */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            Appearance & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Switch between light and dark themes
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          
          <div>
            <Label>Default Resume Format</Label>
            <Select value={resumeFormat} onValueChange={setResumeFormat}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chronological">Chronological</SelectItem>
                <SelectItem value="functional">Functional</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Preferred Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Connected Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label>LinkedIn Integration</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Import your experience and education automatically
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {linkedinConnected && <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>}
              <Button 
                variant={linkedinConnected ? "outline" : "default"} 
                size="sm"
                onClick={() => setLinkedinConnected(!linkedinConnected)}
              >
                {linkedinConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label>Gmail Integration</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Send resumes directly to employers via email
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {gmailConnected && <Badge className="bg-emerald-100 text-emerald-700">Connected</Badge>}
              <Button 
                variant={gmailConnected ? "outline" : "default"} 
                size="sm"
                onClick={() => setGmailConnected(!gmailConnected)}
              >
                {gmailConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Receive updates about your resumes and job matches
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Resume Tips</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get AI-powered tips to improve your resume
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Job Match Alerts</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get notified when new jobs match your profile
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Feedback & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Help us improve AI Resume Pro by sharing your feedback or reporting any issues.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Send Feedback
            </Button>
            <Button variant="outline" className="flex-1">
              Report Bug
            </Button>
            <Button variant="outline" className="flex-1">
              Request Feature
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
