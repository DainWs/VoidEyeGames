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
      erros: ''
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
    this.setState({terms: event.target.value});
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

    if (!this.state.terms) {
      this.setState({erros: 'Los terminos son obligatorios para mandar el reporte.'});
      return;
    }

    if (this.state.email.length <= 0 || this.state.emailConfirmation.length <= 0) {
      this.setState({erros: 'Los campos de correo y confirmacion de correo son obligatorios para mandar el reporte.'});
      return;
    } else if (this.state.email !== this.state.emailConfirmation) {
      this.setState({erros: 'Los campos de correo y confirmacion deben ser el mismo correo.'});
      return;
    }

    if (this.state.issue.length <= 0 || this.state.description.length <= 0) {
      this.setState({erros: 'El issue y description son obligatorios para resolver el problema.'});
      return;
    }

    if (!this.state.selectedReason) {
      this.setState({erros: 'Los terminos son obligatorios para mandar el reporte.'});
      return;
    }

    let request = new SocketRequest();
    request.setBody(`{"selectedReason": "${selectedReason}", "issue": "${issue}", "description": "${description}", "email": "${email}", "emailConfirmation": "${emailConfirmation}"}`);
    request.setMethod('POST');
    SocketController.sendCustomWithCallback( request, DESTINATION_REPORT, () => {} );
  }

  render() {
    return (
      <article className='m-auto p-2 p-sm-0 w-100' style={{maxWidth: '450px'}}>
        <header>
          <h1 className='text-align-center'>Report form</h1>
        </header>
        <form id='report-form'>
          <section className='d-flex flex-column'>
            <label htmlFor='report-form--reason'>Reason:</label>
            <Select id='report-form--reason' options={REASONS} onChange={this.onChangeReason.bind(this)}/>
          </section>
          <section className='d-flex flex-column'>
            <label htmlFor='report-form--issue'>Case/Issue:</label>
            <input id='report-form--issue' type='text' value={this.state.issue} onChange={this.onChangeIssue.bind(this)}/>
          </section>
          <section className='d-flex flex-column'>
            <label htmlFor='report-form--description'>Description:</label>
            <textarea id='report-form--description' className='no-resize' rows={10} value={this.state.description} onChange={this.onChangeDescription.bind(this)}/>
          </section>
          <section className='d-flex flex-column'>
            <label htmlFor='report-form--email'>Contact email:</label>
            <input id='report-form--email' type='email' value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
          </section>
          <section className='d-flex flex-column'>
            <label htmlFor='report-form--email-confirmation'>Contact email confirmation:</label>
            <input id='report-form--email-confirmation' type='email' value={this.state.emailConfirmation} onChange={this.onChangeEmailConfirmation.bind(this)}/>
          </section>
          <section className='my-3'>
            <label htmlFor='report-form--terms'>
              <span className='text-error'>*</span>
              <input id='report-form--terms' type='checkbox' checked={this.state.terms} onChange={this.onChangeTerms.bind(this)}/> Accept terms and conditions.
            </label>
          </section>
          {this.getErrorView()}
          <section className='d-flex justify-content-between mb-3'>
            <a className='btn btn-primary border' onClick={this.cancel.bind(this)}>Cancel</a>
            <a className='btn btn-quaternary' onClick={this.submit.bind(this)}>Submit</a>
          </section>
        </form>
      </article>
    );
  }

  getErrorView() {
    let error = this.state.errors;
    if (error == null || error.length > 0) return (<></>);
    return (<section><p className='text-error'>{error}</p></section>);
  }
}

export default ReportFormPage;