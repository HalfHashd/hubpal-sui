"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { getProjects, updateProject, addActivity } from "@/lib/store"
import type { Project, Milestone } from "@/lib/types"

export default function ChainlinkDemoPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedMilestone, setSelectedMilestone] = useState<string>("")
  const [fromChain, setFromChain] = useState<string>("")
  const [toChain, setToChain] = useState<string>("")
  const [recentEvents, setRecentEvents] = useState<
    Array<{
      id: string
      timestamp: Date
      action: string
      milestone: string
      txHash: string
      type: "functions" | "ccip"
    }>
  >([])

  const chains = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base", "Avalanche"]

  useEffect(() => {
    const allProjects = getProjects()
    setProjects(allProjects)

    // Load recent events from localStorage
    const savedEvents = localStorage.getItem("chainlink_events")
    if (savedEvents) {
      const events = JSON.parse(savedEvents).map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }))
      setRecentEvents(events)
    }
  }, [])

  const saveEvent = (event: any) => {
    const newEvents = [event, ...recentEvents].slice(0, 5)
    setRecentEvents(newEvents)
    localStorage.setItem("chainlink_events", JSON.stringify(newEvents))
  }

  const handleFunctionsVerify = (project: Project, milestone: Milestone) => {
    const updatedMilestones = project.milestones.map((m) => {
      if (m.id === milestone.id) {
        // If pending, first set to completed, then verified
        if (m.status === "pending") {
          return { ...m, status: "verified" as const }
        }
        return { ...m, status: "verified" as const }
      }
      return m
    })

    const updatedProject = {
      ...project,
      milestones: updatedMilestones,
      lastUpdated: Date.now(),
    }

    updateProject(project.id, updatedProject)
    addActivity(project.id, `Chainlink Functions: Verified ${milestone.title}`)

    // Add to recent events
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action: "Functions Verification",
      milestone: milestone.title,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      type: "functions" as const,
    }
    saveEvent(event)

    // Refresh projects
    setProjects(getProjects())

    toast({
      title: "Verification recorded",
      description: "Milestone set to Verified.",
    })
  }

  const handleCCIPMessage = () => {
    if (!selectedProject || !selectedMilestone || !fromChain || !toChain) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields before sending CCIP message.",
        variant: "destructive",
      })
      return
    }

    const project = projects.find((p) => p.id === selectedProject)
    const milestone = project?.milestones.find((m) => m.id === selectedMilestone)

    if (!project || !milestone) return

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
    addActivity(project.id, `CCIP: ${fromChain}->${toChain} MILESTONE_VERIFIED for ${milestone.title}`)

    // Add to recent events
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      action: `CCIP ${fromChain}→${toChain}`,
      milestone: milestone.title,
      txHash,
      type: "ccip" as const,
    }
    saveEvent(event)

    // Refresh projects
    setProjects(getProjects())

    toast({
      title: "CCIP Message Sent",
      description: `Cross-chain message sent with tx: ${txHash.slice(0, 10)}...`,
    })

    // Reset form
    setSelectedMilestone("")
    setFromChain("")
    setToChain("")
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Chainlink Demo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Functions Verification Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Functions Verification</CardTitle>
              <CardDescription>Web2 → Web3 milestone verification using Chainlink Functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Project</label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a project..." />
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

              {selectedProjectData && (
                <div className="border rounded-lg">
                  <div className="p-3 bg-muted font-medium text-sm">Milestones</div>
                  <div className="divide-y">
                    {selectedProjectData.milestones.map((milestone) => (
                      <div key={milestone.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{milestone.title}</span>
                          <Badge
                            variant={
                              milestone.status === "verified"
                                ? "default"
                                : milestone.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleFunctionsVerify(selectedProjectData, milestone)}
                          disabled={milestone.status === "verified"}
                        >
                          Simulate Functions Verify
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CCIP Signal</CardTitle>
              <CardDescription>Cross-chain milestone verification messaging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">From Chain</label>
                  <Select value={fromChain} onValueChange={setFromChain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {chains.map((chain) => (
                        <SelectItem key={chain} value={chain}>
                          {chain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To Chain</label>
                  <Select value={toChain} onValueChange={setToChain}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chain..." />
                    </SelectTrigger>
                    <SelectContent>
                      {chains
                        .filter((chain) => chain !== fromChain)
                        .map((chain) => (
                          <SelectItem key={chain} value={chain}>
                            {chain}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Action</label>
                <Select value="MILESTONE_VERIFIED" disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILESTONE_VERIFIED">MILESTONE_VERIFIED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Milestone</label>
                <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone..." />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProjectData?.milestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCCIPMessage} className="w-full">
                Send CCIP Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Oracle Feed Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Live Oracle Feed</CardTitle>
            <CardDescription>Recent verification events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent events</p>
              ) : (
                recentEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant={event.type === "functions" ? "default" : "secondary"}>{event.action}</Badge>
                      <span className="text-xs text-muted-foreground">{event.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-medium">{event.milestone}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {event.txHash.slice(0, 10)}...{event.txHash.slice(-8)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
