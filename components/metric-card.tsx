import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  isLoading?: boolean
  onClick?: () => void
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  isLoading = false,
  onClick 
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-3 sm:h-4 w-[80px] sm:w-[100px]" />
          <Skeleton className="h-3 sm:h-4 w-3 sm:w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 sm:h-8 w-[100px] sm:w-[120px] mb-2" />
          <Skeleton className="h-2 sm:h-3 w-[60px] sm:w-[80px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:scale-105"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{title}</CardTitle>
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold truncate">{value}</div>
        <p className={cn("text-xs", changeType === "positive" ? "text-green-600" : "text-red-600")}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  )
}
