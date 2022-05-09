import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
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

    let searchTitle = (props.searchTitle) ? props.searchTitle : '';
    this.state = {
      searchTitle: searchTitle,
      orderMethod: 'name',
      plataformsGames: [],
      categories: [],
      plataforms: [],
      selectedCategories: new Set(),
      selectedPlataforms: new Set()
    }
  }

  setOrder(event) {
    this.setState({orderMethod: event.target.value})
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

  onFiltre() {
    this.pageNum = 1;
    this.isFiltring = true;
    this.sendPlataformGamesRequest();
  }

  componentDidMount() {
    SocketObserver.subscribe(DESTINATION_CATEGORIES, 'GamesPage', this.updateCategories.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORMS, 'GamesPage', this.updatePlataforms.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage', this.updatePlataformGames.bind(this));
    SocketController.send(DESTINATION_CATEGORIES);
    SocketController.send(DESTINATION_PLATAFORMS);
    this.sendPlataformGamesRequest();
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_CATEGORIES, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORMS, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage');
  }

  sendPlataformGamesRequest() {
    let params = {};
    params.pageNum = this.pageNum;
    params.name = this.state.searchTitle;
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
      <section className='d-flex flex-column flex-lg-row' style={{minHeight: '100%'}}>
        <aside className='border-lg-right border-secondary mh-sm-100 w-15 no-select' style={{minWidth: '15vw'}}>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Order by</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              <label className='m-0 pl-3' htmlFor='order-name'>
                <input id='order-name' type="radio" value="name" name="order" checked={this.state.orderMethod == 'name'} onChange={this.setOrder.bind(this)}/> Name
              </label>
              <label className='m-0 pl-3' htmlFor='order-price'>
                <input id='order-price' type="radio" value="price" name="order" checked={this.state.orderMethod == 'price'} onChange={this.setOrder.bind(this)}/> Price
              </label>
              <label className='m-0 pl-3' htmlFor='order-plataform'>
                <input id='order-plataform' type="radio" value="plataform" name="order" checked={this.state.orderMethod == 'plataform'} onChange={this.setOrder.bind(this)}/> Plataform
              </label>
            </div>
          </section>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Categories</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getCategories()}
            </div>
          </section>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Plataforms</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {this.getPlataforms()}
            </div>
          </section>
          <a className="btn btn-secondary w-100" href="#" onClick={this.onFiltre.bind(this)}>Filtre</a>
        </aside>
        <article className='border-2 p-4 mw-100 mw-lg-80' style={{flexGrow: 1}}>
          <div className='row m-0 p-0'>
            {this.getGamesItems()}
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
        <div key={plataformGame.plataformsId + '-' + plataformGame.games.id} className='col-12 col-sm-6 col-md-3 p-0' style={{minHeight: 'calc(15vw + 10vh)'}}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews;
  }

  getCategories() {
    let categoryItemViews = [];
    for (const category of this.state.categories) {
      categoryItemViews.push(this.getCategoryView(category));
    }
    return categoryItemViews;
  }

  getCategoryView(category) {
    return (
      <label className='m-0 pl-3' key={'category-key-' + category.id} htmlFor={'category-' + category.id}>
        <input 
          id={'category-' + category.id} 
          className="mr-1" 
          type="checkbox" 
          value={category.id}
          onChange={this.changeCategoryState.bind(this)}/> {category.name}
      </label>
    );
  }

  getPlataforms() {
    let plataformItemViews = [];
    for (const plataform of this.state.plataforms) {
      plataformItemViews.push(this.getPlataformView(plataform));
    }
    return plataformItemViews;
  }

  getPlataformView(plataform) {
    return (
      <label className='m-0 pl-3' key={'plataform-key-' + plataform.id} htmlFor={'plataform-' + plataform.id}>
        <input 
          id={'plataform-' + plataform.id} 
          className="mr-1" 
          type="checkbox" 
          value={plataform.id} 
          onChange={this.changePlataformState.bind(this)}/> {plataform.name}
      </label>
    );
  }

  getShowButtonView() {
    return (this.hasMore) ? <a className="btn btn-secondary w-100" href="#" onClick={this.onShowMore.bind(this)}>Show More</a> : <></>;
  }
}
export default GamesPage;
