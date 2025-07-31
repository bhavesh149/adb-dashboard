"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import { Download, Users, CreditCard, Activity, DollarSign, TrendingUp, Eye, MousePointer, RefreshCw, FileBarChart } from "lucide-react"
import { MetricCard } from "@/components/metric-card"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { dashboardAPI, formatCurrency, formatPercentage, type DashboardData } from "@/lib/api"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { TopChannels } from "@/components/top-channels"
import { ActivityFeed } from "@/components/activity-feed"
import { useToast } from "@/hooks/use-toast"
import { useTeam } from "@/lib/team-context"
import { Badge } from "@/components/ui/badge"
import { ConnectionStatus } from "@/components/connection-status"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState<any>(null)
  const { toast } = useToast()
  const { selectedTeam } = useTeam()

  const handleDateRangeChange = useCallback((range: any) => {
    const prevRange = dateRange
    setDateRange(range)
    
    // Only show toast if this is a user-initiated change (not initial load)
    if (prevRange && range?.from && range?.to) {
      toast({
        title: "Date Filter Applied",
        description: `Dashboard data updated for ${range.from.toLocaleDateString()} to ${range.to.toLocaleDateString()}`
      })
    }
  }, [dateRange, toast])

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const newData = await dashboardAPI.getInitialData(selectedTeam?.id)
      setData(newData)
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated with latest information."
      })
    } catch (error) {
      console.error('Failed to refresh data:', error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [selectedTeam?.id, toast])

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const initializeData = async () => {
      setIsLoading(true)
      try {
        // Get initial data for selected team
        const initialData = await dashboardAPI.getInitialData(selectedTeam?.id)
        setData(initialData)

        // Subscribe to real-time updates
        unsubscribe = dashboardAPI.subscribe((updatedData) => {
          setData(updatedData)
        })

        toast({
          title: "Dashboard Loaded",
          description: `Showing data for ${selectedTeam?.name || 'Default Team'}`
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please refresh the page.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [toast, selectedTeam?.id]) // Re-run when team changes

  const handleExport = async (format: 'csv' | 'json' = 'csv') => {
    setIsExporting(true)
    try {
      await dashboardAPI.exportData(format)
      toast({
        title: "Export Successful",
        description: `Dashboard data exported as ${format.toUpperCase()} file.`
      })
    } catch (error) {
      console.error('Export failed:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleGenerateReport = async (reportType: 'monthly' | 'customer' | 'revenue') => {
    try {
      toast({
        title: "Generating Report",
        description: `Creating ${reportType} report...`
      })
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a simple report based on current data
      const reportData = {
        reportType,
        generatedAt: new Date().toISOString(),
        team: selectedTeam?.name || 'Default Team',
        metrics: data?.metrics,
        period: dateRange ? `${dateRange.from?.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString()}` : 'Last 30 days'
      }

      const reportContent = JSON.stringify(reportData, null, 2)
      const blob = new Blob([reportContent], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been downloaded.`
      })
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (!data) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-sm font-semibold sm:text-lg md:text-2xl truncate">ADB Insights</h1>
            {selectedTeam && (
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs">
                {selectedTeam.name}
              </Badge>
            )}
            <ConnectionStatus />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <CalendarDateRangePicker onDateChange={handleDateRangeChange} />
              <Button 
                size="sm" 
                variant="outline"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleExport('json')}
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Export JSON</span>
              </Button>
            </div>
            {/* Mobile action menu */}
            <div className="sm:hidden">
              <Button 
                size="sm" 
                variant="outline"
                onClick={refreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-2 sm:p-4 md:p-8 pt-4 sm:pt-6">
        {/* Mobile action bar */}
        <div className="sm:hidden bg-muted/50 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <CalendarDateRangePicker onDateChange={handleDateRangeChange} />
            {selectedTeam && (
              <Badge variant="secondary" className="text-xs">
                {selectedTeam.name}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleExport('json')}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-10 sm:h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Metrics Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Revenue"
                value={formatCurrency(data.metrics.totalRevenue)}
                change={formatPercentage(20.1)}
                changeType="positive"
                icon={DollarSign}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Revenue Details",
                    description: `Total revenue: ${formatCurrency(data.metrics.totalRevenue)} with 20.1% increase from last month`
                  })
                }}
              />
              <MetricCard
                title="New Customers"
                value={data.metrics.newCustomers.toLocaleString()}
                change={formatPercentage(180.1)}
                changeType="positive"
                icon={Users}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Customer Growth",
                    description: `${data.metrics.newCustomers} new customers acquired this month (+180.1%)`
                  })
                }}
              />
              <MetricCard
                title="Active Accounts"
                value={data.metrics.activeAccounts.toLocaleString()}
                change={formatPercentage(19)}
                changeType="positive"
                icon={CreditCard}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Account Activity",
                    description: `${data.metrics.activeAccounts} accounts actively using the platform (+19%)`
                  })
                }}
              />
              <MetricCard
                title="Growth Rate"
                value={`${data.metrics.growthRate.toFixed(1)}%`}
                change="+201"
                changeType="positive"
                icon={Activity}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Growth Analytics",
                    description: `Current growth rate: ${data.metrics.growthRate.toFixed(1)}% month-over-month`
                  })
                }}
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Page Views"
                value="1.2M"
                change="+12.5%"
                changeType="positive"
                icon={Eye}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Page Views Analytics",
                    description: "1.2M page views this month with 12.5% increase"
                  })
                }}
              />
              <MetricCard
                title="Click Rate"
                value="3.2%"
                change="+0.5%"
                changeType="positive"
                icon={MousePointer}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Click Through Rate",
                    description: "3.2% CTR with 0.5% improvement from last month"
                  })
                }}
              />
              <MetricCard
                title="Conversion Rate"
                value="2.4%"
                change="+0.3%"
                changeType="positive"
                icon={TrendingUp}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Conversion Analytics",
                    description: "2.4% conversion rate with 0.3% increase"
                  })
                }}
              />
              <MetricCard
                title="Bounce Rate"
                value="42.1%"
                change="-2.1%"
                changeType="positive"
                icon={Activity}
                isLoading={isLoading}
                onClick={() => {
                  toast({
                    title: "Bounce Rate Improvement",
                    description: "Bounce rate reduced to 42.1% (-2.1% improvement)"
                  })
                }}
              />
            </div>

            {/* Charts and Tables Grid */}
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-7">
              <Card className="col-span-1 xl:col-span-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Revenue Overview</CardTitle>
                  <CardDescription className="text-sm">Monthly revenue for the past year</CardDescription>
                </CardHeader>
                <CardContent className="pl-1 sm:pl-2">
                  <Overview data={data.revenueData} isLoading={isLoading} />
                </CardContent>
              </Card>
              <Card className="col-span-1 xl:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Sales</CardTitle>
                  <CardDescription className="text-sm">You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales data={data.recentSales} isLoading={isLoading} />
                </CardContent>
              </Card>
            </div>

            {/* Additional Content Grid */}
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
              <TopChannels data={data.topChannels} isLoading={isLoading} />
              <ActivityFeed data={data.activityFeed} isLoading={isLoading} />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsCharts data={data} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Monthly Report</CardTitle>
                  <CardDescription className="text-sm">Comprehensive monthly analytics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-sm" 
                    onClick={() => handleGenerateReport('monthly')}
                  >
                    <FileBarChart className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Generate Monthly Report</span>
                    <span className="sm:hidden">Monthly Report</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Customer Report</CardTitle>
                  <CardDescription className="text-sm">Customer behavior analysis and demographics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-sm" 
                    onClick={() => handleGenerateReport('customer')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Generate Customer Report</span>
                    <span className="sm:hidden">Customer Report</span>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Revenue Report</CardTitle>
                  <CardDescription className="text-sm">Revenue breakdown and financial trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full text-sm" 
                    onClick={() => handleGenerateReport('revenue')}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Generate Revenue Report</span>
                    <span className="sm:hidden">Revenue Report</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Notifications</CardTitle>
                <CardDescription className="text-sm">Stay updated with the latest activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.notifications.map((notification, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        notification.type === 'celebration' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="flex-shrink-0 text-xs px-2"
                        onClick={() => {
                          toast({
                            title: "Notification Dismissed",
                            description: "Notification marked as read"
                          })
                        }}
                      >
                        <span className="hidden sm:inline">Mark as Read</span>
                        <span className="sm:hidden">Read</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      toast({
                        title: "All Notifications Cleared",
                        description: "All notifications have been marked as read"
                      })
                    }}
                  >
                    Clear All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
