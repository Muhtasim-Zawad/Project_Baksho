
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, EyeOff } from "lucide-react"
import { useState } from "react"


const SecurityContent = () => {
      const [isSaving, setSaving] = useState(false)
      const [showCurrentPassword, setShowCurrentPassword] = useState(false)
      const [showNewPassword, setShowNewPassword] = useState(false)
      const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
      const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      const [errors, setErrors] = useState<Record<string, string>>({})
      const [successMessage, setSuccessMessage] = useState("")

    const handlePasswordChange = async () => {
        setSaving(true)
        setErrors({})
        setSuccessMessage("")

        try {
            // Validation
            const newErrors: Record<string, string> = {}

            if (!passwordData.currentPassword) {
                newErrors.currentPassword = "Current password is required"
            }

            if (!passwordData.newPassword) {
                newErrors.newPassword = "New password is required"
            } else if (passwordData.newPassword.length < 6) {
                newErrors.newPassword = "Password must be at least 6 characters"
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors)
                return
            }

            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setSuccessMessage("Password changed successfully!")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (error) {
            setErrors({ general: "Failed to change password. Please try again." })
        } finally {
            setSaving(false)
        }
    }

    return (
        <TabsContent value="security">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className={errors.currentPassword ? "border-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className={errors.newPassword ? "border-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                        </div>

                        <Button onClick={handlePasswordChange} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Shield className="mr-2 h-4 w-4 animate-spin" />
                                    Changing Password...
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Change Password
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>Additional security settings for your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                            <Button variant="outline">Enable 2FA</Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Login Sessions</p>
                                <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                            </div>
                            <Button variant="outline">View Sessions</Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Account Deletion</p>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                            </div>
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
};

export default SecurityContent;