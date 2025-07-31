"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { dashboardAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true)
  const [apiStatus, setApiStatus] = useState<{ [key: string]: boolean }>({})
  const [isTestingConnectivity, setIsTestingConnectivity] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check connection status every 30 seconds
    const checkConnection = () => {
      const status = dashboardAPI.getConnectionStatus()
      setIsConnected(status)
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const testConnectivity = async () => {
    setIsTestingConnectivity(true)
    try {
      const status = await dashboardAPI.testConnectivity()
      setApiStatus(status)
      const connectedApis = Object.values(status).filter(Boolean).length
      const totalApis = Object.keys(status).length
      
      toast({
        title: "Connectivity Test Complete",
        description: `${connectedApis}/${totalApis} APIs are responding`,
        variant: connectedApis === totalApis ? "default" : "destructive"
      })
    } catch (error) {
      toast({
        title: "Connectivity Test Failed",
        description: "Unable to test API connectivity",
        variant: "destructive"
      })
    } finally {
      setIsTestingConnectivity(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isConnected ? (
            <Activity className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Connection Status</h4>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Real-time data APIs are {isConnected ? "active" : "inactive"}.
              {!isConnected && " Using cached data."}
            </p>
            
            {Object.keys(apiStatus).length > 0 && (
              <div className="space-y-1">
                <h5 className="text-sm font-medium">API Status:</h5>
                {Object.entries(apiStatus).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</span>
                    <Badge variant={status ? "default" : "secondary"} className="h-4 text-xs">
                      {status ? "OK" : "Fail"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={testConnectivity} 
            disabled={isTestingConnectivity}
            size="sm"
            className="w-full"
          >
            {isTestingConnectivity ? "Testing..." : "Test Connectivity"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
