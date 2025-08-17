"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink } from "lucide-react"
import { getProjects } from "@/lib/store"
import type { Project } from "@/lib/types"

// Mock ENS resolution data
const mockEnsResolution = {
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b": "alice.eth",
  "0x8ba1f109551bD432803012645Hac136c22C": "bob.eth",
  "0x123456789abcdef123456789abcdef123456789": "charlie.eth",
}

const mockAddresses = Object.keys(mockEnsResolution)

export default function ENSDemoPage() {
  const [showEnsNames, setShowEnsNames] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState("")
  const [ensName, setEnsName] = useState("")
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [l2Primary, setL2Primary] = useState<{ name: string; network: string; txHash: string } | null>(null)

  useEffect(() => {
    const allProjects = getProjects()
    setProjects(allProjects)
    if (allProjects.length > 0) {
      setSelectedProjectId(allProjects[0].id)
    }
  }, [])

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const simulateSetL2Primary = () => {
    if (!walletAddress || !ensName || !selectedNetwork) return

    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
    setL2Primary({
      name: ensName,
      network: selectedNetwork,
      txHash: mockTxHash,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">ENS Demo</h1>
      <p className="text-muted-foreground mb-8">Interactive demonstration of ENS integration features</p>

      {/* Identity Everywhere Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Identity Everywhere</CardTitle>
          <CardDescription>Show ENS names alongside wallet addresses throughout the app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-ens"
              checked={showEnsNames}
              onCheckedChange={(checked) => setShowEnsNames(checked as boolean)}
            />
            <Label htmlFor="show-ens">Render ENS name wherever an address appears</Label>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-3">Example Address List:</h4>
            <div className="space-y-2">
              {mockAddresses.map((address, index) => (
                <div key={address} className="flex items-center justify-between p-2 bg-background rounded border">
                  <div className="font-mono text-sm">
                    {address.slice(0, 6)}...{address.slice(-4)}
                    {showEnsNames && (
                      <span className="ml-2 text-blue-600 font-normal">
                        ({mockEnsResolution[address as keyof typeof mockEnsResolution]})
                      </span>
                    )}
                  </div>
                  <Badge variant="outline">User {index + 1}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project ENS & Subnames Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Project ENS & Subnames</CardTitle>
          <CardDescription>View ENS subnames and Mirror URLs for project milestones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="project-select">Select Project</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 font-medium">Milestones for "{selectedProject.name}"</div>
              <div className="divide-y">
                {selectedProject.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ENS Subname:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs">{milestone.ensName}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(milestone.ensName)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Mirror URL:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-xs">{milestone.mirrorUrl}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(milestone.mirrorUrl)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* L2 Primary Name Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. L2 Primary Name</CardTitle>
          <CardDescription>Set your primary ENS name on Layer 2 networks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wallet-address">Your Wallet Address</Label>
              <Input
                id="wallet-address"
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ens-name">ENS Name to Set</Label>
              <Input
                id="ens-name"
                placeholder="user123.hubpal.eth"
                value={ensName}
                onChange={(e) => setEnsName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="network-select">Network</Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="optimism">OP Mainnet</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={simulateSetL2Primary}
            disabled={!walletAddress || !ensName || !selectedNetwork}
            className="w-full"
          >
            Simulate Set L2 Primary Name
          </Button>

          {l2Primary && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  Primary set on {l2Primary.network}
                </Badge>
              </div>
              <div className="text-sm">
                <strong>Transaction Hash:</strong>
                <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{l2Primary.txHash}</code>
              </div>
              <div className="text-sm">
                <strong>Current Primary:</strong> {l2Primary.name}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Strip */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Production Implementation</h4>
              <p className="text-sm text-blue-800">
                In production, the L2 Primary Name feature uses the L2ReverseRegistrar contract to set reverse records
                on Layer 2 networks, enabling cross-chain ENS resolution and identity management across the Ethereum
                ecosystem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
