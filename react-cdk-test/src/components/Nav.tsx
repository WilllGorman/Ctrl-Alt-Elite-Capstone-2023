import { useState } from "react";
import { Link } from 'react-router-dom';
import "../../node_modules/bootstrap/js/src/collapse.js";

interface NavBarProps {
    brandName: string;
    imageSrcPathCAE: string;
    imageSrcPathGit: string;
    navItems: string[];
    linkItems: string[];
  }
  function NavBar({ brandName, imageSrcPathCAE, imageSrcPathGit, navItems, linkItems }: NavBarProps) {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    return (
      <nav className="navbar navbar-expand-xl navbar-light bg-white shadow navbar-fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src={imageSrcPathCAE}
              alt="Logo"
              width="230"
              height="50"
              className="d-inline-block align-text-center logo"
            />
            <span className="fw-bolder fs-4">{brandName}</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse align-items-center d-flex flex-column flex-md-row show" id="navbarNav" >
            <ul className="navbar-nav me-auto mb-2 mb-md-1">
              {navItems.map((item, index) => (
                <li key={item} className="nav-item" onClick={() => setSelectedIndex(index)} >
                  <a className={ selectedIndex === index ? "nav-link active fw-bold" : "nav-link" } href={linkItems[index]} > {item} </a>
                </li>
              ))}
            </ul>
            <Link to="https://github.com/WilllGorman/Ctrl-Alt-Elite-Capstone-2023">
                <img
                src={imageSrcPathGit}
                alt="GitLogo"
                width="100"
                height="60"
                className="d-inline-block align-text-center gitlogo"
                />
            </Link>
          </div>
        </div>
      </nav>
    );
  }
  
  export default NavBar;