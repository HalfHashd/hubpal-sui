import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            ENS Projects–Crowdfunding Marketplace and Platform
          </h1>
          <p className="text-xl text-muted-foreground">Powered by HubPal™.org</p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/create">Create a Project</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
