import React from 'react';
import Plataform from '../../../domain/models/dtos/Plataform';
import { SocketDataQuery } from '../../../services/socket/SocketDataQuery';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

class PlataformFormPage extends ModelFormPage {
  createState(props) {
    let plataform = new Plataform();
    let parentState = super.createState(props);
    if (parentState.mode === MODEL_FORM_MODE_EDIT) {
      plataform = SocketDataQuery.getPlataformWithId(props.id);
    }
    parentState.plataform = plataform;
    return parentState;
  }

  render() {
    return (
        <section>

        </section>
    );
  }
}

export default PlataformFormPage;