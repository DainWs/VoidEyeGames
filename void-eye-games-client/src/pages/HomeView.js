import Carousel from 'nuka-carousel';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import AjaxController from '../services/ajax/AjaxController';
import AjaxRequest from '../services/ajax/AjaxRequest';

class HomeView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: []
    }
  }
  

  updateGames(response) {
    console.log(response);
    this.setState({games: response.data});
  }

  componentDidMount() {
    AjaxController.send(new AjaxRequest(), '/games', this.updateGames.bind(this));
  }

  render() {
    let gamesWithDiscount = this.getGamesWithDiscount();
    let gamesItems = this.getGamesItems();
    return (
      <div className='container'>
        <header>
          <Carousel>
            {gamesWithDiscount}
          </Carousel>
        </header>
        <div>
          {gamesItems}
        </div>
      </div>
    );
  }

  getGamesWithDiscount() {
    let discountedGames = [];
    for (const game of this.state.games) {
      discountedGames.push(<div key={game.id} style={{height: '60vw', maxHeight: '60vh'}}>{game.name}</div>);
    }
    return discountedGames;
  }

  getGamesItems() {
    let gamesItemsViews = [];
    for (const game of this.state.games) {
      gamesItemsViews.push(<GameItemComponent key={game.id} game={game}/>);
    }
    return gamesItemsViews;
  }
}

export default HomeView;
