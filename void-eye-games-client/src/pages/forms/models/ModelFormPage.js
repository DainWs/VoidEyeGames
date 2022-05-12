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
        let errorObject = JSON.parse(error);
        let errorList = [];
        for (const iterator in errorObject) {
            console.log(iterator);
            errorList.push(<p key={iterator} className='text-error m-0'>{errorObject[iterator]}</p>)
        }
        return (<section className='my-2'><p className='text-error mb-1'>Warning:</p>{errorList}</section>);
    }
}

export default ModelFormPage;