import './App.css'
import Navbar from './components/navbar/navbar'
import Teams from './components/teams/teams'
import Tierlist from './components/tierlist/tierlist'
import Topbar from './components/topbar/topbar'
import DetailsPage from './components/details/detailsPage'
import { useState, useEffect, useRef } from 'react'
import type { Team } from './types'

type SavedTierState = {
  availableTeams: Team[]
  tierTeams: { [key: string]: Team[] }
  teamDescriptions: { [tierName: string]: { [teamId: number]: { description: string; scoutName: string } } }
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '')
  const [tierTeams, setTierTeams] = useState<{ [key: string]: Team[] }>( {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  })
  const [teamDescriptions, setTeamDescriptions] = useState<{
    [tierName: string]: { [teamId: number]: { description: string; scoutName: string } }
  }>( {
    S: {},
    A: {},
    B: {},
    C: {},
    D: {},
  })
  const [useTeamColors, setUseTeamColors] = useState(
    localStorage.getItem('useTeamColors') === 'true'
  )
  const autoExportTimer = useRef<number | null>(null)

  const apiKey = import.meta.env.VITE_TBA_API_KEY
  const eventKey = localStorage.getItem('eventKey') || '2025cur'
  const STORAGE_KEY = `tierlist_${eventKey}`
  const DESCRIPTIONS_KEY = `descriptions_${eventKey}`

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedDescriptions = localStorage.getItem(DESCRIPTIONS_KEY)
    
    if (saved) {
      const parsed: SavedTierState = JSON.parse(saved)
      setAvailableTeams(parsed.availableTeams)
      setTierTeams(parsed.tierTeams)
      if (savedDescriptions) {
        setTeamDescriptions(JSON.parse(savedDescriptions))
      }
      setLoading(false)
      return
    }

    fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`, {
      headers: { 'X-TBA-Auth-Key': apiKey },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch teams')
        return res.json()
      })
      .then((data: any[]) => {
        const teams: Team[] = data.map(team => ({
          id: team.team_number,
          name: String(team.team_number),
        }))

        const teamNumbers = teams.map(t => t.id)
        const colorUrl =
          'https://api.frc-colors.com/v1/team?' +
          teamNumbers.map(tn => `team=${tn}`).join('&')

        fetch(colorUrl)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch colors')
            return res.json()
          })
          .then(colorData => {
            const colorTeams = teams.map(team => {
              const colorInfo = colorData.teams?.[team.id]
              if (colorInfo && colorInfo.colors?.verified) {
                return {
                  ...team,
                  primaryColor: colorInfo.colors.primaryHex,
                  secondaryColor: colorInfo.colors.secondaryHex,
                }
              }
              return team
            })

            setAvailableTeams(colorTeams)
            setTierTeams({ S: [], A: [], B: [], C: [], D: [] })

            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                availableTeams: colorTeams,
                tierTeams: { S: [], A: [], B: [], C: [], D: [] },
                teamDescriptions: { S: {}, A: {}, B: {}, C: {}, D: {} },
              })
            )
          })
          .catch(err => {
            console.error(err)
            setAvailableTeams(teams)
            setTierTeams({ S: [], A: [], B: [], C: [], D: [] })
            setError('Failed to fetch team colors, showing teams without colors.')
          })
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [eventKey, apiKey, STORAGE_KEY, DESCRIPTIONS_KEY])

  useEffect(() => {
    if (loading) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ availableTeams, tierTeams, teamDescriptions }))
    localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(teamDescriptions))
  }, [availableTeams, tierTeams, teamDescriptions, STORAGE_KEY, DESCRIPTIONS_KEY, loading])

  const filteredTeams = availableTeams
    .filter(team => team.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id)

  const addTeamToTier = (tierName: string, team: Team, description: string) => {
    setAvailableTeams(prev => prev.filter(t => t.id !== team.id))

    setTierTeams(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(t => {
        updated[t] = updated[t].filter(x => x.id !== team.id)
      })
      updated[tierName] = [...updated[tierName], team]
      return updated
    })

    setTeamDescriptions(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(t => {
        delete updated[t][team.id]
      })
      updated[tierName] = {
        ...updated[tierName],
        [team.id]: { description, scoutName: userName },
      }
      return updated
    })
  }

  const removeTeamFromTier = (tierName: string, teamId: number) => {
    setTierTeams(prev => {
      const team = prev[tierName].find(t => t.id === teamId)
      const updated = {
        ...prev,
        [tierName]: prev[tierName].filter(t => t.id !== teamId),
      }

      if (team) {
        setAvailableTeams(prevA =>
          prevA.find(t => t.id === team.id) ? prevA : [...prevA, team]
        )
      }

      return updated
    })

    setTeamDescriptions(prev => {
      const updated = { ...prev }
      delete updated[tierName][teamId]
      return updated
    })
  }

  useEffect(() => {
    const handler = async () => {
      const url = localStorage.getItem('spreadsheetUrl') || ''
      if (!url) {
        alert('No spreadsheet URL set in Settings.')
        return
      }

      const payload = { tierTeams, teamDescriptions, timestamp: Date.now(), scoutName: userName }
      try {
        await navigator.clipboard.writeText(JSON.stringify(payload))
        window.open(url, '_blank')
        alert('Tier data copied to clipboard. Paste it into your spreadsheet.')
      } catch (err) {
        alert('Failed to copy tier data to clipboard.')
      }
    }

    window.addEventListener('exportToSheet', handler)
    return () => window.removeEventListener('exportToSheet', handler)
  }, [tierTeams, teamDescriptions, userName])

  async function postToWebhook(url: string, payload: any) {
    const form = new URLSearchParams()
    form.append('data', JSON.stringify(payload))
    const res = await fetch(url, { method: 'POST', body: form })
    const text = await res.text()
    console.log('Webhook POST response:', res.status, text)
    if (!res.ok) throw new Error(`Webhook error ${res.status}: ${text}`)
    return text
  }

  useEffect(() => {
    const auto = localStorage.getItem('autoExport') === 'true'
    const url = localStorage.getItem('spreadsheetUrl') || ''
    if (!auto || !url) return

    if (autoExportTimer.current) clearTimeout(autoExportTimer.current)
    autoExportTimer.current = window.setTimeout(async () => {
      try {
        const payload = { tierTeams, teamDescriptions, timestamp: Date.now(), scoutName: userName }
        const resp = await postToWebhook(url, payload)
        console.log('Auto export successful', resp)
      } catch (err) {
        console.error('Auto export failed', err)
      }
    }, 1000)

    return () => {
      if (autoExportTimer.current) {
        clearTimeout(autoExportTimer.current)
      }
    }
  }, [tierTeams, teamDescriptions, userName])

  return (
    <>
      <Topbar 
        useTeamColors={useTeamColors} 
        setUseTeamColors={setUseTeamColors}
        userName={userName}
        setUserName={setUserName}
      />

      {currentPage === 'home' ? (
        <>
          <Tierlist
            tierTeams={tierTeams}
            teamDescriptions={teamDescriptions}
            onAddTeam={addTeamToTier}
            onRemoveTeam={removeTeamFromTier}
            useTeamColors={useTeamColors}
            userName={userName}
          />

          {loading && <p>Loading teams...</p>}
          {error && <p>Error loading teams: {error}</p>}

          <div className="search-teams-container">
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-teams"
            />
          </div>

          <Teams teams={filteredTeams} useTeamColors={useTeamColors} />
        </>
      ) : (
        <DetailsPage 
          availableTeams={availableTeams}
          tierTeams={tierTeams}
          teamDescriptions={teamDescriptions}
          useTeamColors={useTeamColors}
        />
      )}

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </>
  )
}

export default App
