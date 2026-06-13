"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface RedFlagAlertProps {
  flags: string[]
}

export function RedFlagAlert({ flags }: RedFlagAlertProps) {
  if (!flags || flags.length === 0) return null

  const formatFlag = (flag: string): string => {
    return flag
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="space-y-1">
            {flags.map((flag) => (
              <Badge key={flag} variant="destructive" className="mr-2">
                {formatFlag(flag)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
