import Carousel from 'nuka-carousel';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import GameItemSliderComponent from '../components/models/GameItemSliderComponent';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataProvideer } from '../services/socket/SocketDataProvider';
import { DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plataformsGames: []
    }
  }
  
  updatePlataformGames() {
    let plataformsGames = SocketDataProvideer.provide(DESTINATION_PLATAFORM_GAMES);
    console.log(plataformsGames);
    this.setState({plataformsGames: plataformsGames});
  }

  componentDidMount() {
    SocketObserver.subscribe(DESTINATION_PLATAFORM_GAMES, 'HomePage', this.updatePlataformGames.bind(this));
    SocketController.send(DESTINATION_PLATAFORM_GAMES);
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_PLATAFORM_GAMES, 'HomePage');
  }

  render() {
    let gamesWithDiscount = this.getGamesWithDiscount();
    let gamesItems = this.getGamesItems();
    return (
      <section>
        <header>
          <Carousel className='w-100' animation='zoom' autoplayInterval={5}>
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
      console.log(game.plataformsId + '-' + game.gamesId);
      discountedGames.push(
        <div key={game.plataformsId + '-' + game.gamesId + '--slider__items'} className='d-flex justify-content-center' style={{maxHeight: '60vh'}}>
          <GameItemSliderComponent plataformGame={game} showType='discount'/>
        </div>
      );
    }
    return discountedGames;
  }

  getGamesItems() {
    let gamesItemsViews = [];
    for (const game of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div key={game.plataformsId + '-' + game.gamesId + '--items'} className='col-12 col-sm-6 col-md-3 p-0'>
          <GameItemComponent plataformGame={game}/>
        </div>
      );
    }
    return gamesItemsViews;
  }
}

export default HomePage;