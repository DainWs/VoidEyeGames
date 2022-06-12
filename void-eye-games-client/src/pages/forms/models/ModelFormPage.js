/**
 * File: ModelFormPage.js
 * Purpose: Represents the model form page view.
 * DB Access: No
 * Used from:
 *  - CategoryFormPage.js
 *  - GameFormPage.js
 *  - PlataformFormPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';

export const MODEL_FORM_MODE_NEW = 0;
export const MODEL_FORM_MODE_EDIT = 1;

class ModelFormPage extends React.Component {
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
        
        this.navigate = props.navigate;
        this.state = this.createState(props);
    }

    createState(props) {
        if (props.params === undefined) {
            return {mode: MODEL_FORM_MODE_NEW, id: null};
        }
        let id = (props.params.id == 'null') ? null : props.params.id;
        return {mode: MODEL_FORM_MODE_EDIT, id: id};
    }

    render() {
        return (<></>);
    }

    getSuccessView() {
        let successMessage = this.state.successMessage;
        if (successMessage === undefined || successMessage === null || successMessage.length <= 0) return (<section><br/></section>);
        return (
            <section className='mt-2 mb-4'><p className='text-quaternary mb-1'>{successMessage}</p></section>
        );
    }

    getErrorView() {
        let error = this.state.errors;
        if (error === undefined || error === null || error.length <= 0) return (<section><br/></section>);
        try {
            let errorObject = JSON.parse(error);
            let errorList = [];
            for (const iterator in errorObject) {
                errorList.push(<p key={iterator} className='text-error m-0'>{errorObject[iterator]}</p>)
            }
            return (<section className='mt-2 mb-4'><p className='text-error mb-1'>Warning:</p>{errorList}</section>);
        }catch (ex) {
            return (<section className='text-error mt-2 mb-4'><p className='mb-1'>Warning:</p>{error}</section>);
        }
    }
}

export default ModelFormPage;