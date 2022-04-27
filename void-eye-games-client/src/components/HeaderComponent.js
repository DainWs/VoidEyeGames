import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faRightFromBracket, faBars, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { SessionManager } from '../domain/SessionManager';

class HeaderComponent extends React.Component {
  closeHamburger() {
    document.getElementById('hamburger-menu').click();
  }

  closeHamburgerAndSession() {
    this.closeHamburger();
    SessionManager.close.bind(SessionManager);
  }

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
          <form className="form-inline d-none d-lg-flex" style={{width: '40%'}}>
            <div className="input-group w-75">
              <div className="input-group-prepend">
                <span className="input-group-text bg-primary border-0" id="search"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
              </div>
              <input type="text" className="form-control border-0" placeholder="Search..." aria-label="Username" aria-describedby="search" />
            </div>
          </form>
          <div className="dropdown d-none d-sm-block">
            {this.getSessionDropdownView()}
          </div>
          <div className="d-block d-sm-none w-100" style={{zIndex: 3}}>
            <nav className="navbar-light d-flex">
              <a id="hamburger-menu" className="nav-link" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                <FontAwesomeIcon icon={faBars} />
              </a>
            </nav>
            <div className="collapse bg-secondary pb-3" id="navbarToggleExternalContent">
              <NavLink className="nav-link pr-4" activeclassname="active" to="/" onClick={this.closeHamburger}>Home</NavLink>
              <NavLink className="nav-link pr-4" activeclassname="active" to="/games" onClick={this.closeHamburger}>Juegos</NavLink>
              <NavLink className="nav-link pr-4" activeclassname="active" to="/support" onClick={this.closeHamburger}>Soporte</NavLink>
              <hr/>
              {this.getSessionHamburgerView()}
            </div>
          </div>
        </nav>
      </header>
    );
  }

  getSessionDropdownView() {
    let session = SessionManager.getSession();
    if (session.token === null) {
      return this.getUnsignedSessionDropdownView();
    }
    return this.getSignedSessionDropdownView();
  }

  getUnsignedSessionDropdownView() {
    return (<NavLink className="nav-link pr-4" to='/login' onClick={this.closeHamburger.bind(this)}><FontAwesomeIcon icon={faArrowRightToBracket} /> Log in</NavLink>);
  }

  getSignedSessionDropdownView() {
    return (
      <>
        <a className="nav-link" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <FontAwesomeIcon icon={faUser} />
        </a>
        <div className="dropdown-menu dropdown-menu-right mt-0 p-0 pb-1 border-none" style={{ top: "-5px !important" }} aria-labelledby="dropdownMenuLink">
          <a className="dropdown-item" href="#" onClick={this.closeHamburgerAndSession.bind(this)}><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</a>
        </div>
      </>
    );
  }

  getSessionHamburgerView() {
    let session = SessionManager.getSession();
    if (session.token === null) {
      return this.getUnsignedSessionHamburgerView();
    }
    return this.getSignedSessionHamburgerView();
  }

  getUnsignedSessionHamburgerView() {
    return (<NavLink className="nav-link pr-4" to='/login' onClick={this.closeHamburger.bind(this)}><FontAwesomeIcon icon={faArrowRightToBracket} /> Log in</NavLink>);
  }

  getSignedSessionHamburgerView() {
    return (<a className="nav-link" href="#" onClick={this.closeHamburgerAndSession.bind(this)}><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</a>);
  }
}

export default HeaderComponent;
