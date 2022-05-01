import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitterSquare, faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
//TODO top padding desktop view
class FooterComponent extends React.Component {
  render() {
    return (
      <footer className='d-block d-sm-flex justify-content-between bg-white p-4 p-sm-0 border border-top-dark mt-auto'>
        <section className='mx-0 mx-sm-4'>
            <h6>About Us</h6>
            <ul className='pl-4 pl-sm-5'>
                <li><Link to='/support' className='text-decoration-none text-links'>Cookie policy</Link></li>
                <li><Link to='/support' className='text-decoration-none text-links'>Privacy policy</Link></li>
                <li><Link to='/support' className='text-decoration-none text-links'>Terms of use</Link></li>
            </ul>
        </section>
        <section className='mx-0 mx-sm-4'>
            <h6>Contact Us</h6>
            <ul className='pl-4 pl-sm-5'>
                <li><strong>Tlf:</strong> 654 000 000</li>
                <li><strong>Mail:</strong> void.eye.games@gmail.com</li>
            </ul>
        </section>
        <section className='mx-0 mx-sm-4'>
            <h6>Social Networks</h6>
            <ul className='pl-4 pl-sm-5'>
                <li><a href='https://es-es.facebook.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faFacebookSquare} /> Facebook</a></li>
                <li><a href='https://twitter.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faTwitterSquare} /> Twitter</a></li>
                <li><a href='https://www.instagram.com/' className='text-decoration-none text-links'><FontAwesomeIcon icon={faInstagramSquare} /> Instagram</a></li>
            </ul>
        </section>
      </footer>
    );
  }
}

export default FooterComponent;
