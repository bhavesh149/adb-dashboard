// Real-time data API integration with external APIs
import { mockData } from './mock-data'

// Types for our data structures
export interface DashboardMetrics {
  totalRevenue: number
  newCustomers: number
  activeAccounts: number
  growthRate: number
  activeUsers: number
}

export interface RevenueData {
  name: string
  total: number
}

export interface Sale {
  name: string
  email: string
  amount: string
  avatar: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  revenueData: RevenueData[]
  recentSales: Sale[]
  topChannels: any[]
  activityFeed: any[]
  trafficData: any[]
  trafficSources: any[]
  conversionFunnel: any[]
  ageDistribution: any[]
  deviceTypes: any[]
  notifications: any[]
}

// Real API endpoints for external data (using free APIs)
const API_ENDPOINTS = {
  crypto: 'https://api.coindesk.com/v1/bpi/currentprice.json',
  randomUsers: 'https://randomuser.me/api/?results=10',
  jsonPlaceholder: 'https://jsonplaceholder.typicode.com/users',
  quotes: 'https://api.quotable.io/random',
  publicApis: 'https://api.publicapis.org/random?auth=null',
  httpbin: 'https://httpbin.org/uuid'
}

// Simulate real-time data from multiple sources with external API integration
class DashboardAPI {
  private baseData: DashboardData = mockData
  private subscribers: ((data: DashboardData) => void)[] = []
  private realTimeData: any = {}

  constructor() {
    // Initialize real-time data fetching
    this.initializeExternalData()
    // Start real-time updates
    this.startRealTimeUpdates()
  }

  // Initialize external data sources
  private async initializeExternalData() {
    try {
      // Fetch crypto price for revenue simulation
      const cryptoResponse = await fetch(API_ENDPOINTS.crypto).catch(() => null)
      if (cryptoResponse?.ok) {
        const cryptoData = await cryptoResponse.json()
        this.realTimeData.cryptoPrice = parseFloat(cryptoData.bpi.USD.rate.replace(/,/g, ''))
      }

      // Fetch random users for sales data
      const usersResponse = await fetch(API_ENDPOINTS.randomUsers).catch(() => null)
      if (usersResponse?.ok) {
        const usersData = await usersResponse.json()
        this.realTimeData.randomUsers = usersData.results
      }

      // Fetch placeholder users for additional data
      const placeholderResponse = await fetch(API_ENDPOINTS.jsonPlaceholder).catch(() => null)
      if (placeholderResponse?.ok) {
        const placeholderData = await placeholderResponse.json()
        this.realTimeData.placeholderUsers = placeholderData
      }
    } catch (error) {
      console.warn('Some external APIs failed to load, using fallback data')
    }
  }

  // Subscribe to real-time updates
  subscribe(callback: (data: DashboardData) => void) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  // Get initial data with team-specific filtering
  async getInitialData(teamId?: string): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return this.generateRealisticData(teamId)
  }

  // Generate team-specific data
  private generateRealisticData(teamId?: string): DashboardData {
    const now = new Date()
    const variation = this.getTimeBasedVariation()
    
    // Team-specific multipliers
    const teamMultipliers = {
      '1': { revenue: 1.0, customers: 1.0, accounts: 1.0 }, // Personal
      '2': { revenue: 2.5, customers: 3.2, accounts: 2.8 }, // Marketing Team
      '3': { revenue: 1.8, customers: 2.1, accounts: 1.9 }  // Analytics Team
    } as const

    const multiplier = teamMultipliers[teamId as keyof typeof teamMultipliers] || teamMultipliers['1']
    
    // Use crypto price influence for revenue if available
    const cryptoInfluence = this.realTimeData.cryptoPrice 
      ? (this.realTimeData.cryptoPrice / 45000) // Normalize Bitcoin price
      : 1

    return {
      ...this.baseData,
      metrics: {
        totalRevenue: (this.baseData.metrics.totalRevenue * multiplier.revenue * cryptoInfluence) + (Math.random() * 1000 * variation),
        newCustomers: Math.floor(this.baseData.metrics.newCustomers * multiplier.customers + Math.random() * 50 * variation),
        activeAccounts: Math.floor(this.baseData.metrics.activeAccounts * multiplier.accounts + Math.random() * 100 * variation),
        growthRate: Math.max(0, this.baseData.metrics.growthRate + (Math.random() - 0.5) * 2),
        activeUsers: Math.floor(this.baseData.metrics.activeUsers * multiplier.customers + Math.random() * 20 * variation)
      },
      revenueData: this.generateRevenueData(multiplier.revenue),
      recentSales: this.generateRecentSales(),
      trafficData: this.generateTrafficData(),
      activityFeed: this.generateActivityFeed(),
      topChannels: this.generateTopChannels(),
      notifications: this.generateNotifications()
    }
  }

  // Get time-based variation (higher during business hours)
  private getTimeBasedVariation(): number {
    const hour = new Date().getHours()
    if (hour >= 9 && hour <= 17) {
      return 1.5 // Business hours - more activity
    } else if (hour >= 6 && hour <= 22) {
      return 1.0 // Normal hours
    } else {
      return 0.3 // Night time - less activity
    }
  }

  // Generate realistic revenue data with team multipliers
  private generateRevenueData(teamMultiplier: number = 1): RevenueData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      let base = (3000 + (index * 200)) * teamMultiplier // Growth trend with team multiplier
      if (index <= currentMonth) {
        base += Math.random() * 1000 // Current year variation
      }
      return {
        name: month,
        total: Math.floor(base)
      }
    })
  }

  // Generate realistic recent sales using external API data
  private generateRecentSales(): Sale[] {
    // Use real user data if available, otherwise fallback to generated names
    if (this.realTimeData.randomUsers?.length > 0) {
      return this.realTimeData.randomUsers.slice(0, 5).map((user: any) => ({
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        amount: `+$${(Math.random() * 2000 + 50).toFixed(2)}`,
        avatar: user.picture?.thumbnail || `/placeholder.svg?height=32&width=32`
      }))
    }

    // Fallback to generated data
    const names = [
      'Emma Johnson', 'Liam Smith', 'Olivia Brown', 'Noah Davis', 'Ava Wilson',
      'Ethan Moore', 'Sophia Taylor', 'Mason Anderson', 'Isabella Garcia', 'Jacob Martinez'
    ]
    
    return Array.from({ length: 5 }, (_, i) => {
      const name = names[Math.floor(Math.random() * names.length)]
      const email = `${name.toLowerCase().replace(' ', '.')}@company.com`
      const amount = `+$${(Math.random() * 2000 + 50).toFixed(2)}`
      
      return {
        name,
        email,
        amount,
        avatar: `/placeholder.svg?height=32&width=32`
      }
    })
  }

  // Generate realistic traffic data
  private generateTrafficData() {
    const days = 30
    const today = new Date()
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      
      // Simulate weekly patterns (higher on weekdays)
      const dayOfWeek = date.getDay()
      const weekdayMultiplier = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.3 : 0.7
      
      const baseVisitors = 1200
      const visitors = Math.floor(baseVisitors * weekdayMultiplier * (0.8 + Math.random() * 0.4))
      
      return {
        date: date.toISOString().split('T')[0],
        visitors
      }
    })
  }

  // Generate realistic activity feed using external data
  private generateActivityFeed() {
    const activities = [
      'created a new campaign',
      'updated customer profile', 
      'completed a purchase',
      'left a product review',
      'subscribed to newsletter',
      'cancelled subscription',
      'updated payment method',
      'downloaded report',
      'shared content on social media',
      'attended webinar',
      'updated billing information',
      'requested support'
    ]
    
    // Use real user data if available
    let users = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Brown', 'David Lee']
    
    if (this.realTimeData.placeholderUsers?.length > 0) {
      users = this.realTimeData.placeholderUsers.slice(0, 10).map((user: any) => user.name)
    }

    return Array.from({ length: 8 }, (_, i) => {
      const user = users[Math.floor(Math.random() * users.length)]
      const action = activities[Math.floor(Math.random() * activities.length)]
      const minutesAgo = Math.floor(Math.random() * 120) + 1
      
      return {
        user,
        action,
        time: minutesAgo < 60 
          ? `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`
          : `${Math.floor(minutesAgo / 60)} hour${Math.floor(minutesAgo / 60) > 1 ? 's' : ''} ago`,
        avatar: `/placeholder.svg?height=32&width=32`
      }
    })
  }

  // Generate top channels data
  private generateTopChannels() {
    const channels = [
      { name: 'Organic Search', visitors: 4520, percentage: 45.2, change: '+12.5%' },
      { name: 'Direct Traffic', visitors: 2850, percentage: 28.5, change: '+8.2%' },
      { name: 'Social Media', visitors: 1680, percentage: 16.8, change: '+15.3%' },
      { name: 'Email Marketing', visitors: 950, percentage: 9.5, change: '+5.1%' }
    ]

    // Add some variation
    return channels.map(channel => ({
      ...channel,
      visitors: Math.floor(channel.visitors * (0.8 + Math.random() * 0.4)),
      percentage: Math.round((channel.percentage * (0.8 + Math.random() * 0.4)) * 10) / 10
    }))
  }

  // Generate notifications
  private generateNotifications() {
    const notifications = [
      {
        title: 'New customer signed up',
        description: 'A new customer has joined your platform',
        time: '2 minutes ago',
        type: 'success'
      },
      {
        title: 'Revenue milestone reached',
        description: 'Congratulations! You\'ve reached $50K in monthly revenue',
        time: '1 hour ago',
        type: 'celebration'
      },
      {
        title: 'Low inventory alert',
        description: 'Product "ADmyBRAND Premium" is running low on stock',
        time: '3 hours ago',
        type: 'warning'
      },
      {
        title: 'Campaign performance update',
        description: 'Your latest campaign achieved 125% of target conversions',
        time: '1 day ago',
        type: 'info'
      },
      {
        title: 'System maintenance scheduled',
        description: 'Scheduled maintenance on Feb 1st from 2:00 AM to 4:00 AM',
        time: '2 days ago',
        type: 'info'
      }
    ]

    return notifications
  }

  // Test API connectivity
  async testConnectivity(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {}
    
    for (const [name, url] of Object.entries(API_ENDPOINTS)) {
      try {
        const response = await fetch(url, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        results[name] = response.ok
      } catch {
        results[name] = false
      }
    }
    
    return results
  }

  // Get real-time connection status
  getConnectionStatus(): boolean {
    return Object.keys(this.realTimeData).length > 0
  }

  // Start real-time updates with external data refresh
  private startRealTimeUpdates() {
    // Update dashboard data every 10 seconds
    setInterval(() => {
      const updatedData = this.generateRealisticData()
      this.subscribers.forEach(callback => callback(updatedData))
    }, 10000)

    // Refresh external API data every 5 minutes
    setInterval(() => {
      this.initializeExternalData()
    }, 300000)
  }

  // Export data functionality
  async exportData(format: 'csv' | 'json' = 'csv'): Promise<void> {
    const data = this.generateRealisticData()
    
    if (format === 'csv') {
      await this.exportAsCSV(data)
    } else {
      await this.exportAsJSON(data)
    }
  }

  private async exportAsCSV(data: DashboardData): Promise<void> {
    const csvContent = [
      // Metrics
      'Metrics',
      'Total Revenue,New Customers,Active Accounts,Growth Rate,Active Users',
      `${data.metrics.totalRevenue},${data.metrics.newCustomers},${data.metrics.activeAccounts},${data.metrics.growthRate},${data.metrics.activeUsers}`,
      '',
      // Revenue Data
      'Monthly Revenue',
      'Month,Revenue',
      ...data.revenueData.map(item => `${item.name},${item.total}`),
      '',
      // Recent Sales
      'Recent Sales',
      'Name,Email,Amount',
      ...data.recentSales.map(sale => `${sale.name},${sale.email},${sale.amount}`)
    ].join('\n')

    this.downloadFile(csvContent, 'dashboard-data.csv', 'text/csv')
  }

  private async exportAsJSON(data: DashboardData): Promise<void> {
    const jsonContent = JSON.stringify(data, null, 2)
    this.downloadFile(jsonContent, 'dashboard-data.json', 'application/json')
  }

  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}

// Create singleton instance
export const dashboardAPI = new DashboardAPI()

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Utility function to format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}
