import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faRightFromBracket, faBars, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { SessionManager } from '../domain/SessionManager';
import { EventObserver } from '../domain/EventObserver';
import { EVENT_SEARCH_GAME, EVENT_SESSION_CHANGE } from '../domain/EventsEnum';
import { ACCOUNT_TYPE_ADMIN } from '../domain/models/AccountTypes';
import { EventDataProvider } from '../domain/EventDataProvider';

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.navigate = props.navigate;
    this.state = {
      session: SessionManager.getSession(),
      search: ""
    }
  }
  
  update() {
    this.setState({session: SessionManager.getSession()});
    this.navigate('/home', {replace: true});
  }
  
  closeHamburger() {
    document.getElementById('hamburger-menu').click();
  }

  closeHamburgerAndSession() {
    this.closeHamburger();
    SessionManager.close();
    this.setState({session: SessionManager.getSession()});
  }

  onChangeSearch(event) {
    let newData = event.target.value;
    console.log(newData);
    if (newData !== this.state.search) {
      EventDataProvider.supply(EVENT_SEARCH_GAME, newData + '');
      EventObserver.notify(EVENT_SEARCH_GAME, newData + '');
      this.setState({search: newData});
    }
  }

  onKeyDown(event) {
    if (event.keyCode == 13) {
      this.navigate('/games', {replace: true});
    }
  }

  componentDidMount() {
    EventObserver.subscribe(EVENT_SESSION_CHANGE, 'HeaderComponent', this.update.bind(this));
  }

  componentWillUnmount() {
    EventObserver.unsubscribe(EVENT_SESSION_CHANGE, 'HeaderComponent');
  }

  render() {
    return (
      <header>
        <NavLink id='navigate-home' to="/"/>
        <nav className="nav justify-content-between bg-secondary" style={{ height: '3rem', fontSize: '1.4rem', fontFamily: 'Arial' }}>
          <div className='nav h-100 d-none d-sm-flex'>
            <Link to="/" className="h-100 mr-3" href="#">
              <img src={require('../assets/images/logo.png')} alt="logo" className='h-100' />
            </Link>
            {this.getHomeLink('home-link')}
            {this.getGamesLink('games-link')}
            {this.getSupportLink('support-link')}
          </div>
          <div className="form-inline d-none d-lg-flex" style={{width: '40vw'}}>
            <div className="input-group w-75">
              <div className="input-group-prepend">
              <span className="input-group-text bg-primary border-0" id="search">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
              </div>
              <input type="text" 
                className="form-control border-0" 
                placeholder="Search..."
                style={{boxShadow: 'none', outline: 'none'}}
                value={this.state.search} 
                onChange={this.onChangeSearch.bind(this)}
                onKeyDown={this.onKeyDown.bind(this)} />
            </div>
          </div>
          <div className="dropdown d-none d-sm-block">
            {this.getSessionDropdownView()}
          </div>
          <div className="d-block d-sm-none w-100" style={{zIndex: 3}}>
            <nav className="navbar-light d-flex justify-content-start">
              <a id="hamburger-menu" className="nav-link" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
                <FontAwesomeIcon icon={faBars} />
              </a>
            </nav>
            <div className="collapse bg-secondary pb-3" id="navbarToggleExternalContent">
              {this.getHomeLink('hamburger-4-home-link', this.closeHamburger)}
              {this.getGamesLink('hamburger-w-games-link', this.closeHamburger)}
              {this.getSupportLink('hamburger-6-support-link', this.closeHamburger)}
              <hr className='bg-primary mx-3'/>
              {this.getSessionHamburgerView()}
            </div>
          </div>
        </nav>
      </header>
    );
  }


  //---------------------------------------------------------------------------------------------
  // DROPDOWN
  //---------------------------------------------------------------------------------------------

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
        <div className="dropdown-menu dropdown-menu-right mt-0 p-0 pb-1 border-none" style={{ top: "-5px !important", transform: "translate3d(-115px, 50px, 0px)", width: "250px"}} aria-labelledby="dropdownMenuLink">
          {this.getAdminDropdownView()}
          <hr className='bg-primary'/>
          <a className="nav-link pr-4" href="#" onClick={this.closeHamburgerAndSession.bind(this)}><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</a>
        </div>
      </>
    );
  }

  getAdminDropdownView() {
    let session = SessionManager.getSession();
    console.log(session);
    if (ACCOUNT_TYPE_ADMIN.getId() === session.accountType) {
      return [
        this.getAdminGameLink('dropdown-new-game-link'),
        this.getAdminPlataformLink('dropdown-new-plataform-link'),
        this.getAdminCategoryLink('dropdown-new-category-link')
      ];
    }
    return;
  }

  //---------------------------------------------------------------------------------------------
  // HAMBURGER
  //---------------------------------------------------------------------------------------------
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
    return ([
        this.getAdminHamburgerView(),
        <a key={'hamburger-close-link'} className="nav-link" href="#" onClick={this.closeHamburgerAndSession.bind(this)}><FontAwesomeIcon icon={faRightFromBracket} /> Sign out</a>
    ]);
  }

  getAdminHamburgerView() {
    let session = SessionManager.getSession();
    if (ACCOUNT_TYPE_ADMIN.getId() === session.accountType) {
      return [
        this.getAdminGameLink('hamburger-admin-new-game-link', this.closeHamburger.bind(this)  ),
        this.getAdminPlataformLink('hamburger-admin-new-plataform-link', this.closeHamburger.bind(this)),
        this.getAdminCategoryLink('hamburger-admin-new-category-link', this.closeHamburger.bind(this))
      ];
    }
    return;
  }

  //---------------------------------------------------------------------------------------------
  // ADMIN NAV LINKS
  //---------------------------------------------------------------------------------------------
  getAdminGameLink(key = 'new-game-link', onClick = function() {}) {
    return this.getNavLink(key, 'New game', '/admin/game', onClick);
  }

  getAdminPlataformLink(key = 'new-plataform-link', onClick = function() {}) {
    return this.getNavLink(key, 'New plataform', '/admin/plataform', onClick);
  }

  getAdminCategoryLink(key = 'new-category-link', onClick = function() {}) {
    return this.getNavLink(key, 'New category', '/admin/category', onClick);
  }

  //---------------------------------------------------------------------------------------------
  // USERS NAV LINKS
  //---------------------------------------------------------------------------------------------

  getHomeLink(key = 'home-link', onClick = function() {}) {
    return this.getNavLink(key, 'Home', '/', onClick);
  }

  getGamesLink(key = 'games-link', onClick = function() {}) {
    return this.getNavLink(key, 'Juegos', '/games', onClick);
  }

  getSupportLink(key = 'support-link', onClick = function() {}) {
    return this.getNavLink(key, 'Soporte', '/support', onClick);
  }

  //---------------------------------------------------------------------------------------------

  getNavLink(key, title, path, onClick = function() {}) {
    return (<NavLink key={key} className="nav-link pr-4" activeclassname="active" to={path} onClick={onClick}>{title}</NavLink>);
  }
}

export default HeaderComponent;
