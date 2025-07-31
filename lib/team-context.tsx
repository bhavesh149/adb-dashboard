"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Team {
  id: string
  name: string
  value: string
  plan: 'free' | 'pro' | 'enterprise'
  members: number
  createdAt: Date
}

interface TeamContextType {
  teams: Team[]
  selectedTeam: Team | null
  isLoading: boolean
  createTeam: (name: string, plan: 'free' | 'pro' | 'enterprise') => Promise<void>
  switchTeam: (team: Team) => void
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>
  deleteTeam: (teamId: string) => Promise<void>
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

const defaultTeams: Team[] = [
  {
    id: '1',
    name: 'ADB Insights',
    value: 'personal',
    plan: 'pro',
    members: 1,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Marketing Team',
    value: 'marketing',
    plan: 'enterprise',
    members: 12,
    createdAt: new Date('2024-02-15')
  },
  {
    id: '3',
    name: 'Analytics Team',
    value: 'analytics',
    plan: 'pro',
    members: 8,
    createdAt: new Date('2024-03-10')
  }
]

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading teams from API
    const loadTeams = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Load from localStorage or use defaults
      const savedTeams = localStorage.getItem('dashboard-teams')
      const savedSelectedTeam = localStorage.getItem('dashboard-selected-team')
      
      if (savedTeams) {
        const parsedTeams = JSON.parse(savedTeams).map((team: any) => ({
          ...team,
          createdAt: new Date(team.createdAt)
        }))
        setTeams(parsedTeams)
        
        if (savedSelectedTeam) {
          const selectedId = JSON.parse(savedSelectedTeam)
          const team = parsedTeams.find((t: Team) => t.id === selectedId)
          setSelectedTeam(team || parsedTeams[0])
        } else {
          setSelectedTeam(parsedTeams[0])
        }
      } else {
        setTeams(defaultTeams)
        setSelectedTeam(defaultTeams[0])
      }
      
      setIsLoading(false)
    }

    loadTeams()
  }, [])

  // Save to localStorage whenever teams change
  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem('dashboard-teams', JSON.stringify(teams))
    }
  }, [teams])

  // Save selected team to localStorage
  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('dashboard-selected-team', JSON.stringify(selectedTeam.id))
    }
  }, [selectedTeam])

  const createTeam = async (name: string, plan: 'free' | 'pro' | 'enterprise') => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      value: name.toLowerCase().replace(/\s+/g, '-'),
      plan,
      members: 1,
      createdAt: new Date()
    }

    setTeams(prev => [...prev, newTeam])
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Auto-switch to new team
    setSelectedTeam(newTeam)
  }

  const switchTeam = (team: Team) => {
    setSelectedTeam(team)
  }

  const updateTeam = async (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, ...updates } : team
    ))
    
    // Update selected team if it's the one being updated
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(prev => prev ? { ...prev, ...updates } : null)
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  const deleteTeam = async (teamId: string) => {
    if (teams.length <= 1) {
      throw new Error('Cannot delete the last team')
    }
    
    setTeams(prev => prev.filter(team => team.id !== teamId))
    
    // Switch to another team if the selected one is being deleted
    if (selectedTeam?.id === teamId) {
      const remainingTeams = teams.filter(team => team.id !== teamId)
      setSelectedTeam(remainingTeams[0])
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  return (
    <TeamContext.Provider value={{
      teams,
      selectedTeam,
      isLoading,
      createTeam,
      switchTeam,
      updateTeam,
      deleteTeam
    }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
}
