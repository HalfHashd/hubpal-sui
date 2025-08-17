"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Upload, FileText, ImageIcon, Video } from "lucide-react"
import { getProjects, addActivity } from "@/lib/store"

interface StoredFile {
  id: string
  name: string
  type: "document" | "image" | "video"
  size: string
  walrusId: string
  uploadedAt: number
  projectId?: string
}

export default function WalrusDemoPage() {
  const [selectedProject, setSelectedProject] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileDescription, setFileDescription] = useState("")
  const [fileType, setFileType] = useState<"document" | "image" | "video">("document")
  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([
    {
      id: "1",
      name: "project-whitepaper.pdf",
      type: "document",
      size: "2.4 MB",
      walrusId: "walrus_abc123def456",
      uploadedAt: Date.now() - 86400000,
      projectId: "defi-yield-optimizer",
    },
    {
      id: "2",
      name: "demo-video.mp4",
      type: "video",
      size: "15.2 MB",
      walrusId: "walrus_xyz789ghi012",
      uploadedAt: Date.now() - 172800000,
      projectId: "nft-marketplace",
    },
  ])

  const projects = getProjects()

  const handleUpload = () => {
    if (!fileName.trim()) return

    const newFile: StoredFile = {
      id: Date.now().toString(),
      name: fileName,
      type: fileType,
      size: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
      walrusId: `walrus_${Math.random().toString(36).substr(2, 12)}`,
      uploadedAt: Date.now(),
      projectId: selectedProject || undefined,
    }

    setStoredFiles((prev) => [newFile, ...prev])

    // Add activity if project selected
    if (selectedProject) {
      addActivity(selectedProject, {
        type: "milestone_update",
        description: `Artifact uploaded to Walrus: ${fileName}`,
        timestamp: Date.now(),
      })
    }

    // Reset form
    setFileName("")
    setFileDescription("")
    setSelectedProject("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Walrus Demo</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload to Walrus
            </CardTitle>
            <CardDescription>Simulate uploading project artifacts to decentralized storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="project-select">Link to Project (Optional)</Label>
              <select
                id="project-select"
                className="w-full mt-1 p-2 border rounded-md"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">No project selected</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="file-name">File Name</Label>
              <Input
                id="file-name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g., milestone-report.pdf"
              />
            </div>

            <div>
              <Label htmlFor="file-type">File Type</Label>
              <select
                id="file-type"
                className="w-full mt-1 p-2 border rounded-md"
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
              >
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Brief description of the file..."
                rows={3}
              />
            </div>

            <Button onClick={handleUpload} className="w-full" disabled={!fileName.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload to Walrus
            </Button>
          </CardContent>
        </Card>

        {/* Stored Files Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Stored Files</CardTitle>
            <CardDescription>Files stored on Walrus decentralized storage network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file.type)}
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.size} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {file.type}
                    </Badge>
                  </div>

                  {file.projectId && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Linked to: {projects.find((p) => p.id === file.projectId)?.name}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1">{file.walrusId}</code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(file.walrusId)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Strip */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm text-blue-800">
            <strong>Walrus Integration:</strong> In production, files would be stored on the Walrus decentralized
            storage network with cryptographic proofs of availability. Walrus IDs can be stored in milestone artifacts
            for permanent, censorship-resistant access to project deliverables.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
