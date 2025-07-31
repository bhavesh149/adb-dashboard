import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Sale {
  name: string
  email: string
  amount: string
  avatar: string
}

interface RecentSalesProps {
  data: Sale[]
  isLoading?: boolean
}

export function RecentSales({ data, isLoading = false }: RecentSalesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
            <div className="ml-3 sm:ml-4 space-y-1 flex-1">
              <Skeleton className="h-3 sm:h-4 w-[100px] sm:w-[120px]" />
              <Skeleton className="h-2 sm:h-3 w-[80px] sm:w-[100px]" />
            </div>
            <Skeleton className="h-3 sm:h-4 w-[50px] sm:w-[60px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {data.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            <AvatarImage src={sale.avatar || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback className="text-xs sm:text-sm">
              {sale.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium leading-none truncate">{sale.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{sale.email}</p>
          </div>
          <div className="text-xs sm:text-sm font-medium text-right">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}
