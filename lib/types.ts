export interface Milestone {
  id: string
  title: string
  amount: number
  status: "pending" | "completed" | "verified"
  ensName: string
  mirrorUrl: string
  artifactWalrusId?: string
}

export interface Project {
  id: string
  slug: string
  name: string
  description: string
  totalBudget: number
  milestones: Milestone[]
  fundsRaised: number
  lastUpdated: number
}
