/**
 * File: SignInFormPage.js
 * Purpose: Represents the Sign in form page view.
 * DB Access: No
 * Used from:
 *  - Index.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import md5 from 'crypto-js/md5';
import { SessionManager } from '../../domain/SessionManager';
import { SocketController } from '../../services/socket/SocketController';
import SocketRequest from '../../services/socket/SocketRequest';
import {  DESTINATION_SIGNIN } from '../../services/socket/SocketDestinations';
import { Navigate, NavLink } from 'react-router-dom';

class SignInFormPage extends React.Component {
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    this.state = {
      username: '',
      password: '',
      confirmationPassword: '',
      publicity: false,
      terms: false,
      email: '',
      errors: ''
    };
  }

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  
  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangeConfirmationPassword(event) {
    this.setState({ confirmationPassword: event.target.value });
  }

  onChangeTerms() {
    this.setState({terms: !this.state.terms});
  }

  onChangePublicity() {
    this.setState({publicity: !this.state.publicity});
  }

  submit() {
    let terms = this.state.terms;
    if (!terms) {
      this.setState({errors: 'You have to accept the terms to be able to register'});
      return;
    }

    let username = this.state.username;
    if (username.length <= 0) {
      this.setState({errors: 'The username field is required'});
      return;
    }

    let email = this.state.email;
    if (email.length <= 0) {
      this.setState({errors: 'The email field is required'});
      return;
    }

    let password = this.state.password;
    if (password.length <= 0) {
      this.setState({errors: 'The password field is required'});
      return;
    }

    let confirmationPassword = this.state.confirmationPassword;
    if (confirmationPassword.length <= 0) {
      this.setState({errors: 'The confirmationPassword field is required'});
      return;
    } else if (password !== confirmationPassword) {
      this.setState({errors: 'The confirmationPassword and password field must be equals.'});
      return;
    }
    
    let publicity = this.state.publicity;

    let request = new SocketRequest();
    request.setBody(JSON.stringify({
      name: username, 
      email: email, 
      password: md5(password)+'', 
      confirmationPassword: md5(confirmationPassword)+'', 
      terms: terms, 
      publicity: publicity
    }));
    request.setMethod('POST');
    SocketController.sendCustomWithCallback( request, DESTINATION_SIGNIN, this.onSuccess.bind(this));
  }

  onSuccess(response) {
    console.log(response.data);
    console.log(Array.from(response.data.body));
    if (response.data.status !== 200) {
      this.onFailed(response);
      return;
    }
    SessionManager.setSession(response.data);
  }

  onFailed(response) {
    this.setState({errors: response.data.body});
  }

  render() {
    return (
      <article className='p-2 p-sm-0 pb-sm-5 mt-5'>
        {this.getHasSession()}
        <section className='m-auto' style={{maxWidth: '800px'}}>
          <header>
            <h1 className='text-align-center'>Registro</h1>
          </header>
          <form id='login-form' className='w-100 my-2'>
            <section className='w-100 pt-3'>
              <label htmlFor='login-form--username' className='mb-2'><span className='text-error'>* </span>Nombre de usuario:</label>
              <input id='login-form--username' className='form-control w-100' type='text' value={this.state.username} onChange={this.onChangeUsername.bind(this)} autoComplete='false'/>
            </section>
            <section className='w-100 pt-3'>
              <label htmlFor='login-form--email' className='mb-2'><span className='text-error'>* </span>Correo electr&oacute;nico:</label>
              <input id='login-form--email' className='form-control w-100' type='email' value={this.state.email} onChange={this.onChangeEmail.bind(this)} autoComplete='false'/>
            </section>
            <section className='w-100 pt-3'>
              <label htmlFor='login-form--password' className='mb-2'><span className='text-error'>* </span>Contrase&ntilde;a:</label>
              <input id='login-form--password' className='form-control w-100' type='password' value={this.state.password} onChange={this.onChangePassword.bind(this)} autoComplete='false'/>
            </section>
            <section className='w-100 py-3'>
              <label htmlFor='login-form--password-confirmation' className='mb-2'><span className='text-error'>* </span>Confirmaci&oacute;n contrase&ntilde;a:</label>
              <input id='login-form--password-confirmation' className='form-control w-100' type='password' value={this.state.confirmationPassword} onChange={this.onChangeConfirmationPassword.bind(this)} autoComplete='false'/>
            </section>
            <section className='py-2 required'>
              <label className='check-form mb-0 ml-3' htmlFor='report-form--terms'>
                Accept terms and conditions.
                <input id='report-form--terms' type='checkbox' checked={this.state.terms} onChange={this.onChangeTerms.bind(this)}/>
                <span className="checkmark"></span>
              </label>
            </section>
            <section className='py-2'>
              <label className='check-form mb-0 ml-3' htmlFor='report-form--publicity'>
                I agree to receive advertising in my email.
                <input id='report-form--publicity' type='checkbox' checked={this.state.publicity} onChange={this.onChangePublicity.bind(this)}/>
                <span className="checkmark"></span>
              </label>
            </section>
            {this.getErrorView()}
            <section className='d-flex flex-column w-100 text-center py-3'>
              <a className='btn btn-quaternary w-100 text-primary' onClick={this.submit.bind(this)}>Registrarse</a>
            </section>
            <section className='d-flex flex-column w-100 text-center py-3'>
              <NavLink className='btn btn-secondary w-100 text-primary' to='/login'>Volver al inicio de sesi&oacute;n</NavLink>
            </section>
          </form>
        </section>
      </article>
    );
  }

  getHasSession() {
    if (SessionManager.has()) return (<Navigate replace to="/home" />);
    return (<></>)
  }

  getErrorView() {
    let error = this.state.errors;
    if (!error || error.length <= 0) return (<></>);
    if (typeof error === 'string' || error instanceof String) {
      return (<section><p className='text-error'>{error}</p></section>);
    }

    var listOfElements = [];
    let errorsList = Object.values(error);
    errorsList.forEach((value, index) => {
      listOfElements.push(<span key={'error-item--' + index}>{value}<br/></span>);
    });

    return (<section><p className='text-error'>{listOfElements}</p></section>);
  }
}

export default SignInFormPage;
