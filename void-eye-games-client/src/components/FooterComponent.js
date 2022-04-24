import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitterSquare, faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons'

class FooterComponent extends React.Component {
  render() {
    return (
      <footer className='d-flex justify-content-around bg-white border border-top-dark' style={{marginTop: "auto"}}>
        <section>
            <h6>About Us</h6>
            <ul>
                <li><a>Cookie policy</a></li>
                <li><a>Privacy policy</a></li>
                <li><a>Terms of use</a></li>
            </ul>
        </section>
        <section>
            <h6>Contact Us</h6>
            <ul>
                <li><strong>Tlf:</strong> 654 000 000</li>
                <li><strong>Mail:</strong> void.eye.games@gmail.com</li>
            </ul>
        </section>
        <section>
            <h6>Social Networks</h6>
            <ul>
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
