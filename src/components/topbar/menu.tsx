import menuImg from '../../assets/menu.png'
import { useState} from 'react'

function Menu() {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [eventCode, setEventCode] = useState(localStorage.getItem('eventCode') || '2025cur')
    const [inputCode, setInputCode] = useState(eventCode)

    function handleEventCodeChange() {
        localStorage.setItem('eventKey', inputCode)
        setEventCode(inputCode)
        window.location.reload()
    } 

    return(
        <>
            <div className="menu">
                <img src={menuImg} alt="menu"
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
                                placeholder="Enter event code"
                            />
                        </div>
                        <div>
                            <button
                                className="set-event-button"
                                onClick={handleEventCodeChange}
                                >
                                    Set Event Code
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Menu