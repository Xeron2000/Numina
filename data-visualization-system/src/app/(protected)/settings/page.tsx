// app/(protected)/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Lock, User, HelpCircle, Languages, Save, LogOut } from "lucide-react";

interface UserInfo {
  email: string;
  username: string;
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 直接初始化 user 和 initials
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    setLoading(true);

    const userString = localStorage.getItem("user");
    if(userString){
      setUser(JSON.parse(userString));
      setLoading(false);
    }
    
  },[])

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };



  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-shrink-0">
                  {loading ? (
                    <Skeleton className="h-20 w-20 rounded-full" />
                  ) : (
                    <Avatar className="h-20 w-20">
                      <AvatarImage />
                      <AvatarFallback className="text-3xl">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-medium">Profile Picture</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload a new profile picture
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      Upload
                    </Button>
                    <Button size="sm" variant="outline">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input id="name" defaultValue={user?.username} />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {loading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input id="email" defaultValue={user?.email} />
                )}
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {loading ? (
                  <Skeleton className="h-20 w-full" />
                ) : (
                  <textarea
                    id="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={user?.bio ?? ""}
                    placeholder="Enter your bio"
                  />
                )}
              </div> */}

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app to generate one-time security codes
                    </p>
                  </div>
                  <Toggle aria-label="Toggle authenticator app" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Sessions</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        Windows • Chrome • New York, USA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Started 2 hours ago
                      </p>
                    </div>
                    <div className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all of your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when datasets are updated
                    </p>
                  </div>
                  <Toggle aria-label="Toggle data updates" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Visualization Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when visualizations are created or updated
                    </p>
                  </div>
                  <Toggle aria-label="Toggle visualization updates" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system updates and new features
                    </p>
                  </div>
                  <Toggle aria-label="Toggle system updates" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">In-App Notifications</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Processing Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when data processing completes
                    </p>
                  </div>
                  <Toggle aria-label="Toggle data processing alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Collaboration Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when team members make changes
                    </p>
                  </div>
                  <Toggle aria-label="Toggle collaboration updates" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="system">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred color theme for the application
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred language for the interface
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mm-dd-yyyy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select a date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your preferred date format
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chart-theme">Chart Theme</Label>
                <Select defaultValue="default">
                  <SelectTrigger id="chart-theme">
                    <SelectValue placeholder="Select a chart theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a color theme for your data visualizations
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get help with using the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Access our comprehensive documentation to learn more about how to use Numina.
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Need additional help? Our support team is available to assist you.
                </p>
                <Button variant="outline">Contact Support</Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Watch step-by-step tutorials to make the most of Numina's features.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="p-4">
                    <h4 className="font-medium">Getting Started</h4>
                    <p className="text-sm text-muted-foreground mb-2">5:30 min</p>
                    <Button variant="outline" size="sm">Watch Now</Button>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">Advanced Visualizations</h4>
                    <p className="text-sm text-muted-foreground mb-2">8:45 min</p>
                    <Button variant="outline" size="sm">Watch Now</Button>
                  </Card>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  We're always looking to improve. Share your feedback or report issues.
                </p>
                <div className="space-y-2">
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Share your thoughts or report an issue..."
                  />
                  <Button>Submit Feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}