"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreBreakdownProps {
  credentialScore: number
  contentScore: number
  engagementScore: number
  consistencyScore: number
}

export function ScoreBreakdown({
  credentialScore,
  contentScore,
  engagementScore,
  consistencyScore,
}: ScoreBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Creator Credentials (35%)</span>
          <span className="font-medium">{credentialScore}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Content Quality (35%)</span>
          <span className="font-medium">{contentScore}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Engagement Rate (20%)</span>
          <span className="font-medium">{engagementScore}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Channel Consistency (10%)</span>
          <span className="font-medium">{consistencyScore}/100</span>
        </div>
      </CardContent>
    </Card>
  )
}
