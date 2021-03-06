/**
 * File: SupportPage.js
 * Purpose: Represents the support page view.
 * DB Access: No
 * Used from:
 *  - Index.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Support page view.
 */
class SupportPage extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <article className='d-flex flex-column m-3 pb-3'>
        <section className='overflow-hidden'>
          <h1 className='pb-2'>Soporte</h1>
          <section className='row vh-40' style={{overflow: 'hidden'}}>
            <div className='col-12 col-sm-6 col-lg-8'>
              <p className='text-justify p-2'>
                First of all, indicate that this page belongs to an <strong>Integrated Project of the end of 
                higher degree of the I.E.S. Francisco Ayala</strong> maked only for student purposes, 
                this project has been created by Jose Antonio Duarte Pérez, so he
                is not guilty of any incident on this page and the geolocation location is also false, too indicate that this 
                project has an <strong>ISC license</strong> and you can find its code at (except certs files): <br/>
                <strong><a className='text-links' href='https://github.com/DainWs/VoidEyeGames'>
                https://github.com/DainWs/VoidEyeGames</a></strong><br/>
                <br/><span className='text-error'><strong>REMEMBER NOT TO INSERT PASSWORDS 
                USED NORMALLY OR IN OTHER ACCOUNTS THE SAME FOR EMAILS, USE THE DOMAIN @voideyegames.com 
                IF POSSIBLE TO AVOID PROBLEMS</strong> (of course, this will not allow you to recover 
                passwords, since said email domain does not exist).</span><br/><br/>
                <span className='d-none d-lg-block'>Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum.</span>
                <span className='d-none d-xl-block'>Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
                enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet,
                consectetur.</span>
              </p>
            </div>
            <div className='col-12 col-sm-6 col-lg-4 pl-4 pb-4 pt-2'>
              <div className='w-100 h-100 no-select'>
                <iframe style={{width: '100%', height: '100%'}} scrolling="no" src="https://maps.google.com/maps?q=41.376279,2.176939&t=&z=13&ie=UTF8&iwloc=&output=embed"><a href="https://www.gps.ie/car-satnav-gps/">Sat Navs</a></iframe>
              </div>
            </div>
          </section>
          <section className='row'>
            <div className='col-12'>
              <p className='text-justify pb-4'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </section>
        </section>
        <section><hr/></section>
        <section className='my-1 py-1'>
          <h3 className='pt-2'>Reporte</h3>
          <section className='row' >
            <div className='col-12'>
              <p className='text-justify py-3 px-2'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                pariatur. Excepteur sint occaecat cupidatat non proident.<span className='d-none d-xl-block'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat 
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum.</span>
              </p>
            </div>
          </section>
          <section className='py-3'>
            <NavLink className='btn btn-secondary col-12 col-sm-3 text-primary' to='/report'>Enviar reporte</NavLink>
          </section>
        </section>
      </article>
    );
  }
}
export default SupportPage;