import Carousel from 'nuka-carousel';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import GameItemComponent from '../components/models/GameItemComponent';
import GameItemSliderComponent from '../components/models/GameItemSliderComponent';
import { EventObserver } from '../domain/EventObserver';
import { EVENT_SESSION_CHANGE } from '../domain/EventsEnum';
import { SessionManager } from '../domain/SessionManager';
import { SocketController } from '../services/socket/SocketController';
import { SocketDataFilter } from '../services/socket/SocketDataFilter';
import { DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
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
    if (SessionManager.check()) {
      EventObserver.notify(EVENT_SESSION_CHANGE);
    }
  }

  render() {
    return (
      <section className='w-100 h-100'>
        <header className='home--header bg-dark' style={{minHeight: '320px', height: 'calc(20vw + 35vh)'}}>
          <Carousel className='w-100' animation='zoom' autoplay={this.state.sliderGames.length > 1}>
            {this.getSliderItems()}
          </Carousel>
        </header>
        <article className='d-flex flex-column flex-grow-2 m-4 border-2'>
          <header>
            <h1 className='text-center'>News</h1>
          </header>
          <hr/>
          <div className='d-flex flex-wrap align-content-start justify-content-center'>
            {this.getNewsItems()}
          </div>
        </article>
      </section>
    );
  }

  getSliderItems() {
    if (this.state.sliderGames.length > 0) {
      return this.getGameSliderItems();
    }
    return this.getSkeletonSliderItems();
  }

  getGameSliderItems() {
    let discountedGames = [];
    for (const plataformGame of this.state.sliderGames) {
      console.log(plataformGame);
      discountedGames.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.gamesId + '--slider__items'} className='d-flex justify-content-center w-100 h-100'>
          <GameItemSliderComponent plataformGame={plataformGame} showType='discount'/>
        </div>
      );
    }
    return discountedGames;
  }

  getSkeletonSliderItems() {
    return [
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>,
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>,
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>
    ];
  }

  getNewsItems() {
    if (this.state.plataformsGames.length > 0) {
      return this.getGamesItems();
    }
    return this.getSkeletonItems();
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
    return gamesItemsViews;
  }

  getSkeletonItems() {
    return [
      <Skeleton key='news-skeleton-1' className='p-0' width='90vw' height='30vh'/>
    ];
  }
}

export default HomePage;