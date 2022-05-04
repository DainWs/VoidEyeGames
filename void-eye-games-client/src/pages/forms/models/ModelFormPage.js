import React from 'react';

export const MODEL_FORM_MODE_NEW = 0;
export const MODEL_FORM_MODE_EDIT = 1;

class ModelFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.createState(props);
    }

    createState(props) {
        if (props.params === undefined) {
            return {mode: MODEL_FORM_MODE_NEW, id: null};
        }
        return {mode: MODEL_FORM_MODE_EDIT, id: props.params.id};
    }

    render() {
        return (<></>);
    }
}

export default ModelFormPage;