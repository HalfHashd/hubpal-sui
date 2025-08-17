"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getProjectBySlug, markMilestone } from "@/lib/store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Copy } from "lucide-react"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const foundProject = getProjectBySlug(slug)
    setProject(foundProject || null)
  }, [slug])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleMarkCompleted = (milestoneId: string) => {
    if (!project) return

    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (!milestone || milestone.status !== "pending") return

    markMilestone(project.id, milestoneId, { status: "completed" })
    setProject(getProjectBySlug(slug) || null)
  }

  const handleMarkVerified = (milestoneId: string) => {
    if (!project) return

    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    // If not completed, complete first then verify
    if (milestone.status === "pending") {
      markMilestone(project.id, milestoneId, { status: "completed" })
      // Small delay to ensure completion is processed
      setTimeout(() => {
        markMilestone(project.id, milestoneId, { status: "verified" })
        setProject(getProjectBySlug(slug) || null)
      }, 100)
    } else if (milestone.status === "completed") {
      markMilestone(project.id, milestoneId, { status: "verified" })
      setProject(getProjectBySlug(slug) || null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "verified":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    return "Just now"
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600">The project "{slug}" could not be found.</p>
        </div>
      </div>
    )
  }

  const completedMilestones = project.milestones.filter((m) => m.status === "completed" || m.status === "verified")
  const progressPercentage =
    project.milestones.length > 0 ? (completedMilestones.length / project.milestones.length) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.push("/marketplace")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600 text-lg mb-4">{project.description}</p>

        <div className="text-sm text-gray-500 mb-6">
          Budget: ${project.totalBudget.toLocaleString()} • Raised: ${project.fundsRaised.toLocaleString()} • Updated{" "}
          {getRelativeTime(project.lastUpdated)}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Project Progress</h3>
              <span className="text-sm text-gray-600">
                {completedMilestones.length} / {project.milestones.length} milestones completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Project ENS Root</h4>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-white px-2 py-1 rounded border flex-1">{slug}.hubpal.eth</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${slug}.hubpal.eth`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Mirror Base</h4>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-white px-2 py-1 rounded border flex-1">/eth/{slug}</code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(`/eth/${slug}`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                      milestone.status === "completed" || milestone.status === "verified"
                        ? "bg-green-500 border-green-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {(milestone.status === "completed" || milestone.status === "verified") && (
                      <Check className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
                    )}
                  </div>

                  {/* Milestone card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                    <div className="text-center mb-3">
                      <h4 className="font-semibold text-gray-900 mb-1">{milestone.title}</h4>
                      <p className="text-lg font-bold text-blue-600">${milestone.amount.toLocaleString()}</p>
                      <Badge className={`${getStatusColor(milestone.status)} mt-2`}>{milestone.status}</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      {milestone.status === "pending" && (
                        <Button size="sm" className="w-full" onClick={() => handleMarkCompleted(milestone.id)}>
                          Mark Completed
                        </Button>
                      )}
                      {(milestone.status === "completed" || milestone.status === "pending") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => handleMarkVerified(milestone.id)}
                        >
                          Mark Verified
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ENS:</span>
                        <code className="font-mono text-xs flex-1 truncate">{milestone.ensName}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(milestone.ensName)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Mirror:</span>
                        <code className="font-mono text-xs flex-1 truncate">{milestone.mirrorUrl}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(milestone.mirrorUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-4">
            {project.activity && project.activity.length > 0 ? (
              project.activity
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((activity, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{activity.action}</span>
                      <span className="text-sm text-gray-500">{getRelativeTime(activity.timestamp)}</span>
                    </div>
                    <p className="text-gray-600">{activity.details}</p>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No activity recorded yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
