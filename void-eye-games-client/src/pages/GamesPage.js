import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataProvideer } from '../services/socket/SocketDataProvider';
import { DESTINATION_CATEGORIES, DESTINATION_PLATAFORMS, DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';
import { Comparators } from '../utils/Comparators';

/**
 * TODO check big ones
 * FINISED. DO NOT TOUCH
 * @author Jose Antonio Duarte Perez
 */
class GamesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    let plataformsGames = SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES);
    this.setState({plataformsGames: plataformsGames});
  }

  changeCategoryState(event) {
    var categoryId = event.target.value;
    let category = this.state.categories.find(c => c.id === categoryId);
    let newSelectedCategories = this.state.selectedCategories;
    if (newSelectedCategories.has(category)) newSelectedCategories.delete(category);
    else newSelectedCategories.add(category);
    this.setState({selectedCategories: newSelectedCategories});
  }

  updateCategories() {
    let categories = SocketDataProvideer.provide(DESTINATION_CATEGORIES);
    this.setState({categories: categories});
  }

  changePlataformState(event) {
    var plataformId = event.target.value;
    let newSelectedPlataforms = this.state.selectedPlataforms;
    if (newSelectedPlataforms.has(plataformId)) newSelectedPlataforms.delete(plataformId);
    else newSelectedPlataforms.add(plataformId);
    this.setState({selectedPlataforms: newSelectedPlataforms});
  }

  updatePlataforms() {
    let plataforms = SocketDataProvideer.provide(DESTINATION_PLATAFORMS);
    this.setState({plataforms: plataforms});
  }

  componentDidMount() {
    SocketObserver.subscribe(DESTINATION_CATEGORIES, 'GamesPage', this.updateCategories.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORMS, 'GamesPage', this.updatePlataforms.bind(this));
    SocketObserver.subscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage', this.updatePlataformGames.bind(this));
    SocketController.send(DESTINATION_CATEGORIES);
    SocketController.send(DESTINATION_PLATAFORMS);
    SocketController.send(DESTINATION_PLATAFORM_GAMES);
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_CATEGORIES, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORMS, 'GamesPage');
    SocketObserver.unsubscribe(DESTINATION_PLATAFORM_GAMES, 'GamesPage');
  }

  render() {
    let gameItems = this.getGamesItems();
    let categoryItems = this.getCategories();
    let plataformItems = this.getPlataforms();
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
              {categoryItems}
            </div>
          </section>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Plataforms</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              {plataformItems}
            </div>
          </section>
        </aside>
        <article className='border-2 m-4 mw-100 mw-lg-80' style={{flexGrow: 1}}>
          <div className='row'>
            {gameItems}
          </div>
        </article>
      </section>
    );
  }
  
  getGamesItems() {
    let gamesItemsViews = [];
    for (const plataformGame of this.getSortedPlataformsGames()) {
      gamesItemsViews.push(
        <div className='col-12 col-sm-6 col-md-3 p-0' key={plataformGame.plataformsId + '-' + plataformGame.gamesId}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews;
  }

  getSortedPlataformsGames() {
    let comparator = Comparators.get(this.state.orderMethod);
    let leakedPlataformsGames = this.getLeakedPlataformsGames();
    return leakedPlataformsGames.sort(comparator);
  }

  getLeakedPlataformsGames() {
    let plataformsGames = this.state.plataformsGames;
    if (this.state.selectedCategories.size > 0) {
      plataformsGames = this.leakGamesByCategories(plataformsGames);
    }

    if (this.state.selectedPlataforms.size > 0) {
      plataformsGames = this.leakGamesByPlataforms(plataformsGames);
    }
    return plataformsGames;
  }

  leakGamesByCategories(plataformGames) {
    let categoriesFilter = function(plataformGame) {
      let result = true;
      for (const category of this.state.selectedCategories) {
        let findedGame = Array.from(category.games).find(g => g.id === plataformGame.gamesId);
        if (findedGame == null) result = false;
      }
      return result;
    };
    return plataformGames.filter(categoriesFilter.bind(this));
  }

  leakGamesByPlataforms(plataformGames) {
    let plataformsFilter = function(plataformGame) {
      return this.state.selectedPlataforms.has(plataformGame.plataformsId);
    }
    return plataformGames.filter(plataformsFilter.bind(this));
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
}
export default GamesPage;