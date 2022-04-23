import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

class HeaderComponent extends React.Component {
  render() {
    return (
      <header>
        <nav className="nav justify-content-between bg-secondary" style={{height: '3rem', fontSize: '1.4rem', fontFamily: 'Arial'}}>
            <div className='nav h-100'>
                <a className="h-100 mr-3" href="#"><img src={require('../../assets/images/logo.png')} alt="logo" className='h-100'/></a>
                <a className="nav-link active pr-4" href="#">Home</a>
                <a className="nav-link pr-4" href="#">Juegos</a>
                <a className="nav-link pr-4" href="#">Soporte</a>
            </div>
            <form className="form-inline w-50">
                <div className="input-group w-75">
                    <div className="input-group-prepend">
                        <span className="input-group-text bg-primary border-0" id="search"><FontAwesomeIcon icon={faMagnifyingGlass}/></span>
                    </div>
                    <input type="text" className="form-control border-0" placeholder="Search..." aria-label="Username" aria-describedby="search"/>
                </div>
            </form>
            <div class="dropdown">
                <a class="nav-link" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <FontAwesomeIcon icon={faUser}/>
                </a>
                <div class="dropdown-menu dropdown-menu-right mt-0 p-0 pb-1 border-none" style={{top: "-5px !important"}} aria-labelledby="dropdownMenuLink">
                    <a class="dropdown-item" href="#"><FontAwesomeIcon icon={faRightFromBracket}/> Sign out</a>
                </div>  
            </div>
        </nav>
      </header>
    );
  }
}

export default HeaderComponent;
