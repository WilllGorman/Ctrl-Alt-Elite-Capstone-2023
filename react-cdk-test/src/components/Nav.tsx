import { Navbar, Nav, NavLink } from "reactstrap";
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
                <Navbar>
                    <Nav className="navigation-links" navbar>
                        <NavLink className="navTitleLink" href="/">
                            Ctrl Alt Elite Artefact Demo
                        </NavLink>
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
        </header>
    );
}