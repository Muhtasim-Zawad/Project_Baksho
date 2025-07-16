"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, CheckCircle, AlertCircle, ArrowRight, Heart, Users, Target } from "lucide-react"

const categories = [
  "Education",
  "Health",
  "Business",
  "Creative",
  "Environment",
  "Community",
  "Emergency",
  "Technology",
  "Sports",
  "Arts",
]

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Interests", description: "Choose your preferences" },
  { id: 3, title: "Complete", description: "You're all set!" },
]

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isFirstTime = searchParams.get("first-time") === "true"

  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  // Form data state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "/placeholder.svg?height=100&width=100",
    bio: "",
    location: "",
    website: "",
    phone: "",
    interests: [] as string[],
    role: user?.role || "donor",
  })

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to edit your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Mock file upload - in real app, upload to cloud storage
      const mockUrl = `/placeholder.svg?height=100&width=100&text=${file.name}`
      setProfileData({ ...profileData, avatar: mockUrl })
    }
  }

  const handleInterestToggle = (interest: string) => {
    const updatedInterests = profileData.interests.includes(interest)
      ? profileData.interests.filter((i) => i !== interest)
      : [...profileData.interests, interest]

    setProfileData({ ...profileData, interests: updatedInterests })
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setErrors({})
    setSuccessMessage("")

    try {
      // Final validation
      if (!validateStep1()) {
        setCurrentStep(1)
        return
      }

      // Mock API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccessMessage("Profile updated successfully!")

      // Redirect based on context
      setTimeout(() => {
        if (isFirstTime) {
          // First time users go to their dashboard
          const dashboardPath =
            user.role === "admin"
              ? "/admin/dashboard"
              : "/user/dashboard"
          router.push(dashboardPath)
        } else {
          // Regular users go back to profile
          router.push("/profile")
        }
      }, 1500)
    } catch (error) {
      setErrors({ general: "Failed to update profile. Please try again." })
      setCurrentStep(1)
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    // Allow users to skip the onboarding
    const dashboardPath =
      user.role === "admin"
        ? "/admin/dashboard"
        : "/user/dashboard"
    router.push(dashboardPath)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {isFirstTime ? (
            <>
              <h1 className="text-3xl font-bold mb-2">Welcome to CrowdFund! 🎉</h1>
              <p className="text-muted-foreground">Let's set up your profile to get you started</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">Edit Your Profile</h1>
              <p className="text-muted-foreground">Update your information and preferences</p>
            </>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${step.id < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} />
        </div>

        {/* Error Messages */}
        {errors.general && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Tell us about yourself so others can get to know you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                    <Camera className="h-3 w-3" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name || "Your Name"}</h3>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className={errors.name ? "border-red-500" : ""}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself, your interests, and what motivates you..."
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be visible on your public profile and help others connect with you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interests */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <CardDescription>
                Select categories you're interested in to get personalized campaign recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      profileData.interests.includes(category)
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                    onClick={() => handleInterestToggle(category)}
                  >
                    <div className="text-center">
                      <p className="font-medium">{category}</p>
                      {profileData.interests.includes(category) && (
                        <CheckCircle className="h-4 w-4 text-primary mx-auto mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Selected Interests ({profileData.interests.length})</h4>
                {profileData.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select at least one category to get started (you can change this later)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Complete */}
        {currentStep === 3 && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>You're All Set! 🎉</CardTitle>
              <CardDescription>Your profile has been set up successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Summary */}
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback>
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profileData.name}</h3>
                    <p className="text-sm text-muted-foreground">{profileData.location || "Location not set"}</p>
                  </div>
                </div>

                {profileData.bio && <p className="text-sm text-muted-foreground mb-4">{profileData.bio}</p>}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Interested in:</p>
                  <div className="flex flex-wrap gap-1">
                    {profileData.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              {isFirstTime && (
                <div className="space-y-4">
                  <h4 className="font-medium">What's Next?</h4>
                  <div className="grid gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <Heart className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Explore Campaigns</p>
                        <p className="text-xs text-muted-foreground">Discover amazing projects to support</p>
                      </div>
                    </div>

                    {user.role === "organizer" && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <Target className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Create Your First Campaign</p>
                          <p className="text-xs text-muted-foreground">Start raising funds for your project</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">Join the Community</p>
                        <p className="text-xs text-muted-foreground">Connect with other supporters and creators</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {isFirstTime && currentStep < 3 && (
              <Button variant="ghost" onClick={handleSkip} className="ml-2">
                Skip for now
              </Button>
            )}
          </div>

          <div>
            {currentStep < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isFirstTime ? "Get Started" : "Save Changes"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
