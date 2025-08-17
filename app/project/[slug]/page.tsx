"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getProjectBySlug, markMilestone } from "@/lib/store"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Check } from "lucide-react"

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const foundProject = getProjectBySlug(slug)
    setProject(foundProject || null)
  }, [slug])

  const handleMarkCompleted = (milestoneId: string) => {
    if (!project) return

    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (!milestone || milestone.status !== "pending") return

    markMilestone(project.id, milestoneId, { status: "completed" })
    setProject(getProjectBySlug(slug) || null)
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
  const amountReleased = completedMilestones.reduce((sum, m) => sum + m.amount, 0)
  const remaining = project.totalBudget - amountReleased
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
        <p className="text-gray-600 text-lg mb-6">{project.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Total Budget</div>
            <div className="text-2xl font-bold text-blue-900">${project.totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Amount Released</div>
            <div className="text-2xl font-bold text-green-900">${amountReleased.toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Remaining</div>
            <div className="text-2xl font-bold text-gray-900">${remaining.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Project Progress</h3>
            <span className="text-sm text-gray-600">
              {completedMilestones.length} / {project.milestones.length} milestones completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Milestones Timeline</h2>

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

                  {milestone.status === "pending" && (
                    <Button size="sm" className="w-full" onClick={() => handleMarkCompleted(milestone.id)}>
                      Mark Completed
                    </Button>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">ENS:</span>
                      <div className="font-mono break-all">{milestone.ensName}</div>
                    </div>
                    <div>
                      <span className="font-medium">Mirror:</span>
                      <div className="font-mono break-all">{milestone.mirrorUrl}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
