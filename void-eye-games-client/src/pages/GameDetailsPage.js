import React from 'react';
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'nuka-carousel';
import { Player } from 'video-react';
import { SessionManager } from '../domain/SessionManager';
import SocketRequest from '../services/socket/SocketRequest';
import { SocketController } from '../services/socket/SocketController';
import { DESTINATION_COMMENT, DESTINATION_GAMES } from '../services/socket/SocketDestinations';
import { SocketDataFilter } from '../services/socket/SocketDataFilter';
import Media from '../domain/models/dtos/Media';
import Game from '../domain/models/dtos/Game';
import Plataform from '../domain/models/dtos/Plataform';
import PlataformComponent from '../components/models/PlataformComponent';
import CommentComponent from '../components/models/CommentComponent';
import DetailsHeaderComponent from '../components/utils/DetailsHeaderComponent';

const CAROUSER_CONTROLS_CONFIG = {
  containerClassName: '',
  nextButtonClassName: 'slider--control',
  nextButtonStyle: { height: 'calc(calc(20vw + 35vh)/2)' },
  nextButtonText: '>',
  pagingDotsClassName: '',
  pagingDotsContainerClassName: '',
  pagingDotsStyle: {},
  prevButtonClassName: 'slider--control',
  prevButtonStyle: { height: 'calc(calc(20vw + 35vh)/2)' },
  prevButtonText: '<',
};

class GameDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    if (props.params === undefined) {
      props.navigate('/home', {replace: true});
    }
    this.gameId = props.params.id;
    let defaultGame = new Game();
    defaultGame.id = this.gameId;

    window.scrollTo(0, 0);

    this.state = {
      game: defaultGame,
      commentText: '',
      commentError: '',
      numOfComments: 3
    };
  }

  setCommentText(event) {
    this.setState({ commentText: event.target.value });
  }

  showMore() {
    let num = this.state.numOfComments;
    this.setState({ numOfComments: num + 3 });
  }

  sendCommentRequest() {
    if (!SessionManager.has()) {
      this.setState({ commentError: 'You have to log in to be able to comment.' });
      return;
    }

    let usersId = SessionManager.getSession().user
    let description = this.state.commentText;
    if (description.length <= 0) {
      this.setState({ commentError: 'The comment field is empty' });
      return;
    }

    let request = new SocketRequest();
    request.setBody(JSON.stringify({ id: null, usersId: usersId, gamesId: this.gameId, description: description }));
    request.setMethod('POST');
    SocketController.sendCustomWithCallback(request, DESTINATION_COMMENT, this.sendGamesRequest.bind(this));

    this.setState({ commentText: '' });
  }

  sendGamesRequest() {
    let request = new SocketRequest();
    request.setParams({ id: this.gameId });
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(request, DESTINATION_GAMES, this.onGamesSuccess.bind(this));
  }

  onGamesSuccess(response) {
    this.setState({ game: response.data });
  }

  componentDidMount() {
    this.sendGamesRequest();
  }

  render() {
    console.log(this.state.game);
    return (
      <div className='d-md-flex justify-content-center'>
        <article className='game-details m-lg-3 w-100'>
          <header className='w-100'>
            <h1 className='w-100 pl-2 pl-lg-0'>{this.state.game.name || <Skeleton />}</h1>
          </header>

          {this.getHeaderComponent()}

          <hr />
          <section className='p-3 p-lg-0 my-3'>
            <h3 className='mb-3'>Description</h3>
            {this.state.game.descripcion || <Skeleton count={10} />}
          </section>
          <section className='p-3 p-lg-0'>
            <header className='d-flex align-items-center'>
              <h4>Comments</h4>
              <span className='text-error ml-3'>{this.state.commentError}</span>
            </header>
            <div className='d-flex m-3'>
              <div className='d-flex align-items-start justify-content-center rounded mr-3'>
                <div className='game-comment-icon bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center'>
                  <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                </div>
              </div>
              <div className='flex-grow-1'>
                <textarea className='w-100 no-resize' rows={5} onChange={this.setCommentText.bind(this)} value={this.state.commentText} />
              </div>
            </div>
            <div className='d-flex flex-column justify-content-center'>
              <div className='row m-3'>
                <div className='col-8 col-sm-9 col-md-10 d-none d-sm-block m-auto'><hr /></div>
                <a className='col-12 col-sm-3 col-md-2 btn btn-quaternary align-self-baseline' onClick={this.sendCommentRequest.bind(this)}>Comment</a>
              </div>
              <div>
                <div className='d-flex flex-column'>
                  {this.getComments()}
                </div>
              </div>
              {this.getShowMoreView()}
            </div>
          </section>
        </article>
      </div>
    );
  }

  getHeaderComponent() {
    return <DetailsHeaderComponent game={this.state.game}/>
  }

  getShowMoreView() {
    if (this.state.numOfComments + 1 >= this.state.game.comments.length) {
      return (<></>);
    }
    return (<a className='col-12 col-lg-6 mx-auto mt-3 py-2 btn btn-secondary' onClick={this.showMore.bind(this)}>Show More</a>);
  }

  getComments() {
    let comments = this.state.game.comments;
    let commentsView = new Set();
    for (let i = 0; i < comments.length && i < this.state.numOfComments; i++) {
      let comment = comments[i];
      commentsView.add(<CommentComponent key={`comment-${comment.id}`} comment={comment}/>);
    }
    return commentsView;
  }

  getGameImageView() {
    let game = new Game(this.state.game);
    if (game.name === null) return null;
    return (<img src={game.getImageUrl()} alt={game.name} style={{ maxHeight: '100%', minHeight: '100%' }} />);
  }

  getBestPlataforms() {
    if (this.state.game.name === null) return null;
    var bestPlataformsViews = [];
    for (const plataformGame of this.state.game.plataforms_games) {
      let key = `${plataformGame.gamesId}-${plataformGame.plataformsId}__price-tag`;
      bestPlataformsViews.push(<PlataformComponent key={key} plataformGame={plataformGame}/>);
    }
    return bestPlataformsViews.slice(0, 3);
  }

  getMediaTabView() {
    return (
      <>
        <ul className="nav nav-tabs bg-secondary border-0" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="nav-images-tab" data-toggle="tab" href="#nav-images" role="tab" aria-controls="nav-images" aria-selected="true">Images</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" id="nav-videos-tab" data-toggle="tab" href="#nav-videos" role="tab" aria-controls="nav-videos" aria-selected="false">Videos</a>
          </li>
        </ul>
        <div className="tab-content border border-dark" id="myTabContent">
          <div className="tab-pane fade show active tab-content--images" id="nav-images" role="tabpanel" aria-labelledby="nav-images-tab">
            {this.getImagesTabView()}
          </div>
          <div className="tab-pane fade tab-content--videos" id="nav-videos" role="tabpanel" aria-labelledby="nav-videos-tab">
            {this.getVideosTabView()}
          </div>
        </div>
      </>
    );
  }

  getImagesTabView() {
    if (Array.from(this.state.game.medias).length > 0) {
      return this.getImagesMedias();
    }
    return this.getSkeleton();
  }

  getVideosTabView() {
    if (Array.from(this.state.game.medias).length > 0) {
      return this.getVideoMedias();
    }
    return this.getSkeleton();
  }

  /** SKELETON **/
  getSkeleton() {
    return (<div className='skeleton-image' ><Skeleton /></div>);
  }

  /** NORMAL **/
  getImagesMedias() {
    var imageMedias = [];
    let images = SocketDataFilter.getImageMediasFrom(this.state.game.medias);
    for (const imageObject of images) {
      let imageDto = new Media(imageObject);
      let key = `${imageDto.gamesId}-${imageDto.gamesId}-image`;
      imageMedias.push(<div key={key} className='w-100 h-100 d-flex justify-content-center'><img className='w-100' src={imageDto.getUrl()} alt={key} /></div>)
    }
    return this.getCarouselWithItems(imageMedias);
  }

  getVideoMedias() {
    var videosMedias = [];
    let videos = SocketDataFilter.getVideoMediasFrom(this.state.game.medias);
    for (const videoObject of videos) {
      let videoDto = new Media(videoObject);
      let key = `${videoDto.gamesId}-${videoDto.gamesId}-video`;
      videosMedias.push(
        <div key={key} className='w-100 d-flex justify-content-center video'>
          <Player src={videoDto.getUrl()} key='file' width='100%' height='100%' />
        </div>
      )
    }
    return this.getCarouselWithItems(videosMedias);
  }

  getCarouselWithItems(items) {
    return (
      <Carousel
        animation='zoom'
        autoplay={items.length > 1}
        renderBottomCenterControls={false}
        defaultControlsConfig={CAROUSER_CONTROLS_CONFIG}
        wrapAround={false} className='w-100 h-100'>
        {items}
      </Carousel>
    );
  }
}

export default GameDetailsPage;
