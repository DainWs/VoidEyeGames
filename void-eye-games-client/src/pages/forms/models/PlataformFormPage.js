import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Navigate } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import GameListItemComponent from '../../../components/models/lists/GameListItemComponent';
import Plataform from '../../../domain/models/dtos/Plataform';
import PlataformGame from '../../../domain/models/dtos/PlataformGame';
import PriceUnitEnum from '../../../domain/models/PriceUnits';
import { SessionManager } from '../../../domain/SessionManager';
import { withRouter } from '../../../routes/Routes';
import { SocketController } from '../../../services/socket/SocketController';
import { SocketDataFilter } from '../../../services/socket/SocketDataFilter';
import { DESTINATION_LIST_OF_GAMES, DESTINATION_LIST_OF_PLATAFORMS, DESTINATION_PLATAFORM, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORMS_UPDATES } from '../../../services/socket/SocketDestinations';
import SocketRequest from '../../../services/socket/SocketRequest';
import ModelFormPage, { MODEL_FORM_MODE_EDIT, MODEL_FORM_MODE_NEW } from './ModelFormPage';

class PlataformFormPage extends ModelFormPage {
  createState(props) {
    let parentState = super.createState(props);
    parentState.plataform = new Plataform();
    parentState.plataformGame = new PlataformGame();
    parentState.editingGameId = null;
    parentState.selectedGameId = null;
    parentState.selectedFile = {};
    parentState.listedGames = [];
    parentState.listedPlataforms = [];
    return parentState;
  }

  onChangeEditingPlataform(newOne) {
    this.navigate(`/admin/plataform/${newOne.value}`, { replace: true });
    if (newOne.value == -1) {
        this.setState({id: newOne.value, mode: MODEL_FORM_MODE_NEW, plataform: new Plataform(), selectedFile: {}});
    } else {
        this.setState({id: newOne.value, mode: MODEL_FORM_MODE_EDIT});
        this.requestPlataform(newOne.value, MODEL_FORM_MODE_EDIT);
    }
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
    let id = event.value;
    this.setState({ plataformGame: new PlataformGame(), selectedGameId: id, editingGameId: id });
  }

  addSelectedGame() {
    let selectedGameId = this.state.selectedGameId;
    if (!selectedGameId || selectedGameId <= 0) return;

    let game = Array.from(this.state.listedGames)
      .find(v => v.id === selectedGameId);

    let plataform = new Plataform(this.state.plataform);
    plataform.addGame(game);
    let plataformGame = this.state.plataformGame;
    plataformGame.gamesId = selectedGameId;
    plataform.addPlataformGame(plataformGame);
    this.setState({ plataformGame: new PlataformGame(), selectedGameId: null, editingGameId: null, plataform: plataform });
  }

  onFileChange(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      var reader = new FileReader();
      var image = e.target.files[0];
      reader.readAsDataURL(image);
      reader.onloadend = function (e) {
        let attachment = {};
        attachment.name = image.name;
        attachment.mediaType = image.type;
        attachment.size = image.size;
        attachment.src = reader.result;

        this.setState({ selectedFile: attachment });
      }.bind(this);
    }
  };

  //---------------------------------------------------------------------------------------------
  // PLATAFORM GAME FORM
  //---------------------------------------------------------------------------------------------

  onChangePrice(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.price = event.target.value;
    this.setState({ plataformGame: plataformGame });
  }

  onChangeConcurrencyType(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.priceUnit = event.value;
    this.setState({ plataformGame: plataformGame });
  }

  onChangeDiscount(event) {
    let plataformGame = this.state.plataformGame;
    plataformGame.discount = event.target.value;
    this.setState({ plataformGame: plataformGame });
  }

  onTurnGameEnabled() {
    let plataformGame = this.state.plataformGame;
    let isEnabled = (plataformGame.isEnabled == true || plataformGame.isEnabled == "1");
    plataformGame.isEnabled = !isEnabled;
    this.setState({ plataformGame: plataformGame });
  }

  onEditClick(id) {
    let plataform = new Plataform(this.state.plataform);
    let plataformGame = plataform.getPlataformGame(id);
    this.setState({ editingGameId: id, selectedGameId: null, plataformGame: plataformGame });
  }

  onSaveClick() {
    let plataform = new Plataform(this.state.plataform);
    if (this.state.editingGameId) {
      let plataformGame = this.state.plataformGame;
      plataform.setPlataformGame(plataformGame);
      this.setState({ editingGameId: null, plataform: plataform, plataformGame: new PlataformGame() });
    }
  }

  onGameContextClick(id) {
    let gamesElements = document.getElementById('games-list');
    for (const element of gamesElements.children) {
      if (element.id !== id) element.blur();
    }
  }

  onRemoveGameItemClick(id) {
    let plataform = new Plataform(this.state.plataform);
    plataform.removeGame(id);
    this.setState({ plataform: plataform });
  }

  //---------------------------------------------------------------------------------------------
  // SUBMIT
  //---------------------------------------------------------------------------------------------

  submit() {
    let plataform = Object.assign({}, this.state.plataform);
    plataform.games = [];
    plataform.mainImage = this.state.selectedFile;
    
    let request = new SocketRequest();
    request.setBody(JSON.stringify(plataform));
    request.setMethod('POST');

    let destination = DESTINATION_PLATAFORM;
    if (plataform.id && plataform.id !== -1) {
      destination = DESTINATION_PLATAFORMS_UPDATES;
    }

    SocketController.sendCustomWithCallback(
      request, destination,
      this.onSuccess.bind(this),
      this.onFailed.bind(this)
    );
  }

  onSuccess(response) {
    if (response.data.status !== 200) {
      this.onFailed(response);
      return;
    }
    this.requestListedPlataforms();
    this.setState({plataform: new Plataform(), editingGameId: null, errors: null});
    this.navigate('/admin/plataform', {replace: true});
  }

  onFailed(response) {
    this.setState({ errors: response.data.body });
  }

  componentDidMount() {
    SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_GAMES, this.onGameSuccess.bind(this));
    this.requestListedPlataforms();
    this.requestPlataform();
  }

  requestListedPlataforms() {
    SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_PLATAFORMS, this.onPlataformSuccess.bind(this));
  }

  requestPlataform(id = this.state.id, mode = this.state.mode) {
    if (mode === MODEL_FORM_MODE_EDIT && (id && id != -1)) {
      let request = new SocketRequest();
      request.setParams({ id: id });
      SocketController.sendCustomWithCallback(request, DESTINATION_PLATAFORM, this.onPlataformResult.bind(this));
    }
  }

  onPlataformResult(response) {
    let plataform = new Plataform();
    try { plataform = new Plataform(response.data); }
    catch (ex) {}

    let selectedFile = {name: plataform.name, src: plataform.getLogo()};
    this.setState({ plataform: plataform, selectedFile: selectedFile });
  }

  onPlataformSuccess(response) {
    let listedPlataforms = response.data;
    if (!listedPlataforms) listedPlataforms = [];
    this.setState({ listedPlataforms: listedPlataforms });
  }

  onGameSuccess(response) {
    let listedGames = response.data;
    if (!listedGames) listedGames = [];
    this.setState({ listedGames: listedGames });
  }

  render() {
    SessionManager.reload();
    return (
      <section className='row h-100'>
        {this.checkSession()}
        <article className='d-flex flex-column mx-auto p-2 p-sm-0 col-12 col-sm-10'>
          <header>
            <h1 className='text-center'>Plataforms Form</h1>
          </header>
          <form className='d-flex flex-column flex-grow-1 w-100 p-3 p-sm-0'>
            <section className='mb-3'>
              <label htmlFor='selected-plataform-form'>Editing:</label>
              <Select id='selected-plataform-form' className='flex-grow-1 p-0 pt-2 pt-sm-0'
                placeholder={this.state.plataform.name || 'New Plataform'}
                isOptionSelected={opt => opt.value == this.state.plataform.id}
                hideSelectedOptions={true}
                options={this.getPlataformsOptions()}
                onChange={this.onChangeEditingPlataform.bind(this)} />
            </section>
            <section className='row w-100 m-0 p-0'>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-sm-3'>
                <label htmlFor='plataform-form--name' className='m-0 mb-sm-2'>Name:</label>
                <input id='plataform-form--name' className='form-control w-100' type='text' value={this.state.plataform.name || ''} onChange={this.onChangeName.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 col-sm-6 col-lg-4 p-0'>
                <label htmlFor='plataform-form--name' className='m-0 mb-sm-2'>Web Url:</label>
                <input id='plataform-form--name' className='form-control w-100' type='text' value={this.state.plataform.url || ''} onChange={this.onChangeUrl.bind(this)} autoComplete='false' />
              </section>
              <section className='col-12 col-lg-5 p-0'>
                <div className='row m-0 mt-3 mt-sm-0 mb-sm-2 p-0'>
                  <label className='col-12 col-sm-6 type-file m-0'>Filename: {this.state.selectedFile.name || 'None file uploaded'}</label>
                  <a className='col-12 col-sm-6 p-sm-0 btn btn-secondary w-100 text-priamry' data-tip={this.getImageView()}>Show image</a>
                </div>
                <div className='m-0 mt-3 mt-sm-0 p-0'>
                  <label htmlFor='plataform-form--logo' className='btn btn-form d-block m-0 ml-lg-3'><FontAwesomeIcon icon={faUpload} /> Upload file</label>
                  <input id='plataform-form--logo' className='form-control w-100' type="file" accept='image/*' onChange={this.onFileChange.bind(this)} />
                </div>
              </section>
              <section className='col-12 row w-100 m-0 p-0 pt-3'>
                <Select className='col-12 col-sm-9 p-0'
                  hideSelectedOptions={true}
                  options={this.getGamesOptions()} 
                  onChange={this.onChangeSelectedGame.bind(this)} />
                <div className='col-12 col-sm-3 m-0 mt-3 mt-sm-0 p-0'>
                  <a className='btn btn-form text-dark d-flex align-items-center justify-content-center ml-sm-3' onClick={this.addSelectedGame.bind(this)}>Add game</a>
                </div>
              </section>
            </section>

            <hr className='w-100 my-3' />

            <section className='row w-100 m-0 p-0 mb-3'>
              <section className='col-12 pb-3 pt-0 px-0'>
                {this.getEditingGameInfo()}
              </section>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-sm-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--price' className='m-0'>Price:</label>
                <input id='plataform-form--price' 
                  className='form-control w-100' type='number' 
                  value={this.state.plataformGame.price} 
                  onChange={this.onChangePrice.bind(this)} 
                  autoComplete='false' 
                  disabled={this.state.editingGameId == null}/>
              </section>
              <section className='col-12 col-sm-6 col-lg-3 p-0 pr-lg-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--price' className='m-0'>Currency type:</label>
                <Select className='p-0' options={PriceUnitEnum.getOptions()} 
                  hideSelectedOptions={true}
                  placeholder={this.state.plataformGame.priceUnit || 'Select...'}
                  onChange={this.onChangeConcurrencyType.bind(this)} 
                  isDisabled={this.state.editingGameId == null}/>
              </section>
              <section className='col-12 col-sm-6 col-lg-2 p-0 pr-sm-3 m-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--discount' className='m-0'>Discount:</label>
                <input id='plataform-form--discount' 
                  className='form-control w-100' type='text' 
                  value={this.state.plataformGame.discount} 
                  onChange={this.onChangeDiscount.bind(this)} 
                  autoComplete='false' 
                  disabled={this.state.editingGameId == null}/>
              </section>
              <section className='col-12 col-sm-3 col-lg-2 p-0 mt-2 mt-sm-0'>
                <label htmlFor='plataform-form--enabled' className='m-0'>Its on sale:</label>
                {this.getEnableButtonView()}
              </section>
              <section className='col-12 col-sm-3 col-lg-2 p-0 mt-2 mt-sm-0'>
                <label className='m-0' />
                <div className='m-0 mt-3 mt-sm-0 p-0'>
                  <a className={this.getGameButtonClasses()} onClick={this.onSaveClick.bind(this)}>Save game</a>
                </div>
              </section>
            </section>

            <fieldset id='games-list' title='Games in plataform' className='d-flex flex-column flex-grow-1 w-100 border border-gray rounded' style={{ minHeight: '200px' }}>
              <div className='d-flex flex-column flex-grow-1 w-100 h-100' style={{ minHeight: '200px' }}>
                {this.getGamesList()}
              </div>
            </fieldset>

            <section className='my-3'>
              <a className='btn btn-form w-100 text-dark' onClick={this.submit.bind(this)}>Save all</a>
            </section>
          </form>

          {this.getErrorView()}
        </article>
        <ReactTooltip html={true} place={'top'} />
      </section>
    );
  }

  checkSession() {
    return (SessionManager.check()) ? <Navigate replace to="/home" /> : <></>;
  }

  getImageView() {
    return `<img src="${this.state.selectedFile.src}" alt="Main image" style="max-width: 200px" />`;
  }

  getPlataformsOptions() {
    let plataformsOptions = [{ value: -1, label: 'New plataform' }];
    let listedPlataforms = this.state.listedPlataforms;
    for (const plataform of listedPlataforms) {
      plataformsOptions.push({ value: plataform.id, label: plataform.name });
    }
    return plataformsOptions;
  }

  getEnableButtonView() {
    let isEnabled = this.state.plataformGame.isEnabled;
    isEnabled = (isEnabled == true || isEnabled == "1");
    let classes = (isEnabled) ? "w-100 btn btn-quaternary" : "w-100 btn btn-error ";
    classes = (this.state.editingGameId == null) ? classes + ' disabled' : classes
    return (
      <a type="button" className={classes} onClick={this.onTurnGameEnabled.bind(this)}>
        {(isEnabled) ? 'Enabled' : 'Disabled'}
      </a>
    );
  }

  getGamesOptions() {
    let plataform = (this.state.plataform) ? this.state.plataform : {};
    let gamesOptions = [];
    let leakedGames = SocketDataFilter.getGamesNotIn(this.state.listedGames, plataform.games);
    for (const leakedGame of leakedGames) {
      gamesOptions.push({ value: leakedGame.id, label: leakedGame.name });
    }
    return gamesOptions;
  }

  getGamesList() {
    let plataform = (this.state.plataform) ? this.state.plataform : { games: null };
    if (!plataform.games) return;
    let gamesList = [];
    for (const game of plataform.games) {
      let GameItem = withRouter(GameListItemComponent);
      gamesList.push(
        <GameItem key={`game-item--${game.id}`} data={game}
          canRemove={true} onRemoveClick={this.onRemoveGameItemClick.bind(this)}
          canEdit={true} onEditClick={this.onEditClick.bind(this)} />
      );
    }
    return gamesList;
  }

  getGameButtonClasses() {
    let classes = 'btn btn-form text-dark d-flex align-items-center justify-content-center ml-sm-3';
    return (this.state.editingGameId == null || this.state.selectedGameId != null) ? classes + ' disabled' : classes;
  }

  getEditingGameInfo() {
    if (this.state.editingGameId == null ) {
      return (<p className='text-error font-weight-bold'>(Right now you are not editing any game.)</p>);
    }
    let game = Array.from(this.state.listedGames).find(g => g.id == this.state.editingGameId);
    return (<p className='text-quaternary font-weight-bold'>(Right now you are editing '{game.name}'.)</p>);
  }
}

export default PlataformFormPage;