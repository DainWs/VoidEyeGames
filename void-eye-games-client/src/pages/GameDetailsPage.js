import React from 'react';
import Skeleton from 'react-loading-skeleton'
import { SocketController } from '../services/socket/SocketController';
import { DESTINATION_COMMENT, DESTINATION_GAMES } from '../services/socket/SocketDestinations';
import { SocketObserver } from '../services/socket/SocketObserver';
import Game from '../domain/models/dtos/Game';
import { ResourceManger } from '../domain/ResourceManager';
import MediaTab from '../components/utils/MediaTab';
import { FilterUtils } from '../utils/FilterUtils';
import { SocketDataQuery } from '../services/socket/SocketDataQuery';
import Plataform from '../domain/models/dtos/Plataform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { SessionManager } from '../domain/SessionManager';
import Comment from '../domain/models/dtos/Comment';
import SocketRequest from '../services/socket/SocketRequest';

class GameDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.gameId = props.id;

    let defaultGame = new Game();
    defaultGame.id = this.gameId;

    this.state = {
      game: defaultGame,
      commentText: '',
      commentError: '',
      numOfComments: 3
    };
  }
  
  updateGame() {
    let newGame = SocketDataQuery.getGameWithId(this.gameId);
    //this.setState({game: newGame});
  }

  setCommentText(event) {
    this.setState({commentText: event.target.value});
  }

  doComment() {
    if(!SessionManager.has()) {
      this.setState({commentError: 'You have to log in to be able to comment.'}); 
      return;
    }

    if (this.state.commentText.length <= 0) {
      this.setState({commentError: 'The comment field is empty'}); 
      return;
    }

    let comment = new Comment();
    comment.usersId = SessionManager.getSession().user.id;
    comment.gamesId = this.gameId;
    comment.description = this.state.commentText;

    let request = new SocketRequest();
    request.body = JSON.stringify(comment);
    request.method = 'POST';
    SocketController.sendCustom(request, DESTINATION_COMMENT);

    this.setState({commentText: ''});
  }

  updateComment() {
    SocketController.send(DESTINATION_GAMES);
  }

  showMore() {
    let num = this.state.numOfComments;
    this.setState({numOfComments: num + 3});
  }

  componentDidMount() {
    SocketObserver.subscribe(DESTINATION_GAMES, 'GameDetailsPage', this.updateGame.bind(this));
    SocketObserver.subscribe(DESTINATION_COMMENT, 'GameDetailsPage', this.updateComment.bind(this));
    SocketController.send(DESTINATION_GAMES);
  }

  componentWillUnmount() {
    SocketObserver.unsubscribe(DESTINATION_GAMES, 'GameDetailsPage');
    SocketObserver.unsubscribe(DESTINATION_COMMENT, 'GameDetailsPage');
  }

  render() {
    return (
      <article className='m-lg-3'>
        <header className='row'>
          <h1 className='col-lg-4'>{this.state.game.name || <Skeleton />}</h1>
        </header>
        <section className='row' style={{height: '50vh'}}>
          <div className='col-8 w-100 h-100 overflow-hidden'>
            <MediaTab medias={this.state.game.medias}/>
          </div>
          <div className='col-4 w-100 h-100 overflow-hidden'>
            <div className='h-50 overflow-hidden'>
              {this.getGameImageView() || <Skeleton style={{height: '50vh'}}/>}
            </div>
            <div className='h-50 d-flex flex-column justify-content-center'>
                {this.getBestPlataforms() || <Skeleton count={3} height='2.5rem' style={{marginTop: '1rem'}}/>}
            </div>
          </div>
        </section>
        <hr/>
        <section>
          {this.state.game.description || <Skeleton count={10}/>}
        </section>
        <section>
          <header className='d-flex align-items-center'>
            <h4>Comments</h4>
            <span className='text-error ml-3'>{this.state.commentError}</span>
          </header>
          <div className='d-flex m-3'>
            <div className='d-flex align-items-start justify-content-center rounded mr-3'>
              <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{width: '50px', height: '50px'}}>
                <FontAwesomeIcon icon={faUser} style={{width: '50%', height: '50%'}}/>
              </div>
            </div>
            <textarea style={{flexGrow: 1, resize: 'none'}} rows={5} onChange={this.setCommentText.bind(this)}></textarea>
          </div>
          <div className='d-flex flex-column justify-content-center'>
            <div className='row m-3'>
              <div className='col-10'>
                <hr/>
                <div className='d-flex flex-column'>
                  {this.getComments() || this.prepareCommentView({id: 1})}
                </div>
              </div>
              <a className='col-2 btn btn-quaternary align-self-baseline' onClick={this.doComment.bind(this)}>Comment</a>
            </div>
            {this.getShowMoreView()}
          </div>
        </section>
      </article>
    );
  }

  getShowMoreView() {
    if (this.state.numOfComments + 1 >= this.state.game.comments.length) {
      return (<></>);
    }
    return (<a className='col-2 btn btn-secondary' onClick={this.showMore.bind(this)}>Show More</a>);
  }

  getGameImageView() {
    if (this.state.game.name === null) return null;
    let relativeImageUrl = this.state.game.getMainImage();
    let completeImageUrl = ResourceManger.getImageUrl(relativeImageUrl);
    return (<img src={completeImageUrl} alt={this.state.game.name} style={{maxHeight: '100%', maxWidth: '100%'}}/>);
  }

  getBestPlataforms() {
    if (this.state.game.name === null) return null

    var bestPlataformsViews = new Set();
    let bestPlataforms = FilterUtils.getBestPlataforms(this.state.game.plataformGames);
    for (const plataformGame of bestPlataforms) {
      bestPlataformsViews.add(this.preparePlataformView(plataformGame));
    }
    return bestPlataformsViews;
  }

  preparePlataformView(plataformGame) {
    let plataform = new Plataform(this.state.game.getPlataform(plataformGame.plataformId));
    let discount = (plataformGame.discount > 0) ? `(${plataformGame.discount})` : '';
    return (
      <div key={`${plataformGame.gameId}-${plataformGame.plataformId}__price-tag`} 
        className='row border border-black'
        height='2.5rem' 
        style={{marginTop: '1rem'}}>
        
        <div className='col-2 border border-black'>
          {plataform.getLogo()}
        </div>
        <div className='col-4'>
          {plataform.name}
        </div>
        <div className='col-6 bg-quinary border-left border-black'>
          <span>{plataformGame.price} {plataformGame.priceUnit} {discount}</span>
        </div>
      </div>
    );
  }

  getComments() {
    let comments = this.state.game.comments;
    if (comments.length <= 0) return null;
    let commentsView = new Set();
    for (let i = 0; i < comments.length && i < this.state.numOfComments; i++) {
      let comment = comments[i];
      commentsView.add(this.prepareCommentView(comment));
    }
    return commentsView;
  }

  prepareCommentView(comment) {
    if (comment.user == undefined) comment.user = {name: null};
    return (
      <div key={`comment-${comment.id}`} className='d-flex m-3'>
        <div className='d-flex align-items-start justify-content-center rounded mr-3 mt-2'>
           <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{width: '50px', height: '50px'}}>
            <FontAwesomeIcon icon={faUser} style={{width: '50%', height: '50%'}}/>
          </div>
        </div>
        <div style={{flexGrow: 1}}>
          <h5>{comment.user.name || <Skeleton width='30%'/>}</h5>
          <p className='border border-black rounded p-2'>{comment.description || <Skeleton count={5}/>}</p>
        </div>
      </div>
    );
  }
}

export default GameDetailsPage;
