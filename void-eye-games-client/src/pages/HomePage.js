import Carousel from 'nuka-carousel';
import React from 'react';
import GameItemComponent from '../components/models/GameItemComponent';
import GameItemSliderComponent from '../components/models/GameItemSliderComponent';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataFilter } from '../services/socket/SocketDataFilter';
import { SocketDataProvideer } from '../services/socket/SocketDataProvider';
import { DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';
import SocketRequest from '../services/socket/SocketRequest';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderGames: [],
      plataformsGames: []
    }
  }
  
  updateSliderGames(response) {
    this.setState({sliderGames: response.data});
  }

  updatePlataformGames(response) {
    let plataformsGames = this.state.plataformsGames;
    plataformsGames.push(...response.data);
    this.setState({plataformsGames: plataformsGames});
  }

  sendSliderGamesRequest() {
    let request = new SocketRequest();
    request.setParams({pageNum: 1, discount: true});
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(request, DESTINATION_PLATAFORM_GAMES, this.updateSliderGames.bind(this));
  }

  sendGamesRequest(page = 1) {
    let request = new SocketRequest();
    request.setParams({pageNum: page});
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(request, DESTINATION_PLATAFORM_GAMES, this.updatePlataformGames.bind(this));
  }

  componentDidMount() {
    this.sendGamesRequest(1);
    this.sendGamesRequest(2);
    this.sendSliderGamesRequest();
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_PLATAFORM_GAMES, 'HomePage');
  }

  render() {
    let gamesWithDiscount = this.getGamesWithDiscount();
    let gamesItems = this.getGamesItems();
    return (
      <section className='w-100 h-100'>
        <header className='home--header bg-dark' style={{minHeight: '320px', height: 'calc(20vw + 35vh)'}}>
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