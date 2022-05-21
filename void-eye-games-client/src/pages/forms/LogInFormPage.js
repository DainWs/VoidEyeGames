import React from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { SocketController } from '../../services/socket/SocketController';
import { DESTINATION_LOGIN } from '../../services/socket/SocketDestinations';
import SocketRequest from '../../services/socket/SocketRequest';
import { SessionManager } from '../../domain/SessionManager';

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
    request.setBody(JSON.stringify({username: username, password: md5(password)+''}));
    request.setMethod('POST');
    SocketController.sendCustomWithCallback(
      request,
      DESTINATION_LOGIN,
      this.onSuccess.bind(this)
    );
  }

  onSuccess(response) {
    if (response.data.status !== 200) {
      this.onFailed(response);
      return;
    }
    SessionManager.setSession(response.data.body);
  }

  onFailed(response) {
    console.log(response);
    this.setState({errors: response.data.body});
  }

  render() {
    return (
      <article className='p-2 p-sm-0 mt-5'>
        {this.getHasSession()}
        <section className='m-auto' style={{maxWidth: '800px'}}>
          <header>
            <h1 className='text-align-center'>Log in</h1>
          </header>
          <form id='login-form' className='w-100 my-2'>
            <section className='w-100 my-3'>
              <label htmlFor='login-form--username' className='mb-2'><span className='text-error'>* </span>Username:</label>
              <input id='login-form--username' className='form-control w-100' type='text' value={this.state.username} onChange={this.onChangeUsername.bind(this)} autoComplete='false'/>
            </section>
            <section className='w-100 my-3'>
              <label htmlFor='login-form--password' className='mb-2'><span className='text-error'>* </span>Password:</label>
              <input id='login-form--password' className='form-control w-100' type='password' value={this.state.password} onChange={this.onChangePassword.bind(this)} autoComplete='false'/>
            </section>
            {this.getErrorView()}
            <section className='d-flex flex-column w-100 text-center my-3'>
              <a className='btn btn-quaternary w-100 text-primary' onClick={this.submit.bind(this)}>Log in</a>
              <span className='my-3'>or register if you don't have an account yet</span>
              <NavLink className='btn btn-secondary w-100 text-primary' to='/signin'>Sign in</NavLink>
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
    if (error === undefined || error === null || error.length <= 0) return (<section><br/></section>);
    return (<section><p className='text-error'>{error}</p></section>);
  }
}

export default LogInFormPage;