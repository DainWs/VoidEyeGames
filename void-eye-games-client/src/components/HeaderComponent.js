import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faRightFromBracket, faBars } from '@fortawesome/free-solid-svg-icons'

class HeaderComponent extends React.Component {
  render() {
    return (
      <header>
        <nav className="nav justify-content-between bg-secondary" style={{ height: '3rem', fontSize: '1.4rem', fontFamily: 'Arial' }}>
          <div className='nav h-100 d-none d-sm-flex'>
            <Link to="/" className="h-100 mr-3" href="#">
              <img src={require('../../assets/images/logo.png')} alt="logo" className='h-100' />
            </Link>
            <NavLink className="nav-link pr-4" activeclassname="active" to="/">Home</NavLink>
            <NavLink className="nav-link pr-4" activeclassname="active" to="/games">Juegos</NavLink>
            <NavLink className="nav-link pr-4" activeclassname="active" to="/support">Soporte</NavLink>
          </div>
          <form className="form-inline w-50 d-none d-lg-flex">
            <div className="input-group w-75">
              <div className="input-group-prepend">
                <span className="input-group-text bg-primary border-0" id="search"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
              </div>
              <input type="text" className="form-control border-0" placeholder="Search..." aria-label="Username" aria-describedby="search" />
            </div>
          </form>
          <div className="dropdown d-none d-sm-block">
            <a className="nav-link" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <FontAwesomeIcon icon={faUser} />
            </a>
            <div className="dropdown-menu dropdown-menu-right mt-0 p-0 pb-1 border-none" style={{ top: "-5px !important" }} aria-labelledby="dropdownMenuLink">
              <a className="dropdown-item" href="#"><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</a>
            </div>
          </div>
          <div className="d-block d-sm-none w-100" style={{zIndex: 3}}>
            <nav className="navbar-light d-flex">
              <a className="nav-link" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                <FontAwesomeIcon icon={faBars} />
              </a>
            </nav>
            <div className="collapse bg-secondary" id="navbarToggleExternalContent">
              <NavLink className="nav-link pr-4" activeclassname="active" to="/">Home</NavLink>
              <NavLink className="nav-link pr-4" activeclassname="active" to="/games">Juegos</NavLink>
              <NavLink className="nav-link pr-4" activeclassname="active" to="/support">Soporte</NavLink>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default HeaderComponent;
