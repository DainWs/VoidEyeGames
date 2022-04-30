import React from 'react';
import Select from 'react-select';
import Plataform from '../../../domain/models/dtos/Plataform';
import PlataformGame from '../../../domain/models/dtos/PlataformGame';
import { SocketController } from '../../../services/socket/SocketController';
import { SocketDataQuery } from '../../../services/socket/SocketDataQuery';
import { DESTINATION_GAMES } from '../../../services/socket/SocketDestinations';
import { SocketObserver } from '../../../services/socket/SocketObserver';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

const CURRENCY_TYPES = [
  {value: 'EURO', label: 'Euro'},
  {value: 'DOLAR', label: 'Dolar'},
  {value: 'BITCOIN', label: 'Bitcoin'}
]

class PlataformFormPage extends ModelFormPage {
  createState(props) {
    let plataform = new Plataform();
    let parentState = super.createState(props);
    if (parentState.mode === MODEL_FORM_MODE_EDIT) {
      plataform = SocketDataQuery.getPlataformWithId(props.id);
    }
    parentState.plataform = plataform;
    parentState.plataformGame = new PlataformGame();
    parentState.selectedGame = null;
    return parentState;
  }

  //---------------------------------------------------------------------------------------------
  // PLATAFORM FORM
  //---------------------------------------------------------------------------------------------

  onChangeName(event) {
    let plataform = this.state.plataform;
    plataform.name = event.target.value;
    this.setState({ plataform: plataform });
  }

  onChangeUrl(event) {
    let plataform = this.state.plataform;
    plataform.url = event.target.value;
    this.setState({ plataform: plataform });
  }

  onChangeSelectedGame(event) {
    this.setState({ selectedGame: event.value });
  }

  addSelectedGame() {
    let selectedGameId = this.state.selectedGame;
    if (!selectedGameId || selectedGameId <= 0) return;
    let plataform = this.state.plataform;
    plataform.addGame(SocketDataQuery.getGameWithId(selectedGameId));
    this.setState({ plataform: plataform });
  }

  //---------------------------------------------------------------------------------------------
  // PLATAFORM GAME FORM
  //---------------------------------------------------------------------------------------------

  onChangePrice(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.price = event.target.value;
    this.setState({plataformGame: plataformGame});
  }
  
  onChangeConcurrencyType(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.priceUnit = event.value;
    this.setState({plataformGame: plataformGame});
  }

  onChangeDiscount(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.discount = event.target.value;
    this.setState({plataformGame: plataformGame});
  }

  onTurnGameEnabled(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.isEnabled = !plataformGame.isEnabled;
    this.setState({plataformGame: plataformGame});
  }

  onEditClick(id) {
    let plataform = new Plataform(this.state.plataform);
    let plataformGames = plataform.getPlataformGame(id);
    this.setState({plataformGames: plataformGames});
  }

  onRemoveGameItemClick(id) {
    let plataform = new Plataform(this.state.plataform);
    plataform.removeGame(id);
    this.setState({plataform: plataform});
  }

  //---------------------------------------------------------------------------------------------
  // SUBMIT
  //---------------------------------------------------------------------------------------------

  submit() {
    let plataform = this.state.plataform;
    plataform.games = [];
    let request = new SocketRequest();
    request.setBody(JSON.stringify(plataform));
    request.setMethod('POST');
    SocketController.sendCustomWithCallback(
      request,
      DESTINATION_CATEGORIES,
      this.onSuccess.bind(this),
      this.onFailed.bind(this)
    );
  }

  onSuccess(response) {
    document.getElementById('navigate-home').click();
  }

  onFailed(response) {
    this.setState({ errors: response.data });
  }

  componentDidMount() {
    SocketObserver.subscribe(DESTINATION_GAMES, 'PlataformFormPage', this.forceUpdate.bind(this));
    SocketController.send(DESTINATION_GAMES);
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_GAMES);
  }

  render() {
    return (
      <section className='row h-100'>
        <article className='d-flex flex-column mx-auto p-2 p-sm-0 col-12 col-sm-10'>
          <header>
            <h1 className='text-center'>Plataforms Form</h1>
          </header>
          <form className='d-flex flex-column flex-grow-1 w-100 p-3 p-sm-0'>
            <section className='row w-100 m-0 p-0'>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-sm-3'>
                <label htmlFor='plataform-form--name' className='m-0'>Name:</label>
                <input id='plataform-form--name' className='form-control w-100' type='text' value={this.state.plataform.name} onChange={this.onChangeName.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 col-sm-6 col-lg-9 p-0'>
                <label htmlFor='plataform-form--name' className='m-0'>Web Url:</label>
                <input id='plataform-form--name' className='form-control w-100' type='text' value={this.state.plataform.url} onChange={this.onChangeUrl.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 row w-100 m-0 p-0 pt-3'>
                <Select className='col-12 col-sm-9 p-0' options={this.getGamesOptions()} onChange={this.onChangeSelectedGame.bind(this)} />
                <div className='col-12 col-sm-3 m-0 mt-3 mt-sm-0 p-0'>
                  <a className='btn btn-form text-dark d-flex align-items-center justify-content-center ml-sm-3' onClick={this.addSelectedGame.bind(this)}>Add game</a>
                </div>
              </section>
            </section>

            <hr className='w-100' />

            <section className='row w-100 m-0 p-0 mb-3'>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-sm-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--price' className='m-0'>Price:</label>
                <input id='plataform-form--price' className='form-control w-100' type='number' value={this.state.plataformGame.price} onChange={this.onChangePrice.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-lg-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--price' className='m-0'>Currency type:</label>
                <Select className='p-0' options={CURRENCY_TYPES} onChange={this.onChangeConcurrencyType.bind(this)} />
              </section>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-sm-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--discount' className='m-0'>Discount:</label>
                <input id='plataform-form--discount' className='form-control w-100' type='text' value={this.state.plataformGame.discount} onChange={this.onChangeDiscount.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 col-sm-6 col-lg-3 p-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--enabled' className='m-0'>Its on sale:</label>
                {this.getEnableButtonView()}
              </section>
            </section>

            <fieldset title='Games in plataform' className='d-flex flex-column flex-grow-1 w-100 border border-gray rounded' style={{ overflowY: 'scroll' }}>
              {this.getGamesList()}
            </fieldset>
            <section className='my-3'>
              <a className='btn btn-form w-100 text-dark' onClick={this.submit.bind(this)}>Save all</a>
            </section>
          </form>
        </article>
      </section>
    );
  }

  getEnableButtonView() {
    let isEnabled = this.state.plataformGame.isEnabled;
    return (
      <a type="button" class={(isEnabled) ? "w-100 btn btn-quaternary" : "w-100 btn btn-error "} onClick={this.onTurnGameEnabled.bind(this)}>
        {(isEnabled) ? 'Enabled' : 'Disabled'}
      </a>
    );
  }

  getGamesOptions() {
    let gamesOptions = [];
    let leakedGames = SocketDataQuery.getGamesNotIn(this.state.plataform.games);
    for (const leakedGame of leakedGames) {
      gamesOptions.push({ value: leakedGame.id, label: leakedGame.name });
    }
    return gamesOptions;
  }

  getGamesList() {
    let gamesList = [];
    for (const game of this.state.plataform.games) {
      let GameItem = withRouter(GameListItemComponent);
      gamesList.push(
        <GameItem key={`game-item--${game.id}`} data={game} 
          canRemove={true} onRemoveClick={this.onRemoveGameItemClick.bind(this)}
          canEdit={true} onEditClick={this.onEditClick.bind(this)}/>
      );
    }
    return gamesList;
  }
}

export default PlataformFormPage;