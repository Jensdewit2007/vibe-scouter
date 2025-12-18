
function NavbarButton({ButtonName}: {ButtonName: string}, /*{Path}: {Path: string}*/ ){

  return (
    <>
      <button className="navbar_button"
      // Onclick event die verwijst naar pad
      >{ButtonName}</button>
      
    </>
  )
}

export default NavbarButton