import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SponsorDemosPage() {
  const demos = [
    {
      slug: "ens",
      title: "ENS Demo",
      description: "Ethereum Name Service integration for decentralized domains",
      href: "/sponsor/ens",
    },
    {
      slug: "chainlink",
      title: "Chainlink Demo",
      description: "Oracle network integration for real-world data feeds",
      href: "/sponsor/chainlink",
    },
    {
      slug: "pyusd",
      title: "PYUSD Demo",
      description: "PayPal USD stablecoin payment integration",
      href: "/sponsor/pyusd",
    },
    {
      slug: "walrus",
      title: "Walrus Demo",
      description: "Decentralized storage protocol for data persistence",
      href: "/sponsor/walrus",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sponsor Demos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {demos.map((demo) => (
          <Card key={demo.slug} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{demo.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{demo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={demo.href}>Open Demo</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
