interface NavbarButtonProps {
  ButtonName: string
  isActive?: boolean
  onClick?: () => void
}

function NavbarButton({ ButtonName, isActive = false, onClick }: NavbarButtonProps) {
  return (
    <button 
      className={`navbar_button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {ButtonName}
    </button>
  )
}

export default NavbarButton