import { Navbar, NavbarBrand, Nav, NavItem, NavLink, NavbarText } from "reactstrap";

/**
 * NAVBAR FUNCTION
 * Tasks that can be performed:
 * - Redirect user to CoreLogic home page
 * - Redirect user to Ctrl Alt Elite artefact homepage
 * - Redirect user to Ctrl Alt Elite Github repo 
 * 
 * @returns return HTML element of this function. 
 */

export default function Navigation() {
    return (
        <header>
            <div>
                <Navbar>
                    <NavbarBrand href="/">Ctrl Alt Elite Artefact Demo</NavbarBrand> 
                    <Nav className="me-auto" navbar>
                        <NavLink className="navLink" href="https://www.corelogic.com.au/">
                            CoreLogic Home
                        </NavLink>
                        <NavLink className="navLink" href="https://www.onthehouse.com.au/">
                            Onthehouse.com.au
                        </NavLink>
                        <NavLink className="navLink" href="https://github.com/WilllGorman/ctrl-alt-elite-react-gui">
                            Github Repo
                        </NavLink>
                    </Nav>
                </Navbar>
            </div>
        </header>
    );
}