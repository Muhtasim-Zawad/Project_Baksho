"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle} from "lucide-react"
import Link from "next/link"
import Header from "@/components/profile/Header"
import ProfileContent from "@/components/profile/ProfileContent"
import SecurityContent from "@/components/profile/SecurityContent"


export default function ProfilePage() {
  const { user} = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Log In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  // const handleProfileSave = async () => {
  //   setSaving(true)
  //   setErrors({})
  //   setSuccessMessage("")

  //   try {
  //     // Validation
  //     const newErrors: Record<string, string> = {}

  //     if (!profileData.name.trim()) {
  //       newErrors.name = "Name is required"
  //     }

  //     if (!profileData.email.trim()) {
  //       newErrors.email = "Email is required"
  //     } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
  //       newErrors.email = "Please enter a valid email"
  //     }

  //     if (Object.keys(newErrors).length > 0) {
  //       setErrors(newErrors)
  //       return
  //     }

  //     // Mock API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000))

  //     setSuccessMessage("Profile updated successfully!")
  //     setIsEditing(false)

  //     // Clear success message after 3 seconds
  //     setTimeout(() => setSuccessMessage(""), 3000)
  //   } catch (error) {
  //     setErrors({ general: "Failed to update profile. Please try again." })
  //   } finally {
  //     setSaving(false)
  //   }
  // }

  // const handlePreferencesUpdate = async (key: string, value: any) => {
  //   const updatedPreferences = { ...profileData.preferences, [key]: value }
  //   setProfileData({ ...profileData, preferences: updatedPreferences })

  //   // Auto-save preferences
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500))
  //     console.log("Preferences updated:", key, value)
  //   } catch (error) {
  //     console.error("Failed to update preferences")
  //   }
  // }

  // const handlePrivacyUpdate = async (key: string, value: any) => {
  //   const updatedPrivacy = { ...profileData.privacy, [key]: value }
  //   setProfileData({ ...profileData, privacy: updatedPrivacy })

  //   // Auto-save privacy settings
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 500))
  //     console.log("Privacy settings updated:", key, value)
  //   } catch (error) {
  //     console.error("Failed to update privacy settings")
  //   }
  // }

  // const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     // Mock file upload - in real app, upload to cloud storage
  //     const mockUrl = `/placeholder.svg?height=100&width=100&text=${file.name}`
  //     setProfileData({ ...profileData, avatar: mockUrl })
  //   }
  // }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background mx-auto border-2 border-red-400">
      <div className="container py-8 max-w-4xl mx-auto">
        {/* Header */}
        <Header/>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {/* <TabsTrigger value="preferences">Preferences</TabsTrigger> */}
            {/* <TabsTrigger value="privacy">Privacy</TabsTrigger> */}
          </TabsList>

          <ProfileContent/>
          <SecurityContent/>

          {/* Preferences Tab */}
          {/* <TabsContent value="preferences">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Preferences</CardTitle>
                  <CardDescription>Choose your interests to get personalized campaign recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Interested Categories</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={category}
                            checked={profileData.preferences.categories.includes(category)}
                            onChange={(e) => {
                              const updatedCategories = e.target.checked
                                ? [...profileData.preferences.categories, category]
                                : profileData.preferences.categories.filter((c) => c !== category)
                              handlePreferencesUpdate("categories", updatedCategories)
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={category} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.emailNotifications}
                      onCheckedChange={(checked) => handlePreferencesUpdate("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.pushNotifications}
                      onCheckedChange={(checked) => handlePreferencesUpdate("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Campaign Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about updates from campaigns you support
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.campaignUpdates}
                      onCheckedChange={(checked) => handlePreferencesUpdate("campaignUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Donation Receipts</p>
                      <p className="text-sm text-muted-foreground">Receive email receipts for your donations</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.donationReceipts}
                      onCheckedChange={(checked) => handlePreferencesUpdate("donationReceipts", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and special offers</p>
                    </div>
                    <Switch
                      checked={profileData.preferences.marketingEmails}
                      onCheckedChange={(checked) => handlePreferencesUpdate("marketingEmails", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Newsletter</p>
                      <p className="text-sm text-muted-foreground">
                        Get our monthly newsletter with featured campaigns
                      </p>
                    </div>
                    <Switch
                      checked={profileData.preferences.monthlyNewsletter}
                      onCheckedChange={(checked) => handlePreferencesUpdate("monthlyNewsletter", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}

          {/* Privacy Tab */}
          {/* <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select
                    value={profileData.privacy.profileVisibility}
                    onValueChange={(value) => handlePrivacyUpdate("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view your profile</SelectItem>
                      <SelectItem value="supporters">Supporters Only - Only people you've supported can see</SelectItem>
                      <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Donation History</p>
                    <p className="text-sm text-muted-foreground">Display campaigns you've supported on your profile</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.showDonations}
                    onCheckedChange={(checked) => handlePrivacyUpdate("showDonations", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Location</p>
                    <p className="text-sm text-muted-foreground">Display your location on your public profile</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.showLocation}
                    onCheckedChange={(checked) => handlePrivacyUpdate("showLocation", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email Address</p>
                    <p className="text-sm text-muted-foreground">Make your email visible to other users</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyUpdate("showEmail", checked)}
                  />
                </div>

                <Separator />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Export & Deletion</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have the right to export your data or request account deletion at any time.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export My Data
                    </Button>
                    <Button variant="outline" size="sm">
                      Request Deletion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}
