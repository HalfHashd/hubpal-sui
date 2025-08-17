"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { addProject } from "@/lib/store"
import { slugify } from "@/lib/utils"
import type { Project, Milestone } from "@/lib/types"

interface MilestoneForm {
  title: string
  amount: number
}

const TEMPLATE_MILESTONES = [
  { title: "Planning", percentage: 20 },
  { title: "Prototype", percentage: 25 },
  { title: "MVP", percentage: 30 },
  { title: "Production", percentage: 25 },
]

export default function CreateProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    totalBudget: 0,
  })
  const [milestoneMode, setMilestoneMode] = useState<"template" | "custom">("template")
  const [templateMilestones, setTemplateMilestones] = useState<MilestoneForm[]>(
    TEMPLATE_MILESTONES.map((m) => ({ title: m.title, amount: 0 })),
  )
  const [customMilestones, setCustomMilestones] = useState<MilestoneForm[]>([{ title: "", amount: 0 }])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update template milestone amounts when total budget changes
  const updateTemplateBudgets = (totalBudget: number) => {
    setTemplateMilestones((prev) =>
      prev.map((milestone, index) => ({
        ...milestone,
        amount: Math.round((totalBudget * TEMPLATE_MILESTONES[index].percentage) / 100),
      })),
    )
  }

  const handleBudgetChange = (value: string) => {
    const budget = Number.parseFloat(value) || 0
    setFormData((prev) => ({ ...prev, totalBudget: budget }))
    if (milestoneMode === "template") {
      updateTemplateBudgets(budget)
    }
  }

  const handleTemplateMilestoneChange = (index: number, amount: number) => {
    setTemplateMilestones((prev) => prev.map((milestone, i) => (i === index ? { ...milestone, amount } : milestone)))
  }

  const addCustomMilestone = () => {
    setCustomMilestones((prev) => [...prev, { title: "", amount: 0 }])
  }

  const removeCustomMilestone = (index: number) => {
    if (customMilestones.length > 1) {
      setCustomMilestones((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const updateCustomMilestone = (index: number, field: "title" | "amount", value: string | number) => {
    setCustomMilestones((prev) =>
      prev.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone)),
    )
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }
    if (!formData.totalBudget || formData.totalBudget <= 0) {
      newErrors.totalBudget = "Total budget must be greater than 0"
    }

    // Get current milestones
    const currentMilestones = milestoneMode === "template" ? templateMilestones : customMilestones

    // Validate milestones
    if (currentMilestones.length === 0) {
      newErrors.milestones = "At least one milestone is required"
    } else {
      // Check for empty titles in custom mode
      if (milestoneMode === "custom") {
        const hasEmptyTitles = currentMilestones.some((m) => !m.title.trim())
        if (hasEmptyTitles) {
          newErrors.milestones = "All milestone titles are required"
        }
      }

      // Validate milestone amounts sum
      const totalMilestoneAmount = currentMilestones.reduce((sum, m) => sum + m.amount, 0)
      const difference = Math.abs(totalMilestoneAmount - formData.totalBudget)
      if (difference > 1) {
        newErrors.milestones = `Milestone amounts must sum to total budget (currently ${totalMilestoneAmount})`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const slug = slugify(formData.name)
      const currentMilestones = milestoneMode === "template" ? templateMilestones : customMilestones

      // Generate milestones with ENS names and Mirror URLs
      const milestones: Milestone[] = currentMilestones.map((milestone, index) => {
        const milestoneSlug = slugify(milestone.title)
        return {
          id: `${slug}-milestone-${index + 1}`,
          title: milestone.title,
          amount: milestone.amount,
          status: "pending" as const,
          ensName: `${milestoneSlug}.${slug}.hubpal.eth`,
          mirrorUrl: `/eth/${slug}/${milestoneSlug}`,
          artifactWalrusId: undefined,
        }
      })

      const project: Project = {
        id: `project-${Date.now()}`,
        slug,
        name: formData.name,
        description: formData.description,
        totalBudget: formData.totalBudget,
        milestones,
        fundsRaised: 0,
        lastUpdated: Date.now(),
        activity: [
          {
            id: `activity-${Date.now()}`,
            type: "project_created",
            message: `Project "${formData.name}" was created`,
            timestamp: Date.now(),
          },
        ],
      }

      addProject(project)
      router.push(`/project/${slug}`)
    } catch (error) {
      console.error("Error creating project:", error)
      setErrors({ submit: "Failed to create project. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentMilestones = milestoneMode === "template" ? templateMilestones : customMilestones

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Project</h1>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project"
              rows={4}
            />
          </div>

          {/* Total Budget */}
          <div className="space-y-2">
            <Label htmlFor="totalBudget">Total Budget *</Label>
            <Input
              id="totalBudget"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalBudget || ""}
              onChange={(e) => handleBudgetChange(e.target.value)}
              placeholder="0.00"
              className={errors.totalBudget ? "border-red-500" : ""}
            />
            {errors.totalBudget && <p className="text-sm text-red-500">{errors.totalBudget}</p>}
          </div>

          {/* Milestones Mode */}
          <div className="space-y-4">
            <Label>Milestones Mode</Label>
            <RadioGroup
              value={milestoneMode}
              onValueChange={(value: "template" | "custom") => {
                setMilestoneMode(value)
                if (value === "template" && formData.totalBudget > 0) {
                  updateTemplateBudgets(formData.totalBudget)
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="template" id="template" />
                <Label htmlFor="template">Use Template</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestoneMode === "template" ? (
                // Template Milestones
                <div className="space-y-4">
                  {templateMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{milestone.title}</Label>
                        <p className="text-xs text-muted-foreground">
                          {TEMPLATE_MILESTONES[index].percentage}% of total budget
                        </p>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={milestone.amount || ""}
                          onChange={(e) => handleTemplateMilestoneChange(index, Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Custom Milestones
                <div className="space-y-4">
                  {customMilestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateCustomMilestone(index, "title", e.target.value)}
                          placeholder="Milestone title"
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={milestone.amount || ""}
                          onChange={(e) =>
                            updateCustomMilestone(index, "amount", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      {customMilestones.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeCustomMilestone(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCustomMilestone}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
              )}

              {/* Milestone Summary */}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Total Milestone Amount:</span>
                  <span className="font-medium">
                    {currentMilestones.reduce((sum, m) => sum + m.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Budget:</span>
                  <span className="font-medium">{formData.totalBudget.toFixed(2)}</span>
                </div>
              </div>

              {errors.milestones && <p className="text-sm text-red-500">{errors.milestones}</p>}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Project..." : "Create Project"}
            </Button>
            {errors.submit && <p className="text-sm text-red-500 mt-2">{errors.submit}</p>}
          </div>
        </form>
      </div>
    </div>
  )
}
