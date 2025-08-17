"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getProjectBySlug, markMilestone } from "@/lib/store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Copy, Check } from "lucide-react"

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "activity">("overview")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    const foundProject = getProjectBySlug(slug)
    setProject(foundProject || null)
  }, [slug])

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleMilestoneAction = (milestoneId: string, newStatus: "completed" | "verified") => {
    if (!project) return

    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    // If marking as verified but not completed, complete it first
    if (newStatus === "verified" && milestone.status === "pending") {
      markMilestone(project.id, milestoneId, { status: "completed" })
      setTimeout(() => {
        markMilestone(project.id, milestoneId, { status: "verified" })
        setProject(getProjectBySlug(slug) || null)
      }, 100)
    } else {
      markMilestone(project.id, milestoneId, { status: newStatus })
      setProject(getProjectBySlug(slug) || null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "verified":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

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

  const completedMilestones = project.milestones.filter(
    (m) => m.status === "completed" || m.status === "verified",
  ).length
  const progressPercentage = project.milestones.length > 0 ? (completedMilestones / project.milestones.length) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span>Budget: ${project.totalBudget.toLocaleString()}</span>
          <span>Raised: ${project.fundsRaised.toLocaleString()}</span>
          <span>Updated {formatRelativeTime(project.lastUpdated)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {["overview", "milestones", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <div className="flex items-center gap-4">
              <Progress value={progressPercentage} className="flex-1" />
              <span className="text-sm text-gray-600">
                {completedMilestones} / {project.milestones.length} milestones
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Project ENS Root:</span>
                <span className="ml-2 font-mono text-blue-600">{project.slug}.hubpal.eth</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${project.slug}.hubpal.eth`, "ens")}>
                {copiedField === "ens" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Mirror Path:</span>
                <span className="ml-2 font-mono text-blue-600">/eth/{project.slug}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(`/eth/${project.slug}`, "mirror")}>
                {copiedField === "mirror" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      milestone.status === "verified"
                        ? "bg-green-500 border-green-500"
                        : milestone.status === "completed"
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>

                  {/* Milestone card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">${milestone.amount.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div>
                        ENS: <span className="font-mono">{milestone.ensName}</span>
                      </div>
                      <div>
                        Mirror: <span className="font-mono">{milestone.mirrorUrl}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {milestone.status === "pending" && (
                        <Button size="sm" onClick={() => handleMilestoneAction(milestone.id, "completed")}>
                          Mark Completed
                        </Button>
                      )}
                      {milestone.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMilestoneAction(milestone.id, "verified")}
                        >
                          Mark Verified
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-4">
          {project.activity && project.activity.length > 0 ? (
            project.activity.map((entry, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{entry.action}</span>
                  <span className="text-sm text-gray-500">{formatRelativeTime(entry.timestamp)}</span>
                </div>
                <p className="text-gray-600">{entry.details}</p>
                <p className="text-xs text-gray-400">by {entry.actor}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No activity recorded yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
