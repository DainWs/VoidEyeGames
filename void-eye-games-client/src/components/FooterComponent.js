import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitterSquare, faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
//TODO top padding desktop view
class FooterComponent extends React.Component {
  render() {
    return (
      <footer className='p-4 pb-5 px-sm-2 pt-sm-4 pb-sm-5 bg-white border border-top-dark mt-auto'>
        <article className='d-block d-sm-flex justify-content-between'>
          <section className='d-block d-sm-flex flex-column justify-content-start align-items-center mx-0 mx-sm-4 flex-grow-1'>
              <h6 className='text-decoration-link'>About Us</h6>
              <ul className='pl-0' style={{listStyle: 'none'}}>
                  <li><Link to='/support' className='text-decoration-none text-links'>Cookie policy</Link></li>
                  <li><Link to='/support' className='text-decoration-none text-links'>Privacy policy</Link></li>
                  <li><Link to='/support' className='text-decoration-none text-links'>Terms of use</Link></li>
              </ul>
          </section>
          <section className='d-block d-sm-flex flex-column justify-content-start align-items-center mx-0 mx-sm-4 flex-grow-1'>
              <h6>Contact Us</h6>
              <ul className='pl-2' style={{listStyle: 'none'}}>
                  <li><strong>Mail:</strong> void.eye.games@gmail.com</li>
                  <li><strong>Tlf:</strong> 654 000 000</li>
              </ul>
          </section>
          <section className='d-block d-sm-flex flex-column justify-content-start align-items-center mx-0 mx-sm-4 flex-grow-1'>
              <h6>Social Networks</h6>
              <ul className='pl-2' style={{listStyle: 'none'}}>
                  <li><a href='https://es-es.facebook.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faFacebookSquare} /> Facebook</a></li>
                  <li><a href='https://twitter.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faTwitterSquare} /> Twitter</a></li>
                  <li><a href='https://www.instagram.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faInstagramSquare} /> Instagram</a></li>
              </ul>
          </section>
        </article>
      </footer>
    );
  }
}

export default FooterComponent;
