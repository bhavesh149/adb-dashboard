import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Activity {
  user: string
  action: string
  time: string
  avatar: string
}

interface ActivityFeedProps {
  data: Activity[]
  isLoading?: boolean
}

export function ActivityFeed({ data, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 sm:h-5 w-[120px] sm:w-[150px]" />
          <Skeleton className="h-3 sm:h-4 w-[160px] sm:w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 sm:space-x-4">
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3 sm:h-4 w-[150px] sm:w-[200px]" />
                <Skeleton className="h-2 sm:h-3 w-[80px] sm:w-[100px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
        <CardDescription className="text-sm">Latest user activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {data.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 sm:space-x-4">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {activity.user
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm leading-none">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
