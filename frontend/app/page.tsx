import { Hero } from "@/components/home/hero"
import { FeaturedCampaigns } from "@/components/home/featured-campaigns"
import { Categories } from "@/components/home/categories"
import { Stats } from "@/components/home/stats"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Categories />
      <FeaturedCampaigns />
      <Stats />
      <Footer />
    </div>
  )
}
