"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScoreBreakdownProps {
  credentialComponent: number
  contentComponent: number
  engagementComponent: number
  consistencyComponent: number
}

export function ScoreBreakdown({
  credentialComponent,
  contentComponent,
  engagementComponent,
  consistencyComponent,
}: ScoreBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Creator Credentials</span>
          <span className="font-medium">{Math.round(credentialComponent)}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Content Quality</span>
          <span className="font-medium">{Math.round(contentComponent)}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Engagement Rate</span>
          <span className="font-medium">{Math.round(engagementComponent)}/100</span>
        </div>
        <div className="flex justify-between">
          <span>Channel Consistency</span>
          <span className="font-medium">{Math.round(consistencyComponent)}/100</span>
        </div>
      </CardContent>
    </Card>
  )
}
