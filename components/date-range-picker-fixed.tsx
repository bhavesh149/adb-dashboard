"use client"

import * as React from "react"
import { addDays, format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (range: DateRange | undefined) => void
}

export function CalendarDateRangePicker({ className, onDateChange }: CalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const { toast } = useToast()

  React.useEffect(() => {
    onDateChange?.(date)
  }, [date, onDateChange])

  const handlePresetSelect = (preset: string) => {
    const today = new Date()
    let newRange: DateRange | undefined

    switch (preset) {
      case "today":
        newRange = { from: today, to: today }
        break
      case "yesterday":
        const yesterday = subDays(today, 1)
        newRange = { from: yesterday, to: yesterday }
        break
      case "last7days":
        newRange = { from: subDays(today, 6), to: today }
        break
      case "last30days":
        newRange = { from: subDays(today, 29), to: today }
        break
      case "last90days":
        newRange = { from: subDays(today, 89), to: today }
        break
      case "thismonth":
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        newRange = { from: firstDayOfMonth, to: today }
        break
      case "lastmonth":
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        newRange = { from: firstDayOfLastMonth, to: lastDayOfLastMonth }
        break
      default:
        return
    }

    setDate(newRange)
    toast({
      title: "Date Range Updated",
      description: `Filter applied for ${preset.replace(/([A-Z])/g, ' $1').toLowerCase()}`
    })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="border-r">
              <div className="p-3">
                <h4 className="font-medium text-sm mb-2">Quick Select</h4>
                <div className="space-y-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("yesterday")}
                  >
                    Yesterday
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("last7days")}
                  >
                    Last 7 days
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("last30days")}
                  >
                    Last 30 days
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("last90days")}
                  >
                    Last 90 days
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("thismonth")}
                  >
                    This month
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-8"
                    onClick={() => handlePresetSelect("lastmonth")}
                  >
                    Last month
                  </Button>
                </div>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(range) => {
                setDate(range)
                if (range?.from && range?.to) {
                  toast({
                    title: "Custom Date Range Selected",
                    description: `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd, yyyy")}`
                  })
                }
              }}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
