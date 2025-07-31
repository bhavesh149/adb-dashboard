import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface Channel {
  name: string
  visitors: number
  percentage: number
  change: string
}

interface TopChannelsProps {
  data: Channel[]
  isLoading?: boolean
}

export function TopChannels({ data, isLoading = false }: TopChannelsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 sm:h-5 w-[120px] sm:w-[150px]" />
          <Skeleton className="h-3 sm:h-4 w-[160px] sm:w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 sm:h-4 w-[80px] sm:w-[100px]" />
                <Skeleton className="h-3 sm:h-4 w-[50px] sm:w-[60px]" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Top Channels</CardTitle>
        <CardDescription className="text-sm">Traffic sources performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {data.map((channel, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium truncate pr-2">{channel.name}</span>
              <div className="flex items-center space-x-2 text-right shrink-0">
                <span className="text-xs sm:text-sm">{(channel.visitors || 0).toLocaleString()}</span>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  (channel.change || '').startsWith('+') 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-red-600 bg-red-100'
                }`}>
                  {channel.change || 'N/A'}
                </span>
              </div>
            </div>
            <Progress value={channel.percentage || 0} className="h-1.5 sm:h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
