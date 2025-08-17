import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateEnsSubnames(projectName: string, milestoneTitles: string[]): string[] {
  const projectSlug = slugify(projectName)
  return milestoneTitles.map((title) => {
    const milestoneSlug = slugify(title)
    return `${milestoneSlug}.${projectSlug}.hubpal.eth`
  })
}

export function generateMirrorUrls(projectName: string, milestone: string): string {
  const projectSlug = slugify(projectName)
  const milestoneSlug = slugify(milestone)
  return `/eth/${projectSlug}/${milestoneSlug}`
}
