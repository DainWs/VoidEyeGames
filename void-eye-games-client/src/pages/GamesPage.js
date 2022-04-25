import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import AjaxController from '../services/ajax/AjaxController';
import AjaxRequest from '../services/ajax/AjaxRequest';

// SORTERS
const NAME_COMPARATOR = (o1, o2) => {
  if (o1.name < o2.name) return 1;
  else if (o1.name > o2.name) return -1;
  return 0;
}

const PRICE_COMPARATOR = (o1, o2) => {
  return o1.price - o2.price;
}

const PLATAFORM_COMPARATOR = (o1, o2) => {
  return o1.plataformId - o2.plataformId;
}

const SORTERS = new Map();
SORTERS.set('name', NAME_COMPARATOR);
SORTERS.set('price', PRICE_COMPARATOR);
SORTERS.set('plataform', PLATAFORM_COMPARATOR);

//TODO Orders
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

  setOrder(newOrderMethod) {
    this.setState({orderMethod: newOrderMethod})
  }

  updateGames(response) {
    this.setState({plataformsGames: response.data});
  }

  changeCategoryState(category) {
    let newSelectedCategories = this.state.selectedCategories;
    if (newSelectedCategories.has(category)) newSelectedCategories.delete(category);
    else newSelectedCategories.add(category);
    this.setState({selectedCategories: newSelectedCategories});
  }

  updateCategories(response) {
    this.setState({categories: response.data});
  }

  changePlataformState(plataform) {
    let newSelectedPlataforms = this.state.selectedPlataforms;
    if (newSelectedPlataforms.has(plataform)) newSelectedPlataforms.delete(plataform);
    else newSelectedPlataforms.add(plataform);
    this.setState({selectedPlataforms: newSelectedPlataforms});
  }

  updatePlataforms(response) {
    this.setState({plataforms: response.data});
  }

  componentDidMount() {
    AjaxController.send(new AjaxRequest(), '/plataformGames', this.updateGames.bind(this));
    AjaxController.send(new AjaxRequest(), '/categories', this.updateCategories.bind(this));
    AjaxController.send(new AjaxRequest(), '/plataforms', this.updatePlataforms.bind(this));
  }

  render() {
    let gameItems = this.getGamesItems();
    let categoryItems = this.getCategories();
    let plataformItems = this.getPlataforms();
    return (
      <section className='d-flex'>
        <aside className='border-right border-secondary' style={{minHeight: '100vh', minWidth: '15vw', width: '15vw'}}>
          <section>
            <header className='bg-secondary text-primary'>
              <h4 className='m-0 px-2 py-2'>Order by</h4>
            </header>
            <div className='d-flex flex-column mt-2 mb-4'>
              <label className='m-0 pl-3' htmlFor='order-name'>
                <input id='order-name' type="radio" value="Name" name="order" checked={this.state.orderMethod == 'name'} onChange={this.setOrder.bind(this)}/> Name
              </label>
              <label className='m-0 pl-3' htmlFor='order-price'>
                <input id='order-price' type="radio" value="Price" name="order" checked={this.state.orderMethod == 'price'} onChange={this.setOrder.bind(this)}/> Price
              </label>
              <label className='m-0 pl-3' htmlFor='order-plataform'>
                <input id='order-plataform' type="radio" value="Plataform" name="order" checked={this.state.orderMethod == 'plataform'} onChange={this.setOrder.bind(this)}/> Plataform
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
        <article className='border-2 m-4' style={{maxWidth: '80vw', flexGrow: 1}}>
          <div className='row'>
            {gameItems}
          </div>
        </article>
      </section>
    );
  }

  getGamesItems() {
    let filterGames = this.state.plataformsGames;
    filterGames = filterGames.sort(SORTERS.get(this.state.orderMethod));

    if (this.state.selectedCategories.size > 0) {
      filterGames = this.filterGamesByCategories(filterGames);
    }

    if (this.state.selectedPlataforms.size > 0) {
      filterGames = this.filterGamesByPlataforms(filterGames);
    }

    let gamesItemsViews = [];
    for (const game of filterGames) {
      gamesItemsViews.push(
        <div className='col-12 col-sm-6 col-md-3 p-0' key={game.plataformsId + '-' + game.gamesId}>
          <GameItemComponent plataformGame={game}/>
        </div>
      );
    }
    return gamesItemsViews;
  }

  filterGamesByCategories(games) {
    let categoriesFilter = function(game) {
      return this.state.selectedCategories.has(game.gamesId);
    };
    return games.filter(categoriesFilter.bind(this));
  }

  filterGamesByPlataforms(games) {
    let plataformsFilter = function(game) {
      return this.state.selectedPlataforms.has(game.plataformsId);
    }
    return games.filter(plataformsFilter.bind(this));
  }

  getCategories() {
    let categoryItemViews = [];
    for (const category of this.state.categories) {
      categoryItemViews.push(
        <label 
          className='m-0 pl-3' 
          key={'category-key-' + category.id} 
          htmlFor={'category-' + category.id}>
          <input 
            id={'category-' + category.id} 
            className="mr-1" 
            type="checkbox" 
            value={category.id}
            onChange={()=>{this.changeCategoryState.bind(this)(category.id)}}/>
            {category.name}
        </label>
      );
    }
    return categoryItemViews;
  }

  getPlataforms() {
    let plataformItemViews = [];
    for (const plataform of this.state.plataforms) {
      plataformItemViews.push(
        <label 
          className='m-0 pl-3' 
          key={'plataform-key-' + plataform.id} 
          htmlFor={'plataform-' + plataform.id}>
          <input 
            id={'plataform-' + plataform.id} 
            className="mr-1" 
            type="checkbox" 
            value={plataform.id} 
            onChange={()=>{this.changePlataformState.bind(this)(plataform.id)}}/>
            {plataform.name}
        </label>
      );
    }
    return plataformItemViews;
  }
}
export default GamesPage;