import menuImg from '../../assets/menu.png'
import { useState } from 'react'
import { createPortal } from 'react-dom'
interface MenuProps {
  useTeamColors: boolean
  setUseTeamColors: (val: boolean) => void
  userName: string
  setUserName: (name: string) => void
}

const SCOUT_NAMES = ['Bjorn', 'Feije', 'Gijs Koenen', 'Gijs Kruijt', 'Jens', 'Joep', 'Lex', 'Milan', 'Teun', 'Tijn']

const APP_VERSION = 'pre week 1 v0.1'

function Menu({ useTeamColors, setUseTeamColors, userName, setUserName }: MenuProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false)

  const [eventCode, setEventCode] = useState(
    localStorage.getItem('eventKey') || '2026tuis'
  )
  const [inputCode, setInputCode] = useState(eventCode)

  const [spreadsheetUrl, setSpreadsheetUrl] = useState(
    localStorage.getItem('spreadsheetUrl') || ''
  )

  const [autoExport, setAutoExport] = useState(
    localStorage.getItem('autoExport') === 'true'
  )

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

  function saveSpreadsheetUrl() {
    localStorage.setItem('spreadsheetUrl', spreadsheetUrl)
  }

  function toggleAutoExport() {
    const next = !autoExport
    setAutoExport(next)
    localStorage.setItem('autoExport', String(next))
  }

  function exportNow() {
    window.dispatchEvent(new CustomEvent('exportToSheet'))
  }

  function handleNameSelect(name: string) {
    setUserName(name)
    localStorage.setItem('userName', name)
    setNameDropdownOpen(false)
  }

  return (
    <>
      <img
        src={menuImg}
        alt="menu"
        onClick={() => setDropdownOpen(true)}
        className="menu-icon"
      />

      {dropdownOpen &&
        createPortal(
          <div className="overlay" onClick={() => setDropdownOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>Settings</h3>

              <div style={{ padding: '8px 0', color: '#666', fontSize: '0.85rem', textAlign: 'center', borderBottom: '1px solid #ddd', marginBottom: '12px' }}>
                Version: <strong>{APP_VERSION}</strong>
              </div>

              <div className="scout-name-section">
                <label className="event-text">Scout Name:</label>
                <div className="dropdown-wrapper">
                  <button 
                    className="dropdown-button"
                    onClick={() => setNameDropdownOpen(!nameDropdownOpen)}
                  >
                    {userName || 'Select Name'} ▼
                  </button>
                  {nameDropdownOpen && (
                    <div className="dropdown-menu">
                      {SCOUT_NAMES.map(name => (
                        <div
                          key={name}
                          className={`dropdown-item ${userName === name ? 'selected' : ''}`}
                          onClick={() => handleNameSelect(name)}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <hr />

              <div className="event-code">
                <label className="event-text">Event code:</label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  className="event-input"
                />
                <button className="set-event-button" onClick={handleEventCodeChange}>
                  Set Event Code
                </button>
              </div>

              <div className="menu-controls" style={{ marginTop: 10 }}>
                <label className="color-toggle">
                  <input
                    type="checkbox"
                    checked={useTeamColors}
                    onChange={toggleTeamColors}
                  />
                  Team colors
                </label>
              </div>

              <hr />

              <div>
                <label className="event-text">Google Spreadsheet / Webhook URL:</label>
                <input
                  type="text"
                  value={spreadsheetUrl}
                  onChange={e => setSpreadsheetUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/XXX/exec"
                  className="event-input"
                  style={{ width: '100%' }}
                />

                <label style={{ display: 'block', marginTop: 8 }}>
                  <input type="checkbox" checked={autoExport} onChange={toggleAutoExport} />
                  {' '}Auto export on change
                </label>

                <div style={{ display: 'flex', gap: 8, marginTop: 8, }}>
                  <button onClick={saveSpreadsheetUrl} className='menu-button'>Save</button>
                  <button onClick={exportNow} className='menu-button'>Export now</button>
                  <button onClick={() => setDropdownOpen(false)} className='menu-button'>Close</button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default Menu
