import React from 'react';
import md5 from 'crypto-js/md5';
import { SessionManager } from '../domain/SessionManager';
import { SocketController } from '../services/socket/SocketController';
import SocketRequest from '../services/socket/SocketRequest';
import {  DESTINATION_SIGNIN } from '../services/socket/SocketDestinations';

class SignInFormPage extends React.Component {
  constructor(props) {
    super(props);
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
    request.setBody(`{"name": "${username}", "email": "${email}", "password": "${md5(password)}", "confirmationPassword": "${md5(confirmationPassword)}", "terms": ${terms}, "publicity": ${publicity}}`);
    request.setMethod('POST');
    SocketController.sendCustomWithCallback(
      request,
      DESTINATION_SIGNIN,
      this.onSuccess.bind(this),
      this.onFailed.bind(this)
    );
  }

  onSuccess(response) {
    console.log(response);
    SessionManager.setSession(response.data);
    document.getElementById('navigate-home').click();
  }

  onFailed(response) {
    console.log(JSON.stringify(response));
    this.setState({errors: "Ha ocurrido un error, vuelva a intentarlo mas tarde."});
  }

  render() {
    return (
      <article className='m-auto p-2 p-sm-0 w-100' style={{ maxWidth: '400px' }}>
        {this.getHasSession()}
        <header>
          <h1 className='text-align-center'>Sign in</h1>
        </header>
        <form id='login-form' className='w-100'>
          <section className='w-100'>
            <label htmlFor='login-form--username'>Username:</label>
            <input id='login-form--username' className='w-100' type='text' value={this.state.username} onChange={this.onChangeUsername.bind(this)} autoComplete='false'/>
          </section>
          <section className='w-100'>
            <label htmlFor='login-form--email'>Email:</label>
            <input id='login-form--email' className='w-100' type='email' value={this.state.email} onChange={this.onChangeEmail.bind(this)} autoComplete='false'/>
          </section>
          <section className='w-100'>
            <label htmlFor='login-form--password'>Password:</label>
            <input id='login-form--password' className='w-100' type='password' value={this.state.password} onChange={this.onChangePassword.bind(this)} autoComplete='false'/>
          </section>
          <section className='w-100'>
            <label htmlFor='login-form--password-confirmation'>Confirmation password:</label>
            <input id='login-form--password-confirmation' className='w-100' type='password' value={this.state.confirmationPassword} onChange={this.onChangeConfirmationPassword.bind(this)} autoComplete='false'/>
          </section>
          <section>
            <label htmlFor='report-form--terms'>
              <span className='text-error'>*</span>
              <input id='report-form--terms' type='checkbox' checked={this.state.terms} onChange={this.onChangeTerms.bind(this)}/> Accept terms and conditions.
            </label>
          </section>
          <section>
            <label htmlFor='report-form--publicity'>
              <span className='text-error'>*</span>
              <input id='report-form--publicity' type='checkbox' checked={this.state.publicity} onChange={this.onChangePublicity.bind(this)}/> I agree to receive advertising in my email.
            </label>
          </section>
          {this.getErrorView()}
          <section className='d-flex flex-column w-100 text-center'>
            <a className='btn btn-secondary w-100 text-primary' onClick={this.submit.bind(this)}>Sign in</a>
          </section>
        </form>
      </article>
    );
  }

  getHasSession() {
    if (SessionManager.has()) return (<Navigate replace to="/home" />);
    return (<></>)
  }

  getErrorView() {
    let error = this.state.errors;
    if (error && error.length > 0) return (<></>);
    return (<section><p className='text-error'>{error}</p></section>);
  }
}

export default SignInFormPage;
