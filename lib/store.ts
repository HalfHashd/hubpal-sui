import type { Project, Milestone } from "./types"
import { slugify } from "./utils"

const STORAGE_KEY = "hubpal_v2"

function createDemoProjects(): Project[] {
  const demoProjects = [
    {
      name: "Solar Farm Buildout",
      description: "Building a 50MW solar farm to power 15,000 homes with clean renewable energy.",
      totalBudget: 120000,
      milestones: ["Planning", "Permits", "Construction", "Grid Connection"],
    },
    {
      name: "Community Café",
      description: "Opening a neighborhood café that serves locally sourced food and supports local artists.",
      totalBudget: 45000,
      milestones: ["Business Plan", "Location Setup", "Equipment", "Grand Opening"],
    },
    {
      name: "DeFi Analytics App",
      description: "Real-time analytics dashboard for DeFi protocols with portfolio tracking and yield optimization.",
      totalBudget: 85000,
      milestones: ["MVP Development", "Beta Testing", "Security Audit", "Public Launch"],
    },
    {
      name: "Charity Water Well",
      description: "Drilling clean water wells in rural communities to provide access to safe drinking water.",
      totalBudget: 35000,
      milestones: ["Site Survey", "Drilling", "Pump Installation", "Community Training"],
    },
    {
      name: "VR Learning Hub",
      description: "Immersive VR educational platform for STEM subjects with interactive 3D simulations.",
      totalBudget: 95000,
      milestones: ["Content Creation", "VR Development", "User Testing", "School Partnerships"],
    },
    {
      name: "Local Restaurant Remodel",
      description: "Complete renovation of family restaurant with modern kitchen and expanded seating.",
      totalBudget: 65000,
      milestones: ["Design Phase", "Permits & Demo", "Construction", "Final Touches"],
    },
  ]

  return demoProjects.map((demo, index) => {
    const slug = slugify(demo.name)
    const milestoneAmounts = [
      Math.floor(demo.totalBudget * 0.2),
      Math.floor(demo.totalBudget * 0.25),
      Math.floor(demo.totalBudget * 0.3),
      demo.totalBudget - Math.floor(demo.totalBudget * 0.75), // Remaining amount
    ]

    const milestones: Milestone[] = demo.milestones.map((title, i) => {
      const milestoneSlug = slugify(title)
      // Random completion states - some projects more complete than others
      const completionRate = Math.random()
      let status: "pending" | "completed" | "verified" = "pending"
      if (i < Math.floor(demo.milestones.length * completionRate)) {
        status = Math.random() > 0.7 ? "verified" : "completed"
      }

      return {
        id: `milestone-${index}-${i}`,
        title,
        amount: milestoneAmounts[i],
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
      lastUpdated: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
      activity: [],
    }
  })
}

class HubPalStore {
  private projects: Project[] = []

  constructor() {
    this.loadFromStorage()
    if (this.projects.length === 0) {
      this.projects = createDemoProjects()
      this.saveToStorage()
    }
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
