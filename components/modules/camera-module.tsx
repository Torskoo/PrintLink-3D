"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Maximize2, RotateCcw, Video } from "lucide-react"
import { useState } from "react"

export function CameraModule() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // TODO: Replace with actual camera stream URL
  const streamUrl = "/3d-printer-inside-enclosure-with-blue-led-lighting.jpg"

  return (
    <Card className="col-span-2 row-span-2 bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Camera className="h-4 w-4 text-primary" />
          Flux Caméra
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsRecording(!isRecording)}>
            <Video className={`h-4 w-4 ${isRecording ? "text-destructive animate-pulse" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullscreen(!isFullscreen)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative aspect-video rounded-md overflow-hidden bg-secondary">
          <img
            src={streamUrl || "/placeholder.svg"}
            alt="Flux caméra imprimante 3D"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            LIVE
          </div>
          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-destructive/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-destructive-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive-foreground animate-pulse" />
              REC
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
