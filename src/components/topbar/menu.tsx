import menuImg from '../../assets/menu.png'
import { useState } from 'react'

interface MenuProps {
  useTeamColors: boolean
  setUseTeamColors: (val: boolean) => void
}

function Menu({ useTeamColors, setUseTeamColors }: MenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [eventCode, setEventCode] = useState(
    localStorage.getItem('eventKey') || '2025cur'
  )
  const [inputCode, setInputCode] = useState(eventCode)

  function handleEventCodeChange() {
    localStorage.setItem('eventKey', inputCode)
    setEventCode(inputCode)
    window.location.reload()
  }

  function toggleTeamColors() {
    const next = !useTeamColors
    setUseTeamColors(next)
    localStorage.setItem('useTeamColors', String(next))
  }

  return (
    <div className="menu">
      <img
        src={menuImg}
        alt="menu"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="menu-icon"
      />

      {dropdownOpen && (
        <div>
          <div className="event-code">
            <label className="event-text">Event code:</label>
            <input
              type="text"
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              className="event-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="set-event-button" onClick={handleEventCodeChange}>
              Set Event Code
            </button>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'black',
              }}
            >
              <input
                type="checkbox"
                checked={useTeamColors}
                onChange={toggleTeamColors}
              />
              Team colors
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu
