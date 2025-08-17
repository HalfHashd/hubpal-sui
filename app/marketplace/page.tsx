"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getProjects, seedDemoProjects, isStoreEmpty } from "@/lib/store"
import type { Project } from "@/lib/types"

type FilterType = "all" | "active" | "funded"

export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [showLoadDemo, setShowLoadDemo] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProjects = () => {
      const allProjects = getProjects()
      setProjects(allProjects)
      setShowLoadDemo(isStoreEmpty())
    }

    loadProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply status filter
    switch (activeFilter) {
      case "active":
        filtered = filtered.filter((project) => {
          const allCompleted = project.milestones.every((m) => m.status === "completed" || m.status === "verified")
          return !allCompleted
        })
        break
      case "funded":
        filtered = filtered.filter((project) => project.fundsRaised >= project.totalBudget)
        break
      default:
        break
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, activeFilter])

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

  const handleLoadDemo = () => {
    seedDemoProjects()
    const allProjects = getProjects()
    setProjects(allProjects)
    setShowLoadDemo(false)
  }

  const handleQBClick = (e: React.MouseEvent, projectSlug: string) => {
    e.stopPropagation()
    e.preventDefault()
    router.push(`/quickbooks?project=${projectSlug}`)
  }

  const handleResetDemo = () => {
    localStorage.removeItem("hubpal_v2")
    localStorage.removeItem("hubpal_v2_qb_demo_seeded")
    seedDemoProjects()
    const allProjects = getProjects()
    setProjects(allProjects)
    setShowLoadDemo(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div className="flex gap-3 items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/quickbooks">QuickBooks Demo</Link>
          </Button>
          <Button asChild>
            <Link href="/create">Create New Project</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-sm"
          />

          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "funded" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("funded")}
            >
              Funded
            </Button>
          </div>
        </div>

        {showLoadDemo && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No projects found. Load some demo projects to get started.</p>
            <Button onClick={handleLoadDemo} variant="outline">
              Load Demo Projects
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const progress = calculateProgress(project)
          const completedMilestones = project.milestones.filter(
            (m) => m.status === "completed" || m.status === "verified",
          ).length

          const hasQBSignOff = project.milestones.some((m) => m.meta?.qbSignedOff === true)

          return (
            <Link key={project.id} href={`/project/${project.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md mb-3 flex items-center justify-center">
                    <div className="text-3xl font-bold text-gray-500">{project.name.charAt(0)}</div>
                  </div>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight flex-1">{project.name}</CardTitle>
                    {hasQBSignOff && (
                      <Badge variant="outline" className="ml-2 text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                        QB sign-off pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description.length > 80
                      ? `${project.description.substring(0, 80)}...`
                      : project.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {completedMilestones}/{project.milestones.length} milestones
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      Raised {formatBudget(project.fundsRaised)} / {formatBudget(project.totalBudget)}
                    </p>
                    <div className="flex gap-2 items-center">
                      {project.fundsRaised >= project.totalBudget && (
                        <Badge variant="secondary" className="text-xs">
                          Funded
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-6 bg-transparent"
                        onClick={(e) => handleQBClick(e, project.slug)}
                      >
                        QB
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">Updated {formatRelativeTime(project.lastUpdated)}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {!showLoadDemo && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects match your current filters.</p>
        </div>
      )}

      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <button
          onClick={handleResetDemo}
          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  )
}
