/**
 * File: HomePage.js
 * Purpose: Represents the home page view.
 * DB Access: No
 * Used from:
 *  - Index.js
 * Uses files:
 *  - The following imported files:
 */
import Carousel from 'nuka-carousel';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import GameItemComponent from '../components/models/GameItemComponent';
import GameItemSliderComponent from '../components/models/GameItemSliderComponent';
import { CacheConfiguration, GAMES_COUNT, GAMES_LIMIT_PER_PAGE, ON_CACHE_LOAD } from '../domain/cache/CacheConfiguration';
import { EventObserver } from '../domain/EventObserver';
import { EVENT_SESSION_CHANGE } from '../domain/EventsEnum';
import { SessionManager } from '../domain/SessionManager';
import { SocketController } from '../services/socket/SocketController';
import { DESTINATION_PLATAFORM_GAMES } from '../services/socket/SocketDestinations';
import SocketRequest from '../services/socket/SocketRequest';

const CAROUSER_CONTROLS_CONFIG = {
  containerClassName: '',
  nextButtonClassName: 'slider--control',
  nextButtonStyle: {height: 'calc(calc(20vw + 35vh)/2)'}, 
  nextButtonText: '>',
  pagingDotsClassName: '',
  pagingDotsContainerClassName: '',
  pagingDotsStyle: {}, 
  prevButtonClassName: 'slider--control',
  prevButtonStyle: {height: 'calc(calc(20vw + 35vh)/2)'}, 
  prevButtonText: '<',
};

/**
 * Home page view
 */
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.numOfPages = 1;
    this.state = {
      sliderGames: [],
      plataformsGames: []
    }
  }
  
  onCacheLoad() {
    let gamesCount = CacheConfiguration.get(GAMES_COUNT);
    let gamesLimit = CacheConfiguration.get(GAMES_LIMIT_PER_PAGE);
    this.numOfPages = Math.floor(gamesCount / gamesLimit);
    console.log(this.numOfPages);
    this.setState({plataformsGames: []});
    this.sendGamesRequest(this.numOfPages);
  }

  //============================================
  // SLIDER
  //============================================
  updateSliderGames(response) {
    this.setState({sliderGames: response.data});
  }

  sendSliderGamesRequest() {
    let request = new SocketRequest();
    request.setParams({pageNum: 1, discount: true});
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(request, DESTINATION_PLATAFORM_GAMES, this.updateSliderGames.bind(this));
  }

  //============================================
  // PLATAFORMS GAMES
  //============================================
  updatePlataformGames(response) {
    this.setState({plataformsGames: response.data});
  }

  sendGamesRequest(page = 1) {
    let request = new SocketRequest();
    request.setParams({pageNum: page, sort: "price"});
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(request, DESTINATION_PLATAFORM_GAMES, this.updatePlataformGames.bind(this));
  }

  //============================================
  // COMPONENT UTILS
  //============================================
  componentDidMount() {
    EventObserver.subscribe(ON_CACHE_LOAD, "HomePage", this.onCacheLoad.bind(this));
    this.sendGamesRequest();
    this.sendSliderGamesRequest();
    if (SessionManager.checkExpiration()) {
      EventObserver.notify(EVENT_SESSION_CHANGE);
    }
  }

  componentWillUnmount() {
    EventObserver.unsubscribe(ON_CACHE_LOAD, "HomePage");
  }

  render() {
    return (
      <section className='w-100 h-100'>
        <header className='home--header bg-dark' style={{minHeight: '320px', height: 'calc(20vw + 35vh)'}}>
          <Carousel 
            className='w-100' 
            animation='zoom' 
            autoplay={this.state.sliderGames.length > 1} 
            renderBottomCenterControls={false} 
            defaultControlsConfig={CAROUSER_CONTROLS_CONFIG}
            wrapAround={true}>
            {this.getSliderItems()}
          </Carousel>
        </header>
        <article className='d-flex flex-column flex-grow-2 m-4 border-2'>
          <header>
            <h1 className='text-center'>News</h1>
          </header>
          <hr className='my-3'/>
          <div className='d-flex flex-wrap align-content-start justify-content-center'>
            {this.getNewsItems()}
          </div>
        </article>
      </section>
    );
  }

  //============================================
  // SLIDER
  //============================================
  getSliderItems() {
    if (this.state.sliderGames.length > 0) {
      return this.getGameSliderItems();
    }
    return [
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>,
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>,
      <Skeleton key='slider-skeleton-1' width='90%' height='90%' style={{margin: '2% 5%'}}/>
    ];
  }

  getGameSliderItems() {
    let discountedGames = [];
    for (const plataformGame of this.state.sliderGames) {
      discountedGames.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.gamesId + '--slider__items'} className='d-flex justify-content-center w-100 h-100'>
          <GameItemSliderComponent plataformGame={plataformGame} showType='discount'/>
        </div>
      );
    }
    return discountedGames;
  }

  getNewsItems() {
    if (this.state.plataformsGames.length > 0) {
      return this.getGamesItems();
    }
    return [ <Skeleton key='news-skeleton-1' className='p-0' width='90vw' height='30vh'/> ];
  }

  //============================================
  // NEWS
  //============================================
  getGamesItems() {
    let gamesItemsViews = [];
    for (const plataformGame of this.state.plataformsGames) {
      gamesItemsViews.push(
        <div key={plataformGame.plataformsId + '-' + plataformGame.gamesId + '--items'} className='p-2' style={{flex: '1 1 30vh', minHeight: '30vh', maxHeight: '255px'}}>
          <GameItemComponent plataformGame={plataformGame}/>
        </div>
      );
    }
    return gamesItemsViews;
  }
}

export default HomePage;