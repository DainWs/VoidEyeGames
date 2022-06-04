import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import { EventDataProvider } from '../domain/EventDataProvider';
import { EventObserver } from '../domain/EventObserver';
import { EVENT_SEARCH_GAME } from '../domain/EventsEnum';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataProvideer } from '../services/socket/SocketDataProvider';
import { DESTINATION_CATEGORIES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';
import SocketRequest from '../services/socket/SocketRequest';

/**
 * TODO check big ones
 * FINISED. DO NOT TOUCH
 * @author Jose Antonio Duarte Perez
 */
class GamesPage extends React.Component {
  constructor(props) {
    super(props);
    this.pageNum = 1;
    this.isFiltring = false;
    this.hasMore = true;
    this.hasMoreCategories = true;
    this.hasMorePlataforms = true;
    this.searchTitle = EventDataProvider.provide(EVENT_SEARCH_GAME);
    this.state = {
      orderMethod: 'name',
      numOfCategories: 3,
      numOfPlataforms: 3,
      plataformsGames: [],
      categories: [],
      plataforms: [],
      selectedCategories: new Set(),
      selectedPlataforms: new Set()
    }
  }

  setOrder(event) {
    this.setState({orderMethod: event.target.value});
  }

  updateSearchedGame(newData) {
    this.searchTitle = newData;
    this.onFiltre();
  }

  updatePlataformGames() {
    let plataformsGames = (this.isFiltring) ? [] : Array.from(this.state.plataformsGames);
    let oldSize = plataformsGames.length;
    plataformsGames.push(...SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES));
    this.hasMore = (oldSize < plataformsGames.length);
    this.setState({plataformsGames: plataformsGames});
  }

  changeCategoryState(event) {
    var categoryId = event.target.value;
    let selectedCategories = this.state.selectedCategories;
    if (selectedCategories.has(categoryId)) selectedCategories.delete(categoryId);
    else selectedCategories.add(categoryId);
    this.setState({selectedCategories: selectedCategories});
  }

  changePlataformState(event) {
    var plataformId = event.target.value;
    let selectedPlataforms = this.state.selectedPlataforms;
    if (selectedPlataforms.has(plataformId)) selectedPlataforms.delete(plataformId);
    else selectedPlataforms.add(plataformId);
    this.setState({selectedPlataforms: selectedPlataforms});
  }

  updateCategories() {
    let categories = SocketDataProvideer.provide(DESTINATION_CATEGORIES);
    this.setState({categories: categories});
  }

  updatePlataforms() {
    let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
    this.setState({plataforms: plataforms});
  }

  onShowMore() {
    this.pageNum++;
    this.isFiltring = false;
    this.sendPlataformGamesRequest();
  }

  onShowMoreCategories() {
    let num = this.state.numOfCategories + 5;
    this.hasMoreCategories = this.state.categories.length > num;
    this.setState({numOfCategories: num})
  }

  onShowMorePlataforms() {
    let num = this.state.numOfPlataforms + 5;
    this.hasMorePlataforms = this.state.plataforms.length > num;
    this.setState({numOfPlataforms: num})
  }

  onFiltre() {
    this.pageNum = 1;
    this.isFiltring = true;
    this.sendPlataformGamesRequest();
  }

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
    
    let request = new SocketRequest();
    request.setParams(params);
    request.setMethod('GET');
    SocketController.sendCustom(request, DESTINATION_PLATAFORM_GAMES);
  }

  render() {
    return (
      <section className='d-flex flex-column flex-lg-row pb-3' style={{minHeight: '100%'}}>
        <aside className='border-lg-right border-secondary mh-sm-100 w-15 no-select'>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Order by</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              <label className='check-form mb-0 ml-3' htmlFor='order-name'>
                <input id='order-name' type="radio" value="name" name="order" checked={this.state.orderMethod == 'name'} onChange={this.setOrder.bind(this)}/> Name
                <span className="radiobtn"></span>
              </label>
              <label className='check-form mb-0 ml-3' htmlFor='order-price'>
                <input id='order-price' type="radio" value="price" name="order" checked={this.state.orderMethod == 'price'} onChange={this.setOrder.bind(this)}/> Price
                <span className="radiobtn"></span>
              </label>
              <label className='check-form mb-0 ml-3' htmlFor='order-plataform'>
                <input id='order-plataform' type="radio" value="plataform" name="order" checked={this.state.orderMethod == 'plataform'} onChange={this.setOrder.bind(this)}/> Plataform
                <span className="radiobtn"></span>
              </label>
            </div>
          </section>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Categories</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getCategories()}
              <div className='w-100 px-2'>
                {this.getCategoryShowMore()}
              </div>
            </div>
          </section>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Plataforms</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getPlataforms()}
              <div className='w-100 px-2'>
                {this.getPlataformShowMore()}
              </div>
            </div>
          </section>
          <div className='w-100 px-2'>
            <a className="btn btn-quaternary w-100" href="#" onClick={this.onFiltre.bind(this)}>
              <FontAwesomeIcon icon={faFilter} className='mr-2'/> 
              Filtre
            </a>
          </div>
        </aside>
        <article className='d-flex flex-column border-2 pt-4 px-4 pb-0 mw-100 mw-lg-80' style={{flexGrow: 1}}>
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
  
  getGamesItems() {
    let gamesItemsViews = [];
    for (const plataformGame of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.games.id} className='col-12 col-sm-6 col-md-3 p-3' style={{minHeight: 'calc(15vw + 10vh)'}}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews;
  }

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
    return (this.hasMoreCategories) ? <a className="btn btn-quaternary w-100" href="#" onClick={this.onShowMoreCategories.bind(this)}>Show more</a> : <></>;
  }

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
    return (this.hasMorePlataforms) ? <a className="btn btn-quaternary w-100" href="#" onClick={this.onShowMorePlataforms.bind(this)}>Show more</a> : <></>;
  }

  getCheckbox(type, object, onChange = function() {}) {
    return (
      <label className='check-form ml-3' key={ type + '-key-' + object.id}>
        {object.name}
        <input id={ type + '-' + object.id} type="checkbox" value={object.id} onChange={onChange}/>
        <span className="checkmark"></span>
      </label>
    );
  }

  getShowButtonView() {
    return (this.hasMore) ? <a className="btn btn-secondary w-100" href="#" onClick={this.onShowMore.bind(this)}>Show more</a> : <></>;
  }
}
export default GamesPage;
