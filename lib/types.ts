export interface Milestone {
  id: string
  title: string
  amount: number
  status: "pending" | "completed" | "verified"
  ensName: string
  mirrorUrl: string
  artifactWalrusId?: string
}

export interface ActivityEntry {
  timestamp: number
  actor: "user"
  action: string
  details: string
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
  activity: ActivityEntry[]
}
