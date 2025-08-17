"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getProjects } from "@/lib/store"
import type { Project } from "@/lib/types"

export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const calculateProgress = (project: Project) => {
    const completedMilestones = project.milestones.filter((m) => m.status === "completed" || m.status === "verified")
    return (completedMilestones.length / project.milestones.length) * 100
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button asChild>
          <Link href="/create">Create New Project</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const progress = calculateProgress(project)
          const completedMilestones = project.milestones.filter(
            (m) => m.status === "completed" || m.status === "verified",
          ).length

          return (
            <Link key={project.id} href={`/project/${project.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  {/* Placeholder thumbnail */}
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md mb-3 flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-400">{project.name.charAt(0)}</div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {completedMilestones} of {project.milestones.length} milestones complete
                    </p>
                  </div>

                  {/* Budget summary */}
                  <p className="text-sm font-medium">
                    {formatBudget(project.fundsRaised)} of {formatBudget(project.totalBudget)} raised
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
