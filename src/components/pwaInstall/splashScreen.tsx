import { useState, useEffect } from 'react'
import '../../styles/splashScreen.css'

function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="splash-screen">
      <img src="/logo.png" alt="Team Rembrandts Logo" className="splash-logo" />
      <p className="splash-text">4481 Team Rembrandts</p>
      <p className="splash-subtext">2026 Scouting Tool</p>
    </div>
  )
}

export default SplashScreen