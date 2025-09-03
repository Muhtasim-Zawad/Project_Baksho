"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, DollarSign, TrendingUp, Gift, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { axiosPrivate } from "@/hooks/useAxiosPrivate";
import type { Campaign, IncentiveTier } from "../campaigns/[id]/page"; // Reusing types

// New types needed for this page
interface Transaction {
  id: number;
  user_id: string;
  campaign_id: number;
  amount: string;
  currency: string;
  payment_status: string;
  payment_intent_id: string;
  created_at: string;
}

interface SupportedCampaign extends Campaign {
  myContribution: number;
  donationDate: string;
}

interface UserIncentive {
  id: string;
  campaignTitle: string;
  incentive: IncentiveTier;
  donationDate: string;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    campaignsCreated: 0,
    incentivesReceived: 0,
  });
  const [supportedCampaigns, setSupportedCampaigns] = useState<
    SupportedCampaign[]
  >([]);
  const [createdCampaigns, setCreatedCampaigns] = useState<Campaign[]>([]);
  const [incentives, setIncentives] = useState<UserIncentive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log(user);
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch campaigns first, as it's required for processing payments data
        const campaignsRes = await axiosPrivate.get("/campaigns/");
        const allCampaigns: Campaign[] = campaignsRes.data;
        console.log(allCampaigns);

        // Process campaigns created by the user
        const created = allCampaigns.filter((c) => c.organizer_id === user._id);
        setCreatedCampaigns(created);
        console.log(created);

        // Fetch user's payments in a separate try-catch to handle failures gracefully
        let userPayments: Transaction[] = [];
        try {
          const paymentsRes = await fetch(
            `http://localhost:8080/payments/user/${user._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            },
          );
          userPayments = paymentsRes.ok ? await paymentsRes.json() : [];
        } catch (paymentError) {
          console.error("Could not fetch payment data:", paymentError);
        }

        // Process supported campaigns, stats, and incentives using the fetched data
        const supportedCampaignsMap = new Map<number, SupportedCampaign>();
        let totalDonated = 0;

        for (const payment of userPayments) {
          const campaign = allCampaigns.find(
            (c) => c.id === payment.campaign_id,
          );
          if (campaign) {
            totalDonated += parseFloat(payment.amount);
            if (supportedCampaignsMap.has(campaign.id)) {
              const existing = supportedCampaignsMap.get(campaign.id)!;
              existing.myContribution += parseFloat(payment.amount);
            } else {
              supportedCampaignsMap.set(campaign.id, {
                ...campaign,
                myContribution: parseFloat(payment.amount),
                donationDate: payment.created_at,
              });
            }
          }
        }

        const supported = Array.from(supportedCampaignsMap.values());
        setSupportedCampaigns(supported);

        const userIncentives: UserIncentive[] = [];
        for (const payment of userPayments) {
          const campaign = allCampaigns.find(
            (c) => c.id === payment.campaign_id,
          );
          if (campaign && campaign.incentive_tiers) {
            const applicableTier = campaign.incentive_tiers
              .filter((tier) => parseFloat(payment.amount) >= tier.amount)
              .sort((a, b) => b.amount - a.amount)[0];

            if (applicableTier) {
              userIncentives.push({
                id: `${payment.id}-${applicableTier.id}`,
                campaignTitle: campaign.title,
                incentive: applicableTier,
                donationDate: payment.created_at,
              });
            }
          }
        }
        setIncentives(userIncentives);

        setStats({
          totalDonated: totalDonated,
          campaignsSupported: supported.length,
          campaignsCreated: created.length,
          incentivesReceived: userIncentives.length,
        });
      } catch (campaignError) {
        console.error(
          "Failed to fetch primary dashboard data (campaigns):",
          campaignError,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) {
    // This can be a loading spinner or a redirect component
    return <div>Please log in to access your dashboard.</div>;
  }

  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Track your donations and see the impact you're making
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Donated
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalDonated.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {stats.campaignsSupported} campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Campaigns Supported
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.campaignsSupported}
              </div>
              <p className="text-xs text-muted-foreground">
                Making a difference together
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Campaigns Created
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.campaignsCreated}</div>
              <p className="text-xs text-muted-foreground">
                Bringing your ideas to life
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incentives</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.incentivesReceived}
              </div>
              <p className="text-xs text-muted-foreground">
                Rewards for your support
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="supported-campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="supported-campaigns">
              Supported Campaigns
            </TabsTrigger>
            <TabsTrigger value="created-campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="incentives">My Incentives</TabsTrigger>
          </TabsList>

          <TabsContent value="supported-campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaigns You've Supported</CardTitle>
                <CardDescription>
                  Your contributions are making these projects possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supportedCampaigns.length > 0 ? (
                  <div className="grid gap-6">
                    {supportedCampaigns.map((campaign) => (
                      <Card key={campaign.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Image
                              src={
                                campaign.image_urls?.split(",")[0] ||
                                "/placeholder.svg"
                              }
                              alt={campaign.title}
                              width={150}
                              height={100}
                              className="rounded-lg object-cover w-full sm:w-[150px] h-auto sm:h-[100px]"
                            />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">
                                  {campaign.title}
                                </h3>
                                <Badge
                                  variant={
                                    campaign.raised >= campaign.goal
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {campaign.raised >= campaign.goal
                                    ? "Funded"
                                    : "Active"}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    ${campaign.raised.toLocaleString()} raised
                                  </span>
                                  <span>
                                    ${campaign.goal.toLocaleString()} goal
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (campaign.raised / campaign.goal) * 100
                                  }
                                />
                              </div>

                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                  Your contribution: $
                                  {campaign.myContribution.toFixed(2)}
                                </p>
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/campaigns/${campaign.id}`}>
                                    View Campaign
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">
                      You haven't supported any campaigns yet.
                    </p>
                    <Button asChild>
                      <Link href="/campaigns">Discover Campaigns</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="created-campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaigns You've Created</CardTitle>
                <CardDescription>
                  Manage your fundraising projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {createdCampaigns.length > 0 ? (
                  <div className="grid gap-6">
                    {createdCampaigns.map((campaign) => (
                      <Card key={campaign.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Image
                              src={
                                campaign.image_urls?.split(",")[0] ||
                                "/placeholder.svg"
                              }
                              alt={campaign.title}
                              width={150}
                              height={100}
                              className="rounded-lg object-cover w-full sm:w-[150px] h-auto sm:h-[100px]"
                            />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">
                                  {campaign.title}
                                </h3>
                                <Badge
                                  variant={
                                    !campaign.reviewed && !campaign.approved
                                      ? "secondary"
                                      : campaign.approved
                                        ? "default"
                                        : "destructive"
                                  }
                                >
                                  {!campaign.reviewed && !campaign.approved
                                    ? "Pending"
                                    : campaign.approved
                                      ? "Approved"
                                      : "Rejected"}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    ${campaign.raised.toLocaleString()} raised
                                  </span>
                                  <span>
                                    ${campaign.goal.toLocaleString()} goal
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (campaign.raised / campaign.goal) * 100
                                  }
                                />
                              </div>

                              <div className="flex items-center justify-end">
                                <Button asChild variant="outline" size="sm">
                                  <Link href={`/campaigns/${campaign.id}`}>
                                    View & Manage
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">
                      You haven't created any campaigns yet.
                    </p>
                    <Button asChild>
                      <Link href="/campaigns/create">Start a Campaign</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incentives">
            <Card>
              <CardHeader>
                <CardTitle>Your Incentives</CardTitle>
                <CardDescription>
                  Track your rewards and thank you gifts from campaigns you've
                  supported.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {incentives.length > 0 ? (
                  <div className="space-y-4">
                    {incentives.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.incentive.title}</p>
                          <p className="text-sm text-muted-foreground">
                            From: {item.campaignTitle}
                          </p>
                          <Badge variant={"secondary"}>
                            Donated ${item.incentive.amount}
                          </Badge>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p className="text-sm">
                            {item.incentive.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      You have no incentives from your donations yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
