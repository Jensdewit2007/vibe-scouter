import NavbarButton from './navbar_button'

function Navbar() {

  return (
    <>
        <div className="navbar">
            <div className="navbar_logo">

            </div>
            <div className="navbar_buttons">
                <NavbarButton ButtonName="Home" /*path="pad naar home pagina"*//>
                <NavbarButton ButtonName="Details"/*path="pad naar details pagina"*//>
            </div>
        </div>
    </>
  )
}

export default Navbar