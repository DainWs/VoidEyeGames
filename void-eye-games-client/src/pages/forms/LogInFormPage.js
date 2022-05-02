import React from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { SocketController } from '../../services/socket/SocketController';
import { DESTINATION_LOGIN } from '../../services/socket/SocketDestinations';
import SocketRequest from '../../services/socket/SocketRequest';
import { SessionManager } from '../../domain/SessionManager';
import { EventObserver } from '../../domain/EventObserver';
import { EVENT_SESSION_CHANGE } from '../../domain/EventsEnum';

class LogInFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: ''
    };
  }
  
  onChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  onChangePassword(event) {
    this.setState({password: event.target.value});
  }

  submit() {
    let username = this.state.username;
    let password = this.state.password;

    let request = new SocketRequest();
    request.setBody(`{"username": "${username}", "password": "${md5(password)}"}`);
    request.setMethod('POST');
    SocketController.sendCustomWithCallback(
      request,
      DESTINATION_LOGIN,
      this.onSuccess.bind(this),
      this.onFailed.bind(this)
    );
  }

  onSuccess(response) {console.log(response);
    if (response.status !== 200) {
      this.onFailed(response);
      return;
    }
    SessionManager.setSession(response.data);
    EventObserver.notify(EVENT_SESSION_CHANGE);
    document.getElementById('navigate-home').click();
  }

  onFailed(response) {
    this.setState({errors: response.data});
  }

  render() {
    return (
      <article className='m-auto p-2 p-sm-0 w-100' style={{maxWidth: '400px'}}>
        {this.getHasSession()}
        <header>
          <h1 className='text-align-center'>Log in</h1>
        </header>
        <form id='login-form' className='w-100'>
          <section className='w-100'>
            <label htmlFor='login-form--username'>Username:</label>
            <input id='login-form--username' className='w-100' type='text' value={this.state.username} onChange={this.onChangeUsername.bind(this)} autoComplete='false'/>
          </section>
          <section className='w-100'>
            <label htmlFor='login-form--password'>Password:</label>
            <input id='login-form--password' className='w-100' type='password' value={this.state.password} onChange={this.onChangePassword.bind(this)} autoComplete='false'/>
          </section>
          {this.getErrorView()}
          <section className='d-flex flex-column w-100 text-center'>
            <a className='btn btn-quaternary w-100 text-primary' onClick={this.submit.bind(this)}>Log in</a>
            <span>or register if you don't have an account yet</span>
            <NavLink className='btn btn-secondary w-100 text-primary' to='/signin'>Sign in</NavLink>
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
    if (error === undefined || error === null || error.length <= 0) return (<section><br/></section>);
    return (<section><p className='text-error'>{error}</p></section>);
  }
}

export default LogInFormPage;