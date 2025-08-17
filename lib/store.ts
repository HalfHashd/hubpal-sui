import type { Project, Milestone } from "./types"

const STORAGE_KEY = "hubpal_v2"

class HubPalStore {
  private projects: Project[] = []

  constructor() {
    this.loadFromStorage()
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
