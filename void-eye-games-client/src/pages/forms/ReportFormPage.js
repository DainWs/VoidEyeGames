import React from 'react';
import Select from 'react-select'
import { SocketController } from '../../services/socket/SocketController';
import { DESTINATION_REPORT } from '../../services/socket/SocketDestinations';
import SocketRequest from '../../services/socket/SocketRequest';

const REASONS = [
  { value: 'website_error', label: 'Website bug/errors' },
  { value: 'account_problems', label: 'Account problems' },
  { value: 'commerce', label: 'Enterprise contact' }
];

/**
 * FINISED. DO NOT TOUCH
 * @author Jose Antonio Duarte Perez
 */
class ReportFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReason: null,
      issue: '',
      description: '',
      email: '',
      emailConfirmation: '',
      terms: false,
      errors: ''
    };
  }
  
  onChangeReason(event) {
    this.setState({selectedReason: event.value});
  }

  onChangeIssue(event) {
    this.setState({issue: event.target.value});
  }

  onChangeDescription(event) {
    this.setState({description: event.target.value});
  }

  onChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  onChangeEmailConfirmation(event) {
    this.setState({emailConfirmation: event.target.value});
  }

  onChangeTerms(event) {
    this.setState({terms: !(event.target.value == 'true')});
  }

  cancel() {
    this.setState({
      selectedReason: null,
      issue: '',
      description: '',
      email: '',
      emailConfirmation: '',
      terms: false
    });
  }

  submit() {
    let selectedReason = this.state.selectedReason;
    let issue = this.state.issue;
    let description = this.state.description.replace(/\n/g, '<br/>');
    let email = this.state.email;
    let emailConfirmation = this.state.emailConfirmation;
    let terms = this.state.terms;

    if (!terms) {
      this.setState({errors: 'Los terminos son obligatorios para mandar el reporte.'});
      return;
    }

    if (email.length <= 0 || emailConfirmation.length <= 0) {
      this.setState({errors: 'Los campos de correo y confirmacion de correo son obligatorios para mandar el reporte.'});
      return;
    } else if (email !== emailConfirmation) {
      this.setState({errors: 'Los campos de correo y confirmacion deben ser el mismo correo.'});
      return;
    }

    if (issue.length <= 0 || description.length <= 0) {
      this.setState({errors: 'El issue y description son obligatorios para resolver el problema.'});
      return;
    }

    if (!selectedReason) {
      this.setState({errors: 'Los terminos son obligatorios para mandar el reporte.'});
      return;
    }

    let request = new SocketRequest();
    request.setBody(JSON.stringify({
      reason: selectedReason, 
      issue: issue, 
      description: description, 
      email: email, 
      emailConfirmation: emailConfirmation,
      terms: terms
    }));
    
    request.setMethod('POST');
    SocketController.sendCustomWithCallback( request, DESTINATION_REPORT, this.onSuccess.bind(this));
  }

  onSuccess(response) {
    if (response.data.status !== 200) {
      this.onFailed(response);
      return;
    }
    document.getElementById('navigate-home').click();
  }

  onFailed(response) {
    this.setState({errors: response.data.body});
  }

  render() {
    return (
      <article className='m-auto p-2 p-sm-0 w-100' style={{minHeight: '1000px', maxWidth: '800px'}}>
        <header>
          <h1 className='text-align-center'>Report form</h1>
        </header>
        <form id='report-form'>
          <section className='py-2 d-flex flex-column'>
            <label htmlFor='report-form--reason'>Reason:</label>
            <Select id='report-form--reason' options={REASONS} onChange={this.onChangeReason.bind(this)}/>
          </section>

          <section className='py-2 d-flex flex-column'>
            <label htmlFor='report-form--issue'>Case/Issue:</label>
            <input id='report-form--issue' className='form-control' type='text' value={this.state.issue} onChange={this.onChangeIssue.bind(this)}/>
          </section>

          <section className='py-2 d-flex flex-column'>
            <label htmlFor='report-form--description'>Description:</label>
            <textarea id='report-form--description' className='form-control no-resize' rows={10} value={this.state.description} onChange={this.onChangeDescription.bind(this)}/>
          </section>

          <section className='py-2 d-flex flex-column'>
            <label htmlFor='report-form--email'>Contact email:</label>
            <input id='report-form--email' type='email' className='form-control' value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
          </section>

          <section className='py-2 d-flex flex-column'>
            <label htmlFor='report-form--email-confirmation'>Contact email confirmation:</label>
            <input id='report-form--email-confirmation' className='form-control' type='email' value={this.state.emailConfirmation} onChange={this.onChangeEmailConfirmation.bind(this)}/>
          </section>

          <section className='py-2 required'>
            <label className='check-form ml-3' htmlFor='report-form--terms'>
              Accept terms and conditions.
              <input id='report-form--terms' type='checkbox' value={this.state.terms} checked={this.state.terms} onChange={this.onChangeTerms.bind(this)}/>
              <span className="checkmark"></span>
            </label>
          </section>
          
          <section className='d-flex justify-content-between mb-3'>
            <a className='btn btn-primary border' onClick={this.cancel.bind(this)}>Cancel</a>
            <a className='btn btn-quaternary' onClick={this.submit.bind(this)}>Submit</a>
          </section>

          {this.getErrorView()}
        </form>
      </article>
    );
  }

  getErrorView() {
    let error = this.state.errors;
    if (error == null || error.length <= 0) return (<></>);
    return (<section><p className='text-error'>* {error}</p></section>);
  }
}

export default ReportFormPage;