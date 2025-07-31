"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTeam } from "@/lib/team-context"
import { useToast } from "@/hooks/use-toast"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const { teams, selectedTeam, isLoading, createTeam, switchTeam } = useTeam()
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const [newTeamName, setNewTeamName] = React.useState("")
  const [newTeamPlan, setNewTeamPlan] = React.useState<'free' | 'pro' | 'enterprise'>('free')
  const [isCreating, setIsCreating] = React.useState(false)

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    try {
      await createTeam(newTeamName.trim(), newTeamPlan)
      setNewTeamName("")
      setNewTeamPlan('free')
      setShowNewTeamDialog(false)
      toast({
        title: "Team Created",
        description: `Successfully created "${newTeamName}" team.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleSwitchTeam = (team: any) => {
    switchTeam(team)
    setOpen(false)
    toast({
      title: "Team Switched",
      description: `Switched to ${team.name}`,
    })
  }

  const getTeamInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading || !selectedTeam) {
    return <div className="w-[200px] h-8 bg-muted animate-pulse rounded" />
  }

  // Group teams by category
  const personalTeams = teams.filter(team => team.value === 'personal')
  const workTeams = teams.filter(team => team.value !== 'personal')

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                alt={selectedTeam.name}
                className="grayscale"
              />
              <AvatarFallback className="text-xs">
                {getTeamInitials(selectedTeam.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{selectedTeam.name}</span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              
              {personalTeams.length > 0 && (
                <CommandGroup heading="Personal Account">
                  {personalTeams.map((team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={() => handleSwitchTeam(team)}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.name}
                          className="grayscale"
                        />
                        <AvatarFallback className="text-xs">
                          {getTeamInitials(team.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{team.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {team.plan} • {team.members} member{team.members > 1 ? 's' : ''}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.id === team.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {workTeams.length > 0 && (
                <CommandGroup heading="Teams">
                  {workTeams.map((team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={() => handleSwitchTeam(team)}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.name}
                          className="grayscale"
                        />
                        <AvatarFallback className="text-xs">
                          {getTeamInitials(team.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{team.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {team.plan} • {team.members} member{team.members > 1 ? 's' : ''}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.id === team.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>Add a new team to manage products and customers.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team name</Label>
            <Input 
              id="name" 
              placeholder="Acme Inc." 
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Subscription plan</Label>
            <Select value={newTeamPlan} onValueChange={(value: any) => setNewTeamPlan(value)} disabled={isCreating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">
                  <span className="font-medium">Free</span> -{" "}
                  <span className="text-muted-foreground">Trial for two weeks</span>
                </SelectItem>
                <SelectItem value="pro">
                  <span className="font-medium">Pro</span> -{" "}
                  <span className="text-muted-foreground">$9/month per user</span>
                </SelectItem>
                <SelectItem value="enterprise">
                  <span className="font-medium">Enterprise</span> -{" "}
                  <span className="text-muted-foreground">Custom pricing</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowNewTeamDialog(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleCreateTeam}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { TeamSwitcher }
