import { faAngleDown, faAngleUp, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import { CacheConfiguration, GAMES_COUNT, GAMES_LIMIT_PER_PAGE } from '../domain/cache/CacheConfiguration';
import { EventDataProvider } from '../domain/EventDataProvider';
import { EventObserver } from '../domain/EventObserver';
import { EVENT_SEARCH_GAME } from '../domain/EventsEnum';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataProvideer } from '../services/socket/SocketDataProvider';
import { DESTINATION_CATEGORIES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';
import SocketRequest from '../services/socket/SocketRequest';

/**
 * Represents the 'Juegos' View, this page show/filtre/search games.
 * 
 * This class has grown so much because it has to handle Categories/Platforms and games.
 * in addition to the requests that you have to make on the API's for this purpose.
 */
class GamesPage extends React.Component {
  constructor(props) {
    super(props);
    this.pageNum = 1;
    this.isFiltring = false;
    this.hasMore = true;
    this.hasMoreCategories = true;
    this.hasMorePlataforms = true;
    this.scrollYPosition = 0;
    this.searchTitle = EventDataProvider.provide(EVENT_SEARCH_GAME);
    this.state = {
      orderMethod: 'name',
      numOfCategories: 3,
      numOfPlataforms: 3,
      plataformsGames: [],
      categories: [],
      plataforms: [],
      selectedCategories: new Set(),
      selectedPlataforms: new Set(),
      isShowingFilters: false
    }
  }

  //============================================
  // PLATAFORMS GAMES
  //============================================
  updateSearchedGame(newData) {
    this.searchTitle = newData;
    this.onFiltre();
  }

  updatePlataformGames() {
    let plataformsGames = (this.isFiltring) ? [] : Array.from(this.state.plataformsGames);
    plataformsGames.push(...SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES));
    let expectedGamesCount = this.pageNum * CacheConfiguration.get(GAMES_LIMIT_PER_PAGE);
    console.log(plataformsGames.length);
    console.log(expectedGamesCount);
    this.hasMore = ( plataformsGames.length >= expectedGamesCount );
    this.setState({plataformsGames: plataformsGames});
  }

  onShowMore() {
    this.pageNum++;
    this.isFiltring = false;
    this.sendPlataformGamesRequest();
  }

  //============================================
  // FILTERS LISTS
  //============================================

  //---------------------------------------
  // CATEGORIES
  //---------------------------------------
  changeCategoryState(event) {
    var categoryId = event.target.value;
    let selectedCategories = this.state.selectedCategories;
    if (selectedCategories.has(categoryId)) selectedCategories.delete(categoryId);
    else selectedCategories.add(categoryId);
    this.setState({selectedCategories: selectedCategories});
  }

  updateCategories() {
    let categories = SocketDataProvideer.provide(DESTINATION_CATEGORIES);
    this.setState({categories: categories});
  }

  onShowMoreCategories() {
    let num = this.state.numOfCategories + 5;
    this.hasMoreCategories = this.state.categories.length > num;
    this.setState({numOfCategories: num})
  }

  //---------------------------------------
  // PLATAFORMS
  //---------------------------------------

  updatePlataforms() {
    let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
    this.setState({plataforms: plataforms});
  }

  changePlataformState(event) {
    var plataformId = event.target.value;
    let selectedPlataforms = this.state.selectedPlataforms;
    if (selectedPlataforms.has(plataformId)) selectedPlataforms.delete(plataformId);
    else selectedPlataforms.add(plataformId);
    this.setState({selectedPlataforms: selectedPlataforms});
  }

  onShowMorePlataforms() {
    let num = this.state.numOfPlataforms + 5;
    this.hasMorePlataforms = this.state.plataforms.length >= num;
    this.setState({numOfPlataforms: num})
  }

  //============================================
  // FILTERS UTILS
  //============================================
  setOrder(event) {
    this.setState({orderMethod: event.target.value});
  }

  showOrHideFilters() {
    this.scrollYPosition = 0;
    let isShowingFilters = this.state.isShowingFilters;
    this.setState({isShowingFilters: !isShowingFilters});
  }

  onFiltre() {
    this.pageNum = 1;
    this.isFiltring = true;
    this.sendPlataformGamesRequest();
  }

  //============================================
  // COMPONENT UTILS
  //============================================

  componentDidMount() {
    EventObserver.subscribe(EVENT_SEARCH_GAME, 'GamesPage', this.updateSearchedGame.bind(this));
    SocketObserver.subscribe(DESTINATION_CATEGORIES, 'GamesPage', this.updateCategories.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORMS, 'GamesPage', this.updatePlataforms.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage', this.updatePlataformGames.bind(this));
    
    SocketController.send(DESTINATION_CATEGORIES);
    SocketController.send(DESTINATION_PLATAFORMS);
    this.sendPlataformGamesRequest();
  }

  componentWillUnmount() {
    EventObserver.unsubscribe(EVENT_SEARCH_GAME, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_CATEGORIES, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORMS, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage');
  }

  sendPlataformGamesRequest() {
    let params = {};
    params.pageNum = this.pageNum;
    params.name = this.searchTitle;
    params.sort = this.state.orderMethod;
    params.categories = Array.from(this.state.selectedCategories);
    params.plataforms = Array.from(this.state.selectedPlataforms);
    
    this.scrollYPosition = document.scrollingElement.scrollTop;
    let request = new SocketRequest();
    request.setParams(params);
    request.setMethod('GET');
    SocketController.sendCustom(request, DESTINATION_PLATAFORM_GAMES);
  }

  //============================================
  // VIEW
  //============================================
  render() {
    window.scrollTo(0, this.scrollYPosition);
    return (
      <section className='d-flex flex-column flex-lg-row' style={{minHeight: '100%'}}>
        <aside className={this.getAsideClass()}>
          <section className='d-block d-lg-none'>
            <header className='btn btn-secondary border-0 rounded-0 w-100 text-primary d-flex align-items-center m-0' style={{minHeight: '60px'}} onClick={this.showOrHideFilters.bind(this)}>
              <h4 className='m-0 p-0 flex-grow-1 text-left'>Filtros</h4>
              <div className=''>{this.getFilterText()}</div>
            </header>
          </section>
          <section className={this.getFilterClass()}>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Ordenar por</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              <label className='check-form capitalize mb-0 ml-3' htmlFor='order-name'>
                <input id='order-name' type="radio" value="name" name="order" checked={this.state.orderMethod == 'name'} onChange={this.setOrder.bind(this)}/> Nombres
                <span className="radiobtn"></span>
              </label>
              <label className='check-form capitalize mb-0 ml-3' htmlFor='order-price'>
                <input id='order-price' type="radio" value="price" name="order" checked={this.state.orderMethod == 'price'} onChange={this.setOrder.bind(this)}/> Precios
                <span className="radiobtn"></span>
              </label>
              <label className='check-form capitalize mb-0 ml-3' htmlFor='order-plataform'>
                <input id='order-plataform' type="radio" value="plataform" name="order" checked={this.state.orderMethod == 'plataform'} onChange={this.setOrder.bind(this)}/> Plataformas
                <span className="radiobtn"></span>
              </label>
            </div>
          </section>
          <section className={this.getFilterClass()}>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Categor&iacute;as</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getCategories()}
              <div className='w-100 px-2'>
                {this.getCategoryShowMore()}
              </div>
            </div>
          </section>
          <section className={this.getFilterClass()}>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Plataformas</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getPlataforms()}
              <div className='w-100 px-2'>
                {this.getPlataformShowMore()}
              </div>
            </div>
          </section>
          <div className={'w-100 px-0 px-lg-2 ' + this.getFilterClass()}>
            <a className="btn btn-quaternary rounded-0 w-100" href="#" onClick={this.onFiltre.bind(this)}>
              <FontAwesomeIcon icon={faFilter} className='mr-2'/> 
              Filtrar
            </a>
          </div>
          <section className={this.getFilterCloseClass()}>
            <header className='btn btn-secondary border-0 rounded-0 w-100 text-primary d-flex align-items-center justify-content-center mt-0 mx-0 mb-0' 
              onClick={this.showOrHideFilters.bind(this)}>
              <div className=''>{this.getFilterText()}</div>
            </header>
          </section>
        </aside>
        <article className='d-flex flex-column border-2 p-0 pb-3 pt-md-2 px-md-2 pb-0 mw-100 mw-lg-80' style={{flexGrow: 1}}>
          <div className='flex-grow-1'>
            <div className='row m-0 p-0'>
              {this.getGamesItems()}
            </div>
          </div>
          {this.getShowButtonView()}
        </article>
      </section>
    );
  }

  //============================================
  // FILTERS
  //============================================

  getAsideClass() {
    if (this.state.isShowingFilters) {
      return 'filter-aside filter-active border-lg-right border-secondary mh-sm-100 w-15 no-select';
    }
    return 'filter-aside border-lg-right border-secondary mh-sm-100 w-15 pb-3 no-select';
  }

  getFilterText() {
    if (this.state.isShowingFilters) {
      return <FontAwesomeIcon icon={faAngleDown} className='m-0 mr-2 h4'/>;
    }
    return <FontAwesomeIcon icon={faAngleUp} className='m-0 mr-2 h4'/>;
  }

  getFilterClass() {
    if (this.state.isShowingFilters) {
      return 'd-block d-lg-block';
    }
    return 'd-none d-lg-block';
  }

  getFilterCloseClass() {
    if (this.state.isShowingFilters) {
      return 'd-block d-lg-none';
    }
    return 'd-none d-lg-none';
  }

  //---------------------------------------
  // GAMES
  //---------------------------------------
  
  getGamesItems() {
    let gamesItemsViews = [];
    for (const plataformGame of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.games.id} className='col-12 col-sm-6 col-md-3 p-2 p-md-1 p-lg-2' style={{minHeight: 'calc(15vw + 10vh)'}}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews;
  }

  //---------------------------------------
  // CATEGORIES
  //---------------------------------------

  getCategories() {
    let categories = this.state.categories;
    let categoryItemViews = new Set();
    for (let i = 0; i < categories.length && i < this.state.numOfCategories; i++) {
      let category = categories[i];
      categoryItemViews.add(this.getCategoryView(category));
    }
    return categoryItemViews;
  }

  getCategoryView(category) {
    return this.getCheckbox('category', category, this.changeCategoryState.bind(this));
  }

  getCategoryShowMore() {
    return (this.hasMoreCategories) ? <a className="btn btn-quaternary w-100 capitalize" href="#" onClick={this.onShowMoreCategories.bind(this)}>Mostrar mas</a> : <></>;
  }

  //---------------------------------------
  // PLATAFORMS
  //---------------------------------------

  getPlataforms() {
    let plataforms = this.state.plataforms;
    let plataformItemViews = new Set();
    for (let i = 0; i < plataforms.length && i < this.state.numOfPlataforms; i++) {
      let plataform = plataforms[i];
      plataformItemViews.add(this.getPlataformView(plataform));
    }
    return plataformItemViews;
  }

  getPlataformView(plataform) {
    return this.getCheckbox('plataform', plataform, this.changePlataformState.bind(this));
  }

  getPlataformShowMore() {
    return (this.hasMorePlataforms) ? <a className="btn btn-quaternary w-100 capitalize" href="#" onClick={this.onShowMorePlataforms.bind(this)}>Mostrar mas</a> : <></>;
  }

  getCheckbox(type, object, onChange = function() {}) {
    return (
      <label className='check-form capitalize ml-3' key={ type + '-key-' + object.id}>
        {object.name}
        <input id={ type + '-' + object.id} type="checkbox" value={object.id} onChange={onChange}/>
        <span className="checkmark"></span>
      </label>
    );
  }

  getShowButtonView() {
    return (this.hasMore) ? <a className="btn btn-secondary rounded-0 w-100 capitalize" href="#" onClick={this.onShowMore.bind(this)}>Mostrar mas</a> : <></>;
  }
}
export default GamesPage;
