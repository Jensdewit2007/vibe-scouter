export interface Team {
  id: number
  name: string
  primaryColor?: string
  secondaryColor?: string
}

export interface RankedTeam extends Team {
  description: string
  scoutName: string
  timestamp: number
}