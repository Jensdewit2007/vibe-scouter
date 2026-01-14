import NavbarButton from './navbar_button'
import '../../App.css'

interface NavbarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  return (
    <div className="navbar">
      <div className="navbar_logo"></div>
      <div className="navbar_buttons">
        <NavbarButton 
          ButtonName="Home" 
          isActive={currentPage === 'home'}
          onClick={() => setCurrentPage('home')}
        />
        <NavbarButton 
          ButtonName="Details"
          isActive={currentPage === 'details'}
          onClick={() => setCurrentPage('details')}
        />
      </div>
    </div>
  )
}

export default Navbar