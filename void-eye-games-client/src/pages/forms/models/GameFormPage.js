import React from 'react';
import Game from '../../../domain/models/dtos/Game';
import { SocketDataQuery } from '../../../services/socket/SocketDataQuery';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

class GameFormPage extends ModelFormPage {

  createState(props) {
    let game = new Game();
    let parentState = super.createState(props);
    if (parentState.mode === MODEL_FORM_MODE_EDIT) {
      game = SocketDataQuery.getGameWithId(props.id);
    }
    parentState.game = game;
    return parentState;
  }

  render() {
    return (
        <section>

        </section>
    );
  }
}

export default GameFormPage;