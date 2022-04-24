import Carousel from 'nuka-carousel';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import AjaxController from '../services/ajax/AjaxController';
import AjaxRequest from '../services/ajax/AjaxRequest';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      plataformsGames: []
    }
  }
  

  updateGames(response) {
    console.log(response);
    this.setState({plataformsGames: response.data});
  }

  componentDidMount() {
    AjaxController.send(new AjaxRequest(), '/plataformGames', this.updateGames.bind(this));
  }

  render() {
    let gamesWithDiscount = this.getGamesWithDiscount();
    let gamesItems = this.getGamesItems();
    return (
      <section>
        <header>
          <Carousel className='w-100'>
            {gamesWithDiscount}
          </Carousel>
        </header>
        <article className='border-2 m-4'>
          <header>
            <h1 className='text-center'>News</h1>
          </header>
          <hr/>
          <div className='row'>
            {gamesItems}
          </div>
        </article>
      </section>
    );
  }

  getGamesWithDiscount() {
    let discountedGames = [];
    for (const game of this.state.plataformsGames) {
      discountedGames.push(
        <div key={game.plataformsId + '-' + game.gamesId} style={{height: '60vw', maxHeight: '60vh'}}>
          <GameItemComponent key={game.plataformsId + '-' + game.gamesId} plataformGame={game} showType='discount'/>
        </div>
      );
    }
    return discountedGames;
  }

  getGamesItems() {
    let gamesItemsViews = [];
    for (const game of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div className='col-12 col-sm-6 col-md-3 p-0'>
          <GameItemComponent key={game.plataformsId + '-' + game.gamesId} plataformGame={game}/>
        </div>
      );
    }
    return gamesItemsViews;
  }
}

export default HomePage;