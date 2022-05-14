import React from 'react';

export const MODEL_FORM_MODE_NEW = 0;
export const MODEL_FORM_MODE_EDIT = 1;

class ModelFormPage extends React.Component {
    constructor(props) {
        super(props);
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

    getErrorView() {
        let error = this.state.errors;
        if (error === undefined || error === null || error.length <= 0) return (<section><br/></section>);
        try {
            let errorObject = JSON.parse(error);
            let errorList = [];
            for (const iterator in errorObject) {
                errorList.push(<p key={iterator} className='text-error m-0'>{errorObject[iterator]}</p>)
            }
            return (<section className='my-2'><p className='text-error mb-1'>Warning:</p>{errorList}</section>);
        }catch (ex) {
            return (<section className='text-error my-2'><p className='mb-1'>Warning:</p>{error}</section>);
        }
    }
}

export default ModelFormPage;