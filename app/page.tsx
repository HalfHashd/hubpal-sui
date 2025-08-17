"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getProjects } from "@/lib/store"
import type { Project } from "@/lib/types"

export default function HomePage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([])

  useEffect(() => {
    const projects = getProjects()
    const sortedProjects = projects.sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 3)
    setRecentProjects(sortedProjects)
  }, [])

  const calculateProgress = (project: Project) => {
    const completedMilestones = project.milestones.filter((m) => m.status === "completed" || m.status === "verified")
    return `${completedMilestones.length}/${project.milestones.length}`
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            ENS Projects–Crowdfunding Marketplace and Platform
          </h1>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm py-2 border-b border-gray-200 inline-block px-4">
            Powered by HubPal™.org
          </div>
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

        {recentProjects.length > 0 && (
          <section className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold">Recently Updated</h2>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Card key={project.id} className="text-left">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <Link
                          href={`/project/${project.slug}`}
                          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Progress {calculateProgress(project)}</span>
                          <span>Updated {formatRelativeTime(project.lastUpdated)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
