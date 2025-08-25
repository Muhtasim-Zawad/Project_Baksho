
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, DollarSign, Target } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"


const ProfileContent = () => {
    const { user } = useAuth();
    return (
        <TabsContent value={'profile'}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information and profile details</CardDescription>
                        </div>
                        <Link href={'/edit-profile'}>
                            <Button variant={'default'}>
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                                <AvatarFallback className="text-lg">
                                    {user?.name
                                        .split(" ")
                                        .map((n: any) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{user?.name}</h3>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <Badge variant="secondary" className="mt-1">
                                {user?.role}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Profile Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-muted-foreground">Total Donated</span>
                                </div>
                                <p className="text-2xl font-bold">${2}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-red-600" />
                                    <span className="text-sm text-muted-foreground">Campaigns Supported</span>
                                </div>
                                <p className="text-2xl font-bold">{10}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-muted-foreground">Campaigns Created</span>
                                </div>
                                <p className="text-2xl font-bold">{9}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Full Name</Label>
                            <p className="border px-4 py-2 rounded-md bg-white shadow-sm">{user?.name || "—"}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="border px-4 py-2 rounded-md bg-white shadow-sm">{user?.email || "—"}</p>
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Location</Label>
                            <p className="border px-4 py-2 rounded-md bg-white shadow-sm">{user?.location || "—"}</p>
                        </div>

                        {/* Website (Full Width) */}
                        <div className="space-y-1 md:col-span-2">
                            <Label className="text-muted-foreground">Website</Label>
                            <p className="border px-4 py-2 rounded-md bg-white shadow-sm break-words">
                                {user?.website || "—"}
                            </p>
                        </div>

                        {/* Bio (Full Width) */}
                        <div className="space-y-1 md:col-span-2">
                            <Label className="text-muted-foreground">Bio</Label>
                            <p className="border px-4 py-2 rounded-md bg-white shadow-sm whitespace-pre-line">
                                {user?.bio || "—"}
                            </p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default ProfileContent;