"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";

// Mock analytics data
const platformMetrics = {
  totalRevenue: 12500000,
  monthlyGrowth: 15.2,
  averageDonation: 2500,
  conversionRate: 12.5,
  userRetention: 78,
  campaignSuccessRate: 85,
};

const categoryPerformance = [
  { category: "Education", campaigns: 45, raised: 3200000, successRate: 88 },
  { category: "Healthcare", campaigns: 38, raised: 2800000, successRate: 92 },
  {
    category: "Disaster Relief",
    campaigns: 25,
    raised: 2100000,
    successRate: 95,
  },
  { category: "Business", campaigns: 32, raised: 1900000, successRate: 75 },
  { category: "Environment", campaigns: 18, raised: 1200000, successRate: 82 },
  { category: "Technology", campaigns: 12, raised: 800000, successRate: 70 },
];

const regionalData = [
  { region: "Dhaka", campaigns: 68, raised: 4500000, users: 1850 },
  { region: "Chittagong", campaigns: 42, raised: 2800000, users: 1200 },
  { region: "Sylhet", campaigns: 35, raised: 2200000, users: 980 },
  { region: "Khulna", campaigns: 28, raised: 1800000, users: 750 },
  { region: "Rajshahi", campaigns: 22, raised: 1400000, users: 620 },
  { region: "Barisal", campaigns: 18, raised: 1100000, users: 480 },
];

const monthlyTrends = [
  { month: "Jan", campaigns: 45, donations: 1200000, users: 420 },
  { month: "Feb", campaigns: 52, donations: 1350000, users: 380 },
  { month: "Mar", campaigns: 48, donations: 1280000, users: 450 },
  { month: "Apr", campaigns: 58, donations: 1480000, users: 520 },
  { month: "May", campaigns: 62, donations: 1620000, users: 580 },
  { month: "Jun", campaigns: 55, donations: 1520000, users: 490 },
];

const topCampaigns = [
  {
    title: "Emergency Flood Relief for Sylhet",
    raised: 780000,
    goal: 800000,
    donors: 234,
    category: "Disaster Relief",
  },
  {
    title: "Rural School Computer Lab",
    raised: 280000,
    goal: 300000,
    donors: 189,
    category: "Education",
  },
  {
    title: "Clean Water Initiative",
    raised: 450000,
    goal: 500000,
    donors: 156,
    category: "Healthcare",
  },
  {
    title: "Women Entrepreneur Support",
    raised: 180000,
    goal: 200000,
    donors: 98,
    category: "Business",
  },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-500" />
              <Link href="/admin" className="text-xl font-bold text-green-700">
                Project Bakso Admin
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              {/*<Link
                href="/admin"
                className="text-sm font-medium hover:text-green-600"
              >
                Dashboard
              </Link>*/}
              <Link
                href="/admin/campaigns"
                className="text-sm font-medium hover:text-green-600"
              >
                Campaigns
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-green-600"
              >
                Users
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm font-medium text-green-600"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into platform performance and trends
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳{(platformMetrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">
                  +{platformMetrics.monthlyGrowth}%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformMetrics.campaignSuccessRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Campaigns reach funding goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Donation
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳{platformMetrics.averageDonation.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformMetrics.conversionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Visitors to donors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Retention
              </CardTitle>
              <Users className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {platformMetrics.userRetention}%
              </div>
              <p className="text-xs text-muted-foreground">30-day retention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Growth
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{platformMetrics.monthlyGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">
                New user acquisition
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Top Performing Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCampaigns.map((campaign, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {campaign.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {campaign.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {campaign.donors} donors
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ৳{campaign.raised.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              of ৳{campaign.goal.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={(campaign.raised / campaign.goal) * 100}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Monthly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.slice(-3).map((month, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <div className="font-medium">{month.month} 2024</div>
                          <div className="text-sm text-gray-600">
                            {month.campaigns} campaigns
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ৳{(month.donations / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-600">
                            {month.users} new users
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Category Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{category.category}</h4>
                          <div className="text-sm text-gray-600">
                            {category.campaigns} campaigns •{" "}
                            {category.successRate}% success rate
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ৳{(category.raised / 1000000).toFixed(1)}M
                          </div>
                          <Badge
                            className={
                              category.successRate >= 85
                                ? "bg-green-600"
                                : category.successRate >= 75
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }
                          >
                            {category.successRate}% success
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={
                          (category.raised /
                            Math.max(
                              ...categoryPerformance.map((c) => c.raised),
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {regionalData.map((region, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{region.region}</h4>
                          <div className="text-sm text-gray-600">
                            {region.campaigns} campaigns • {region.users} users
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ৳{(region.raised / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-sm text-gray-600">
                            {(
                              (region.raised / platformMetrics.totalRevenue) *
                              100
                            ).toFixed(1)}
                            % of total
                          </div>
                        </div>
                      </div>
                      <Progress
                        value={
                          (region.raised /
                            Math.max(...regionalData.map((r) => r.raised))) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Campaign Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((month, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{month.month}</span>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium">
                              {month.campaigns}
                            </span>{" "}
                            campaigns
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">
                              ৳{(month.donations / 1000000).toFixed(1)}M
                            </span>{" "}
                            raised
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Campaign Creation Rate</span>
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Donation Volume</span>
                      <span className="font-semibold text-green-600">+18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>User Engagement</span>
                      <span className="font-semibold text-green-600">+8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platform Revenue</span>
                      <span className="font-semibold text-green-600">+15%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Key Insights</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>
                        • Healthcare campaigns have highest success rate (92%)
                      </li>
                      <li>• Dhaka region contributes 36% of total funding</li>
                      <li>• Average campaign duration is 42 days</li>
                      <li>• Mobile donations increased by 25%</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
