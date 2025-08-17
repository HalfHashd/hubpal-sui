import type { Project, Milestone } from "./types"
import { slugify } from "./utils"

const STORAGE_KEY = "hubpal_v2"
const SEEDED_KEY = "hubpal_v2_seeded"
const QB_DEMO_SEEDED_KEY = "hubpal_v2_qb_demo_seeded"

function createDemoProjects(): Project[] {
  const demoProjects = [
    {
      name: "Alice's Restaurant",
      description: "Renovating a classic family restaurant with modern amenities and expanded seating capacity.",
      totalBudget: 80000,
      milestones: ["Planning", "Prototype", "MVP", "Production"],
      completionRates: [1, 1, 0.5, 0], // Planning and Prototype done, MVP in progress
    },
    {
      name: "Solar Farm Alpha",
      description: "Building a 100MW solar farm to provide clean energy to 30,000 homes in the region.",
      totalBudget: 250000,
      milestones: ["Site Survey", "Permits", "Construction", "Grid Connection", "Operations"],
      completionRates: [1, 1, 1, 0, 0], // First 3 milestones complete
    },
    {
      name: "Community Well",
      description: "Drilling clean water wells in rural communities to provide access to safe drinking water.",
      totalBudget: 35000,
      milestones: ["Site Survey", "Drilling", "Pump Installation"],
      completionRates: [1, 0, 0], // Only site survey complete
    },
    {
      name: "MoonBags",
      description: "Decentralized portfolio tracking app with advanced analytics and yield farming optimization.",
      totalBudget: 120000,
      milestones: ["Planning", "Prototype", "MVP", "Production"],
      completionRates: [1, 1, 1, 1], // All milestones complete
    },
    {
      name: "Art Studio Renovation",
      description: "Converting an old warehouse into a modern art studio with gallery space and artist workshops.",
      totalBudget: 95000,
      milestones: ["Planning", "Prototype", "MVP", "Production"],
      completionRates: [1, 1, 0, 0], // Planning and Prototype done
    },
    {
      name: "Open-Source Dev Tool",
      description: "Building a comprehensive development toolkit for blockchain developers with IDE integration.",
      totalBudget: 60000,
      milestones: ["Core Development", "Beta Testing", "Public Release"],
      completionRates: [1, 0.5, 0], // Core done, beta in progress
    },
  ]

  return demoProjects.map((demo, index) => {
    const slug = slugify(demo.name)
    const milestoneCount = demo.milestones.length
    const baseAmount = Math.floor(demo.totalBudget / milestoneCount)
    const remainder = demo.totalBudget - baseAmount * milestoneCount

    const milestones: Milestone[] = demo.milestones.map((title, i) => {
      const milestoneSlug = slugify(title)
      const amount = i === milestoneCount - 1 ? baseAmount + remainder : baseAmount

      // Use predefined completion rates
      const completionRate = demo.completionRates[i]
      let status: "pending" | "completed" | "verified" = "pending"
      if (completionRate === 1) {
        status = Math.random() > 0.3 ? "verified" : "completed"
      } else if (completionRate > 0) {
        status = "completed"
      }

      return {
        id: `milestone-${index}-${i}`,
        title,
        amount,
        status,
        ensName: `${milestoneSlug}.${slug}.hubpal.eth`,
        mirrorUrl: `/eth/${slug}/${milestoneSlug}`,
        artifactWalrusId: undefined,
      }
    })

    const completedMilestones = milestones.filter((m) => m.status === "completed" || m.status === "verified")
    const fundsRaised = completedMilestones.reduce((sum, m) => sum + m.amount, 0)

    return {
      id: `project-${index}`,
      slug,
      name: demo.name,
      description: demo.description,
      totalBudget: demo.totalBudget,
      milestones,
      fundsRaised,
      lastUpdated: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      activity: [],
    }
  })
}

function isSeeded(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(SEEDED_KEY) === "true"
}

function markAsSeeded(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SEEDED_KEY, "true")
}

function isQBDemoSeeded(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(QB_DEMO_SEEDED_KEY) === "true"
}

function markQBDemoAsSeeded(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(QB_DEMO_SEEDED_KEY, "true")
}

class HubPalStore {
  private projects: Project[] = []

  constructor() {
    this.loadFromStorage()
    this.seedQBDemo()
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.projects = JSON.parse(stored)
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  getProjects(): Project[] {
    return [...this.projects]
  }

  addProject(project: Project): void {
    this.projects.push(project)
    this.saveToStorage()
  }

  updateProject(projectId: string, patch: Partial<Project>): void {
    const index = this.projects.findIndex((p) => p.id === projectId)
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...patch, lastUpdated: Date.now() }
      this.saveToStorage()
    }
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.find((p) => p.slug === slug)
  }

  markMilestone(projectId: string, milestoneId: string, patch: Partial<Milestone>): void {
    const project = this.projects.find((p) => p.id === projectId)
    if (project) {
      const milestone = project.milestones.find((m) => m.id === milestoneId)
      if (milestone) {
        const oldStatus = milestone.status
        Object.assign(milestone, patch)

        if (patch.status && patch.status !== oldStatus) {
          if (!project.activity) project.activity = []
          project.activity.unshift({
            timestamp: Date.now(),
            actor: "user",
            action: `Milestone ${patch.status}`,
            details: `"${milestone.title}" marked as ${patch.status}`,
          })
        }

        project.lastUpdated = Date.now()
        this.saveToStorage()
      }
    }
  }

  addActivity(projectId: string, details: string): void {
    const project = this.projects.find((p) => p.id === projectId)
    if (project) {
      if (!project.activity) project.activity = []
      project.activity.unshift({
        timestamp: Date.now(),
        actor: "system",
        action: "External Event",
        details,
      })
      project.lastUpdated = Date.now()
      this.saveToStorage()
    }
  }

  seedDemoProjects(): void {
    if (this.projects.length === 0) {
      this.projects = createDemoProjects()
      this.saveToStorage()
      markAsSeeded()
    }
  }

  private seedQBDemo(): void {
    if (isQBDemoSeeded()) return

    const aliceProject = this.projects.find((p) => p.name === "Alice's Restaurant")
    if (aliceProject) {
      const prototypeMilestone = aliceProject.milestones.find((m) => m.title === "Prototype")
      if (prototypeMilestone) {
        // Set QB sign-off metadata
        if (!prototypeMilestone.meta) prototypeMilestone.meta = {}
        prototypeMilestone.meta.qbSignedOff = true
        prototypeMilestone.meta.qbEventId = "QB-DEMO-001"

        // Add activity log
        if (!aliceProject.activity) aliceProject.activity = []
        aliceProject.activity.unshift({
          timestamp: Date.now(),
          actor: "system",
          action: "QuickBooks Integration",
          details: "QuickBooks: Sign-Off recorded for Prototype (preloaded demo)",
        })

        aliceProject.lastUpdated = Date.now()
        this.saveToStorage()
        markQBDemoAsSeeded()
      }
    }
  }

  isEmpty(): boolean {
    return this.projects.length === 0
  }
}

// Singleton instance
export const store = new HubPalStore()

// Helper functions
export const getProjects = () => store.getProjects()
export const addProject = (project: Project) => store.addProject(project)
export const updateProject = (projectId: string, patch: Partial<Project>) => store.updateProject(projectId, patch)
export const getProjectBySlug = (slug: string) => store.getProjectBySlug(slug)
export const markMilestone = (projectId: string, milestoneId: string, patch: Partial<Milestone>) =>
  store.markMilestone(projectId, milestoneId, patch)
export const addActivity = (projectId: string, details: string) => store.addActivity(projectId, details)
export const seedDemoProjects = () => store.seedDemoProjects()
export const isStoreEmpty = () => store.isEmpty()
export const isAlreadySeeded = () => isSeeded()
