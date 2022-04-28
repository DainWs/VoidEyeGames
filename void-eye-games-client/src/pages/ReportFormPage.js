import React from 'react';
import Select from 'react-select'

const REASONS = [
  { value: 'website_error', label: 'Website bug/errors' },
  { value: 'account_problems', label: 'Account problems' },
  { value: 'commerce', label: 'Enterprise contact' }
];

class ReportFormPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReason: null,
      issue: '',
      description: '',
      email: '',
      emailConfirmation: '',
      terms: false
    };
  }
  
  onChangeReason(event) {
    this.setState({selectedReason: event.target.value});
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

  }

  submit() {

  }

  render() {
    return (
      <article className='m-auto'>
        <header>
          <h1 className='text-align-center'>Report form</h1>
        </header>
        <form id='report-form'>
          <section>
            <label htmlFor='report-form--reason'>Reason:</label>
            <Select id='report-form--reason' options={REASONS} onChange={this.onChangeReason.bind(this)}/>
            {this.getReasonError()}
          </section>
          <section>
            <label htmlFor='report-form--issue'>Case/Issue:</label>
            <input id='report-form--issue' type='text' value={this.state.issue} onChange={this.onChangeIssue.bind(this)}/>
            {this.getIssueError()}
          </section>
          <section>
            <label htmlFor='report-form--description'>Description:</label>
            <textarea id='report-form--description' rows={10} value={this.state.description} onChange={this.onChangeDescription.bind(this)}/>
            {this.getReasonError()}
          </section>
          <section>
            <label htmlFor='report-form--email'>Contact email:</label>
            <input id='report-form--email' type='email' value={this.state.email} onChange={this.onChangeEmail.bind(this)}/>
          </section>
          <section>
            <label htmlFor='report-form--email-confirmation'>Contact email confirmation:</label>
            <input id='report-form--email-confirmation' type='email' value={this.state.emailConfirmation} onChange={this.onChangeEmailConfirmation.bind(this)}/>
          </section>
          <section>
            <label htmlFor='report-form--terms'>
              <span className='text-error'>*</span>
              <input id='report-form--terms' type='checkbox' checked={this.state.terms} onChange={this.onChangeTerms.bind(this)}/> Accept terms and conditions.
            </label>
          </section>
          <section className='d-flex justify-content-around'>
            <a className='btn btn-primary' onClick={this.cancel.bind(this)}>Cancel</a>
            <a className='btn btn-quaternary' onClick={this.submit.bind(this)}>Submit</a>
          </section>
        </form>
      </article>
    );
  }

  getReasonError() {

  }

  getIssueError() {

  }

  getDescriptionError() {

  }

  getEmailError() {

  }

  getConfirmationEmailError() {

  }
}

export default ReportFormPage;