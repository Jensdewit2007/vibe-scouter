import NavbarButton from './navbar_button'

interface NavbarProps {
  currentPage: 'home' | 'details' | 'matches'
  setCurrentPage: (page: 'home' | 'details' | 'matches') => void
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
        <NavbarButton 
          ButtonName="Matches"
          isActive={currentPage === 'matches'}
          onClick={() => setCurrentPage('matches')}
        />
      </div>
    </div>
  )
}

export default Navbar