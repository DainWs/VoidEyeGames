import React from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { SocketController } from '../../services/socket/SocketController';
import { DESTINATION_LOGIN, DESTINATION_RECOVERY } from '../../services/socket/SocketDestinations';
import SocketRequest from '../../services/socket/SocketRequest';
import { SessionManager } from '../../domain/SessionManager';

class LogInFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: '',
      recoveryEmail: '',
      showModal: false,
      successMessage: '',
      recoveryError: ''
    };
  }
  
  onChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  onChangePassword(event) {
    this.setState({password: event.target.value});
  }

  onChangeRecoveryEmail(event) {
    this.setState({recoveryEmail: event.target.value});
  }

  showModal() {
    this.setState({showModal: true, recoveryEmail: ''});
  }

  closeModal() {
    this.setState({showModal: false, recoveryEmail: ''});
  }

  submitRecovery() {
    let recoveryEmail = this.state.recoveryEmail;
    let request = new SocketRequest();
    request.setBody(JSON.stringify({email: recoveryEmail}));
    request.setMethod('POST');
    
    SocketController.sendCustomWithCallback(
      request,
      DESTINATION_RECOVERY,
      this.onSuccessRecovery.bind(this)
    );
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

  onSuccessRecovery(response) {
    if (response.data.status !== 200) {
      this.onFailedRecovery(response);
      return;
    }
    this.setState({
      showModal: false, 
      recoveryEmail: '', 
      errors: '',
      recoveryError: '',
      successMessage: "Ya se ha enviado un correo a su email con su contraseña nueva."
    });
  }

  onFailed(response) {
    this.setState({errors: response.data.body, successMessage: ''});
  }

  onFailedRecovery(response) {
    this.setState({recoveryError: response.data.body, successMessage: ''});
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
            {this.getSuccessView()}
            {this.getErrorView()}
            <section className='d-flex flex-column w-100 text-center my-3'>
              <a className='text-links text-left text-primary py-3' onClick={this.showModal.bind(this)} style={{textDecoration: 'underline'}}>Have you forgotten your password? get it back</a>
              <a className='btn btn-quaternary w-100 text-primary' onClick={this.submit.bind(this)}>Log in</a>
              <span className='my-3'>or register if you don't have an account yet</span>
              <NavLink className='btn btn-secondary w-100 text-primary' to='/signin'>Sign in</NavLink>
            </section>
          </form>
        </section>
        {this.getModal()}
      </article>
    );
  }

  getHasSession() {
    if (SessionManager.has()) return (<Navigate replace to="/home" />);
    return (<></>)
  }

  getSuccessView() {
    let successMessage = this.state.successMessage;
    if (successMessage === undefined || successMessage === null || successMessage.length <= 0) return (<></>);
    return (<section><p className='text-quaternary'>{successMessage}</p></section>);
  }

  getErrorView() {
    let error = this.state.errors;
    if (error === undefined || error === null || error.length <= 0) return (<></>);
    return (<section><p className='text-error'>{error}</p></section>);
  }

  getModal() {
    return (
      <div className={'modal fade ' + ((this.state.showModal) ? 'show d-block' : '') } id="modalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden={!this.state.showModal}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-secondary">
              <h5 className="modal-title text-primary" id="modalLongTitle">Recovery password</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal.bind(this)}>
                <span className="text-primary" style={{textShadow: 'none'}} aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Please indicate your email.</p>
              <section className='w-100 my-3'>
                <label htmlFor='recovery--email' className='mb-2'><span className='text-error'>* </span>Email:</label>
                <input id='recovery--email' className='form-control w-100' type='text' value={this.state.recoveryEmail} onChange={this.onChangeRecoveryEmail.bind(this)} autoComplete='email'/>
              </section>
              {this.getRecoveryErrorView()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-error text-primary" data-dismiss="modal" onClick={this.closeModal.bind(this)}>Close</button>
              <button type="button" className="btn btn-quaternary text-primary" onClick={this.submitRecovery.bind(this)}>Send</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getRecoveryErrorView() {
    let error = this.state.recoveryError;
    if (error === undefined || error === null || error.length <= 0) return (<section><br/></section>);
    return (<section><p className='text-error'>{error}</p></section>);
  }
}

export default LogInFormPage;