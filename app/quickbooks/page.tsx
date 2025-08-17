"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects, updateProject, addActivity } from "@/lib/store"
import type { Project, Milestone } from "@/lib/types"

export default function QuickBooksDemo() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [qbEvents, setQbEvents] = useState<
    Array<{
      timestamp: number
      project: string
      milestone: string
      eventId: string
    }>
  >([])

  const searchParams = useSearchParams()
  const preselectedProject = searchParams.get("project")

  useEffect(() => {
    const loadedProjects = getProjects()
    setProjects(loadedProjects)

    // Preselect project if specified in query params
    if (preselectedProject && loadedProjects.length > 0) {
      const project = loadedProjects.find((p) => p.slug === preselectedProject)
      if (project) {
        setSelectedProject(project)
      }
    }

    // Load QB events from localStorage
    const savedEvents = localStorage.getItem("qb_events")
    if (savedEvents) {
      setQbEvents(JSON.parse(savedEvents))
    }
  }, [preselectedProject])

  const handleSignOff = (milestone: Milestone) => {
    if (!selectedProject) return

    const eventId = `QB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Update milestone
    const updatedMilestones = selectedProject.milestones.map((m) =>
      m.id === milestone.id
        ? {
            ...m,
            status: m.status === "pending" ? ("completed" as const) : m.status,
            meta: {
              ...m.meta,
              qbSignedOff: true,
              qbEventId: eventId,
            },
          }
        : m,
    )

    // Update project
    const updatedProject = {
      ...selectedProject,
      milestones: updatedMilestones,
      lastUpdated: Date.now(),
    }

    updateProject(selectedProject.id, updatedProject)
    addActivity(selectedProject.id, {
      timestamp: Date.now(),
      actor: "user" as const,
      action: "QuickBooks Sign-Off",
      details: `Sign-Off recorded for ${milestone.title}`,
    })

    // Add to QB events
    const newEvent = {
      timestamp: Date.now(),
      project: selectedProject.name,
      milestone: milestone.title,
      eventId,
    }

    const updatedEvents = [newEvent, ...qbEvents].slice(0, 10)
    setQbEvents(updatedEvents)
    localStorage.setItem("qb_events", JSON.stringify(updatedEvents))

    // Refresh projects
    setProjects(getProjects())
    setSelectedProject(getProjects().find((p) => p.id === selectedProject.id) || null)
  }

  const hasReadyForChainlink = projects.some((project) =>
    project.milestones.some((m) => m.meta?.qbSignedOff === true && m.status !== "verified"),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">QuickBooks Demo — Milestone Sign-Offs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedProject?.id || ""}
                onChange={(e) => {
                  const project = projects.find((p) => p.id === e.target.value)
                  setSelectedProject(project || null)
                }}
              >
                <option value="">Select a project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {selectedProject && (
            <Card>
              <CardHeader>
                <CardTitle>Milestones - {selectedProject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">ENS</th>
                        <th className="text-left p-2">Mirror</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProject.milestones.map((milestone) => (
                        <tr key={milestone.id} className="border-b">
                          <td className="p-2 font-medium">{milestone.title}</td>
                          <td className="p-2">${milestone.amount.toLocaleString()}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                milestone.status === "completed"
                                  ? "default"
                                  : milestone.status === "verified"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {milestone.status}
                            </Badge>
                            {milestone.meta?.qbSignedOff && (
                              <Badge variant="outline" className="ml-1 text-xs">
                                QB
                              </Badge>
                            )}
                          </td>
                          <td className="p-2 text-xs text-blue-600">{milestone.ensName}</td>
                          <td className="p-2 text-xs text-purple-600">{milestone.mirrorUrl}</td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              onClick={() => handleSignOff(milestone)}
                              disabled={milestone.meta?.qbSignedOff === true}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {milestone.meta?.qbSignedOff ? "Signed Off" : "Record QuickBooks Sign-Off"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Event Log
                {hasReadyForChainlink && (
                  <Badge className="bg-green-100 text-green-800">Ready for Chainlink Ingest</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {qbEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No QuickBooks events yet</p>
                ) : (
                  qbEvents.map((event, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4 py-2">
                      <div className="text-sm">
                        <span className="text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                        <span className="mx-2">—</span>
                        <span className="font-medium">{event.project}</span>
                        <span className="mx-2">—</span>
                        <span>{event.milestone}</span>
                        <span className="mx-2">—</span>
                        <span className="text-blue-600">Sign-Off</span>
                        <span className="mx-2">—</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{event.eventId}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
