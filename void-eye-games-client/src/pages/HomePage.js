import Carousel from 'nuka-carousel';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import GameItemSliderComponent from '../components/models/GameItemSliderComponent';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataFilter } from '../services/socket/SocketDataFilter';
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
      <section className='w-100 h-100'>
        <header className='home--header' style={{minHeight: '320px', height: 'calc(20vw + 35vh)'}}>
          <Carousel className='w-100' animation='zoom' autoplay={true}>
            {gamesWithDiscount}
          </Carousel>
        </header>
        <article className='d-flex flex-column flex-grow-2 m-4 border-2'>
          <header>
            <h1 className='text-center'>News</h1>
          </header>
          <hr/>
          <div className='d-flex flex-wrap align-content-start'>
            {gamesItems}
          </div>
        </article>
      </section>
    );
  }

  getGamesWithDiscount() {
    let discountedGames = [];
    let gamesList = SocketDataFilter.getBestPlataforms(this.state.plataformsGames, true);
    for (const plataformGame of gamesList) {
      discountedGames.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.gamesId + '--slider__items'} className='d-flex justify-content-center w-100 h-100'>
          <GameItemSliderComponent plataformGame={plataformGame} showType='discount'/>
        </div>
      );
    }
    return discountedGames;
  }

  getGamesItems() {
    let gamesItemsViews = [];
    for (const plataformGame of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.gamesId + '--items'} className='p-0' style={{flex: '1 1 30vh', minHeight: '30vh', maxHeight: '255px'}}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews.slice(0, 7);
  }
}

export default HomePage;