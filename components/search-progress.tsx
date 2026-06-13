"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Loader2 } from "lucide-react"

interface SearchProgressProps {
  currentStep: number
}

const steps = [
  { label: "Searching YouTube...", icon: Loader2 },
  { label: "Verifying creator credentials...", icon: Loader2 },
  { label: "Analyzing video content...", icon: Loader2 },
  { label: "Ranking by trust score...", icon: Loader2 },
]

export function SearchProgress({ currentStep }: SearchProgressProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <div key={index} className="flex items-center gap-3">
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-300" />
                )}
                <span
                  className={
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-blue-600 font-medium"
                      : "text-gray-400"
                  }
                >
                  Step {index + 1}: {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
