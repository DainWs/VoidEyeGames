import React from 'react';

export const MODEL_FORM_MODE_NEW = 0;
export const MODEL_FORM_MODE_EDIT = 1;

class ModelFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.createState(props);
    }

    createState(props) {
        if (props.id === undefined) {
            return {mode: MODEL_FORM_MODE_NEW};
        }
        return {mode: MODEL_FORM_MODE_EDIT};
    }

    render() {
        return (<></>);
    }
}

export default ModelFormPage;