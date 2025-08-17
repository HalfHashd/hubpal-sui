"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getProjects, updateProject, addActivity } from "@/lib/store"
import type { Project } from "@/lib/types"

export default function PYUSDDemoPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>("")
  const [paymentMode, setPaymentMode] = useState<"full" | "installments">("full")
  const [installmentProgress, setInstallmentProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const selectedProject = projects.find((p) => p.id === selectedProjectId)
  const selectedMilestone = selectedProject?.milestones.find((m) => m.id === selectedMilestoneId)
  const milestoneKey = `${selectedProjectId}-${selectedMilestoneId}`
  const currentInstallments = installmentProgress[milestoneKey] || 0

  const handlePayInstallment = () => {
    if (!selectedProject || !selectedMilestone) return

    const newInstallments = currentInstallments + 1
    const installmentAmount = selectedMilestone.amount / 4
    const totalPaid = installmentAmount * newInstallments

    setInstallmentProgress((prev) => ({
      ...prev,
      [milestoneKey]: newInstallments,
    }))

    const updatedProject = {
      ...selectedProject,
      fundsRaised: selectedProject.fundsRaised + installmentAmount,
      lastUpdated: Date.now(),
    }

    addActivity(selectedProject.id, {
      type: "payment",
      description: `PYUSD installment paid (${newInstallments}/4)`,
      timestamp: Date.now(),
    })

    if (selectedMilestone.status === "pending" && totalPaid >= selectedMilestone.amount) {
      const updatedMilestones = selectedProject.milestones.map((m) =>
        m.id === selectedMilestone.id ? { ...m, status: "completed" as const } : m,
      )
      updatedProject.milestones = updatedMilestones

      addActivity(selectedProject.id, {
        type: "milestone",
        description: `Release funds to ${selectedMilestone.ensName}`,
        timestamp: Date.now(),
      })
    }

    updateProject(selectedProject.id, updatedProject)
    setProjects(getProjects())
  }

  const handlePayFull = () => {
    if (!selectedProject || !selectedMilestone) return

    const updatedMilestones = selectedProject.milestones.map((m) =>
      m.id === selectedMilestone.id ? { ...m, status: "completed" as const } : m,
    )

    const updatedProject = {
      ...selectedProject,
      milestones: updatedMilestones,
      fundsRaised: selectedProject.fundsRaised + selectedMilestone.amount,
      lastUpdated: Date.now(),
    }

    updateProject(selectedProject.id, updatedProject)

    addActivity(selectedProject.id, {
      type: "payment",
      description: "PYUSD full payment received",
      timestamp: Date.now(),
    })

    addActivity(selectedProject.id, {
      type: "milestone",
      description: `Release funds to ${selectedMilestone.ensName}`,
      timestamp: Date.now(),
    })

    setProjects(getProjects())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">PYUSD Demo</h1>

      <div className="grid gap-6 max-w-4xl">
        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Project & Milestone</CardTitle>
            <CardDescription>Choose a project and milestone to simulate PYUSD payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-select">Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <div>
                <Label htmlFor="milestone-select">Milestone</Label>
                <Select value={selectedMilestoneId} onValueChange={setSelectedMilestoneId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProject.milestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        <div className="flex items-center gap-2">
                          {milestone.title} - ${milestone.amount.toLocaleString()}
                          <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                            {milestone.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Mode */}
        {selectedMilestone && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Mode</CardTitle>
              <CardDescription>Choose how to pay for this milestone</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMode} onValueChange={(value: "full" | "installments") => setPaymentMode(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Pay in Full (${selectedMilestone.amount.toLocaleString()})</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="installments" id="installments" />
                  <Label htmlFor="installments">
                    Installments (4 payments of ${(selectedMilestone.amount / 4).toLocaleString()})
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Payment Interface */}
        {selectedMilestone && (
          <Card>
            <CardHeader>
              <CardTitle>PYUSD Payment</CardTitle>
              <CardDescription>
                Milestone: {selectedMilestone.title} • ENS: {selectedMilestone.ensName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMode === "installments" ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Installment Progress</span>
                      <span>{currentInstallments}/4 paid</span>
                    </div>
                    <Progress value={(currentInstallments / 4) * 100} className="h-2" />
                  </div>

                  {currentInstallments < 4 && (
                    <Button
                      onClick={handlePayInstallment}
                      className="w-full"
                      disabled={selectedMilestone.status === "completed"}
                    >
                      Pay Next Installment (${(selectedMilestone.amount / 4).toLocaleString()})
                    </Button>
                  )}

                  {currentInstallments === 4 && (
                    <div className="text-center text-green-600 font-medium">
                      ✅ All installments paid! Funds released.
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={handlePayFull} className="w-full" disabled={selectedMilestone.status === "completed"}>
                  Pay Full Amount (${selectedMilestone.amount.toLocaleString()})
                </Button>
              )}

              {selectedMilestone.status === "completed" && (
                <div className="text-center text-green-600 font-medium">
                  ✅ Milestone completed! Funds have been released.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Panel */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>PYUSD Integration:</strong> This demo simulates PayPal USD stablecoin payments with installment
                options. In production, this would integrate with PayPal's PYUSD smart contracts for automated milestone
                releases and cross-border payments with reduced fees.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
