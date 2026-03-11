
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
  setMounted(true)
  }, [])

  //if (!mounted) return null
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground" />
    )
  }

 return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      
      {/* Theme Info */}
      <p>Current theme: {theme}</p>

      {/* Theme Controls */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setTheme("light")}>
          Light
        </Button>
        <Button onClick={() => setTheme("dark")}>
          Dark
        </Button>
        <Button variant="outline" onClick={() => setTheme("system")}>
          System
        </Button>
      </div>

      {/* Toast Test */}
      <Button
        variant="default"
        onClick={() =>
          toast.success("Toast system working perfectly 🎉")
        }
      >
        Show Toast
      </Button>

    </div>
  )
}
