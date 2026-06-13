"use client"

import { Badge } from "@/components/ui/badge"

interface TrustBadgeProps {
  score: number
  size?: "sm" | "lg"
}

function getScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

function getScoreLabel(score: number): string {
  if (score >= 70) return "Highly Trustworthy"
  if (score >= 40) return "Moderately Trustworthy"
  return "Low Trust"
}

export function TrustBadge({ score, size = "sm" }: TrustBadgeProps) {
  if (size === "sm") {
    return (
      <Badge className={`${getScoreColor(score)} text-white`}>
        {score}
      </Badge>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Badge className={`${getScoreColor(score)} text-white text-lg`}>
          {score}
        </Badge>
        <span className="font-medium">{getScoreLabel(score)}</span>
      </div>
    </div>
  )
}
