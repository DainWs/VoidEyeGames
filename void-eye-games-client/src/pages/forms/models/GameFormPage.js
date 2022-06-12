/**
 * File: GameFormPage.js
 * Purpose: Represents the game form page view.
 * DB Access: No
 * Used from:
 *  - Index.js
 * Uses files:
 *  - The following imported files:
 */
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactTooltip from 'react-tooltip'
import Select from 'react-select'
import { Navigate } from 'react-router-dom';
import Game from '../../../domain/models/dtos/Game';
import { SessionManager } from '../../../domain/SessionManager';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';
import { DESTINATION_GAMES, DESTINATION_LIST_OF_CATEGORIES, DESTINATION_LIST_OF_GAMES, DESTINATION_GAMES_UPDATE } from '../../../services/socket/SocketDestinations';
import { SocketDataFilter } from '../../../services/socket/SocketDataFilter';
import { SocketController } from '../../../services/socket/SocketController';
import SocketRequest from '../../../services/socket/SocketRequest';
import CategoryListItemComponent from '../../../components/models/lists/CategoryListItemComponent';
import MediaListItemComponent from '../../../components/models/lists/MediaListItemComponent';
import Media from '../../../domain/models/dtos/Media';
import { withRouter } from '../../../routes/Routes';

class GameFormPage extends ModelFormPage {
  createState(props) {
    let parentState = super.createState(props);
    parentState.game = new Game();
    parentState.selectedCategory = null;
    parentState.listedCategories = [];
    parentState.listedGames = [];
    parentState.mainImage = {};
    parentState.isDragingOver = false;
    parentState.medias = [];
    parentState.errors = null;
    parentState.successMessage = null;
    return parentState;
  }

  onChangeEditingGame(newOne) {
    this.navigate(`/admin/game/${newOne.value}`, { replace: true });
    if (newOne.value == -1) {
        this.setState({id: newOne.value, mode: MODEL_FORM_MODE_NEW, game: new Game(), medias: [], mainImage: {}});
    } else {
        this.setState({id: newOne.value, mode: MODEL_FORM_MODE_EDIT});
        this.requestGame(newOne.value, MODEL_FORM_MODE_EDIT);
    }
  }

  //---------------------------------------------------------------------------------------------
  // GAME FORM
  //---------------------------------------------------------------------------------------------

  onChangeName(event) {
    let game = this.state.game;
    game.name = event.target.value;
    this.setState({ game: game });
  }

  onChangeDescription(event) {
    let game = this.state.game;
    game.descripcion = event.target.value;
    this.setState({ game: game });
  }

  //---------------------------------------------------------------------------------------------
  // CATEGORIES FORM
  //---------------------------------------------------------------------------------------------

  onChangeSelectedCategory(event) {
    this.setState({ selectedCategory: event.value });
  }

  addSelectedCategory() {
    let selectedCategoryId = this.state.selectedCategory;
    if (!selectedCategoryId || selectedCategoryId <= 0) return;

    let category = Array.from(this.state.listedCategories)
      .find(v => v.id === selectedCategoryId);

    let game = new Game(this.state.game);
    game.addCategory(category);
    this.setState({ game: game });
  }

  onCategoryContextClick(id) {
    let categoriesElements = media.getElementById('categories-list');
    for(const element of categoriesElements.children) {
      if (element.id !== id) element.blur();
    }
  }

  onRemoveCategoryItemClick(id) {
    let game = new Game(this.state.game);
    game.removeCategory(id);
    this.setState({ game: game });
  }

  onDocumentContextClick(id) {
    let mediasElements = media.getElementById('medias-list');
    for(const element of mediasElements.children) {
      if (element.id !== id) element.blur();
    }
  }

  onRemoveDocumentItemClick(data) {
    let medias = Array.from(this.state.medias);
    let mediaIndex = medias.findIndex(v => v.id == data.id || v.name == data.name);
    medias.splice(mediaIndex, 1);
    this.setState({ medias: medias });
  }

  //---------------------------------------------------------------------------------------------
  // FILES FORM
  //---------------------------------------------------------------------------------------------

  /* Control when a drag event enter over the chat element, only works with files drag events */
  onDragEnter(e) {
    e.preventDefault();
    this.setState({ isDragingOver: true });
  }

  /* Control when a drag event enter over the chat element, only works with files drag events */
  onDragLeave(e) {
    e.preventDefault();
    this.setState({ isDragingOver: false });
  }

  /* Supports Multi-Files upload */
  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      const filesUpload = e.dataTransfer.files;

      // Read each dropped file and make a "Document" array of object
      var instance = this;
      var medias = this.state.medias;
      console.log(filesUpload);
      Array.from(filesUpload).forEach((image, index) => {
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = function (e) {
          let media = new Media();
          media.gamesId = null;
          media.name = image.name;
          media.mediaType = image.type;
          media.src = reader.result;
          medias.push(media);

          if (medias.length == filesUpload.length) {
            this.setState({ medias: medias, isDragingOver: false });
          }
        }.bind(instance);
      });
    }
  }

  // Used to upload main image
  onFileChange(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      var reader = new FileReader();
      var image = e.target.files[0];
      reader.readAsDataURL(image);
      reader.onloadend = function (e) {
        let media = new Media();
        media.gamesId = null;
        media.name = image.name;
        media.mediaType = image.type;
        media.src = reader.result;

        this.setState({ mainImage: media });
      }.bind(this);
    }
  };

  // Used to upload individual medias
  onMediaChange(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      var reader = new FileReader();
      var image = e.target.files[0];
      reader.readAsDataURL(image);
      reader.onloadend = function (e) {
        let media = new Media();
        media.gamesId = null;
        media.name = image.name;
        media.mediaType = image.type;
        media.src = reader.result;

        let medias = this.state.medias;
        medias.push(media);
        this.setState({ medias: medias });
      }.bind(this);
    }
  };

  removeDocument(id) {
    let medias = Array.from(this.state.medias);
    let mediaIndex = medias.findIndex(v => v.name === id);
    medias.splice(mediaIndex, 1);
    this.setState({ medias: medias });
  }

  //---------------------------------------------------------------------------------------------
  // SUBMIT
  //---------------------------------------------------------------------------------------------
  submit() {
    let game = new Game(this.state.game);
    game.categories = [];
    game.mainImage = this.state.mainImage;
    game.medias = this.state.medias;
    let request = new SocketRequest();
    request.setBody(JSON.stringify(game));
    request.setMethod('POST');

    let destination = DESTINATION_GAMES;
    if (game.id && game.id !== -1) {
      destination = DESTINATION_GAMES_UPDATE;
    }

    SocketController.sendCustomWithCallback(
      request, destination,
      this.onSuccess.bind(this),
      this.onFailed.bind(this)
    );
  }

  onSuccess(response) {
    if (response.data.status != 200) {
      this.onFailed(response);
      return;
    }
    this.requestListedGames();
    this.setState({successMessage: "Se ha guardado correctamente.", errors: null});
  }

  onFailed(response) {
    let responseData = response.data;
    if (responseData === undefined) {
      responseData = {};
    }
    this.setState({successMessage: null, errors: responseData.body });
  }

  componentDidMount() {
    SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_CATEGORIES, this.onCategorySuccess.bind(this));
    this.requestListedGames();
    this.requestGame();
  }

  onCategorySuccess(response) {
    this.setState({ listedCategories: response.data });
  }

  requestListedGames() {
    SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_GAMES, this.onGameListedSuccess.bind(this));
  }

  onGameListedSuccess(response) {
    this.setState({ listedGames: response.data});
  }

  requestGame(id = this.state.id, mode = this.state.mode) {
    if (mode === MODEL_FORM_MODE_EDIT && (id && id != -1)) {
      let request = new SocketRequest();
      request.setParams({id: id});
      SocketController.sendCustomWithCallback(request, DESTINATION_GAMES, this.onGameResult.bind(this));
    }
  }

  onGameResult(response) {
    let game = new Game(response.data);
    if (!game) game = new Game();
    let mainImage = {name: game.name, src: game.getImageUrl()};
    this.setState({ game: game, medias: game.medias, mainImage: mainImage });
  }

  render() {
    SessionManager.reload();
    return (
      <section className='row h-100 p-3 p-lg-0 m-0'>
        {this.checkSession()}
        <article className='d-flex flex-column mx-0 mx-lg-auto p-0 p-lg-2 col-12 col-lg-10'>
          <header>
            <h1 className='text-center'>Games Form</h1>
          </header>
          <form className='row w-100 m-0'>
            <section className='col-12 mb-3 p-0 px-lg-3'>
              <label htmlFor='selected-game-form'>Editing:</label>
              <Select id='selected-game-form' className='flex-grow-1 p-0 pt-2 pt-sm-0' 
                placeholder={this.state.game.name || 'New Game'}
                isOptionSelected={opt => opt.value == this.state.game.id}
                hideSelectedOptions={true}
                options={this.getGamesOptions()} 
                onChange={this.onChangeEditingGame.bind(this)}/>    
            </section>
            <section className='col-12 col-lg-8 mb-3 p-0 px-lg-3 order-1'>
              <section className='mb-3'>
                <label htmlFor='game-form--name' className='mb-sm-2'>Name:</label>
                <input id='game-form--name' className='w-100 form-control' type='text' value={this.state.game.name || ''} onChange={this.onChangeName.bind(this)} autoComplete='false' />
              </section>
              <section className='d-flex flex-column'>
                <label htmlFor='game-form--description'>Descripti&oacute;n:</label>
                <textarea id='game-form--description' className='form-control no-resize' rows={10} value={this.state.game.descripcion || ''} onChange={this.onChangeDescription.bind(this)} />
              </section>
            </section>

            <section className='col-12 col-lg-8 mb-3 p-0 px-lg-3 order-2 order-lg-3'>
              <hr className='w-100 my-3' />

              <section className='row w-100 m-0'>
                <Select className='col-12 col-sm-6 col-md-8 flex-grow-1 p-0 pr-sm-2' options={this.getCategoriesOptions()} onChange={this.onChangeSelectedCategory.bind(this)} />
                <a className='btn btn-form text-dark col-12 col-sm-6 col-md-4 m-0 mt-3 mt-sm-0' onClick={this.addSelectedCategory.bind(this)}>Add category</a>
              </section>

              <fieldset id='categories-list' title='Categories in game' className='d-flex flex-column flex-grow-1 w-100 border mt-3 border-gray rounded' style={{ minHeight: '200px' }}>
                <div className='d-flex flex-column flex-grow-1 w-100 h-100' style={{ minHeight: '200px' }}>
                  {this.getCategoriesList()}
                </div>
              </fieldset>
            </section>

            <section className='col-12 col-lg-4 d-flex flex-column mb-3 p-0 px-lg-3 order-3 order-lg-2'>
              <div className='mb-3'>
                <div className='row m-0 mt-3 mt-sm-0 mb-sm-2 p-0'>
                  <label className='col-12 col-sm-6 type-file m-0 my-sm-auto p-0'>Filename: {this.state.mainImage.name || 'None image uploaded'}</label>
                  <a className='col-12 col-sm-6 p-sm-0 btn btn-secondary w-100 text-priamry' data-tip={this.getMainImageView()}>Show image</a>
                </div>
                <div className='m-0 mt-3 mt-sm-0 p-0'>
                  <label htmlFor='image-form--logo' className='btn btn-form d-block m-0'>Upload main game image</label>
                  <input id='image-form--logo' className='form-control w-100' type="file" accept='image/*' onChange={this.onFileChange.bind(this)} />
                </div>
              </div>
              {this.getUploadFileView()}
            </section>

            <section className='d-flex flex-column col-12 col-lg-4 mb-3 p-0 px-lg-3 order-4'>
              <hr className='d-none d-lg-block w-100 border-0' />
              <fieldset id='medias-list' title='Medias in game' className='d-flex flex-column flex-grow-1 w-100 border border-gray rounded' style={{ minHeight: '200px' }}>
                <div className='d-flex flex-column flex-grow-1 w-100 h-100' style={{ minHeight: '200px' }}>
                  {this.getMediasList()}
                </div>
              </fieldset>
              <a className='btn btn-form w-100 mt-3 text-dark' onClick={this.submit.bind(this)}>Save all</a>
            </section>
          </form>
          {this.getSuccessView()}
          {this.getErrorView()}
        </article>
        <ReactTooltip html={true} place={'top'} />
      </section>
    );
  }

  checkSession() {
    return (SessionManager.checkExpiration()) ? <Navigate replace to="/home" /> : <></>;
  }

  getMainImageView() {
    return `<img src="${this.state.mainImage.src || process.env.REACT_APP_PUBLIC_API+'/assets/images/not-found.png'}" alt="Main image" style="max-width: 200px" />`;
  }

  getGamesOptions() {
    if ( !this.state.listedGames) return [];
    let gamesOptions = [{value: -1, label: 'New game'}];
    let listedGames = this.state.listedGames;
    for (const game of listedGames) {
      gamesOptions.push({ value: game.id, label: game.name });
    }
    return gamesOptions;
  }

  getCategoriesOptions() {
    if ( !this.state.game || !this.state.listedCategories ) return [];
    let categoriesOptions = [];
    let leakedCategories = SocketDataFilter.getGamesNotIn(this.state.listedCategories, this.state.game.categories);
    for (const leakedCategory of leakedCategories) {
      categoriesOptions.push({ value: leakedCategory.id, label: leakedCategory.name });
    }
    return categoriesOptions;
  }

  getCategoriesList() {
    if ( !this.state.game || !this.state.game.categories ) return [];
    let categoriesList = [];
    for (const category of this.state.game.categories) {
      let CategoryItem = withRouter(CategoryListItemComponent);
      categoriesList.push(<CategoryItem key={`category-item--${category.id}`} data={category} canRemove={true} onRemoveClick={this.onRemoveCategoryItemClick.bind(this)} />);
    }
    return categoriesList;
  }

  getMediasList() {
    if ( !this.state.game || !this.state.game.medias ) return [];
    let mediasList = [];
    for (const media of this.state.medias) {
      let MediaItem = withRouter(MediaListItemComponent);
      mediasList.push(<MediaItem key={`media-item--${media.name}`} data={media} canRemove={true} onRemoveClick={this.onRemoveDocumentItemClick.bind(this)} />);
    }
    return mediasList;
  }

  getUploadFileView() {
    return (
      <div className='d-flex flex-column flex-grow-1'>
        <label>Medias</label>
        <div className="d-none d-lg-block flex-grow-1 position-relative" onDragEnter={this.onDragEnter.bind(this)}>
          <div className={'dropzone p-1 text-center d-flex flex-column justify-content-center ' + this.getDraggingOverClass()}>
            <div>
              <div className='position-absolute p-left-top-0 w-100 h-100' onDragOver={(e) => e.preventDefault()} onDragLeave={this.onDragLeave.bind(this)} onDrop={this.onDrop.bind(this)}></div>
              <FontAwesomeIcon icon={faUpload} />
              <h1>Upload File</h1>
              <p>Drag & Drop files here or click to upload</p>
            </div>
          </div>
        </div>
        <div className='m-0 mt-3 mt-sm-2 p-0'>
          <label htmlFor='medias-form--logo' className='btn btn-form d-block m-0'>Upload media</label>
          <input id='medias-form--logo' className='form-control w-100' type="file" accept='image/*, video/*' onChange={this.onMediaChange.bind(this)} />
        </div>
      </div>
    );
  }

  // The style for the dragging files action over chat
  getDraggingOverClass() {
    return (this.state.isDragingOver) ? 'active' : '';
  }

}

export default GameFormPage;