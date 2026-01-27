export interface Team {
  id: number
  name: string
  primaryColor?: string
  secondaryColor?: string
}

export interface RankedTeam extends Team {
  notes: ScoutNotes
  scoutName: string
  timestamp: number
}

export interface ScoutNotes {
  driverSkill: string
  hardwareElectro: string
  communication: string
  basicGameKnowledge: string
  underTrench: boolean
}