import React from 'react';
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { SessionManager } from '../domain/SessionManager';
import SocketRequest from '../services/socket/SocketRequest';
import { SocketController } from '../services/socket/SocketController';
import { DESTINATION_COMMENT, DESTINATION_GAMES } from '../services/socket/SocketDestinations';
import Game from '../domain/models/dtos/Game';
import CommentComponent from '../components/models/CommentComponent';
import DetailsHeaderComponent from '../components/utils/DetailsHeaderComponent';

class GameDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    if (props.params === undefined) {
      props.navigate('/home', { replace: true });
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
  
  //============================================
  // COMMENTS
  //============================================
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

  //============================================
  // COMPONENT UTILS
  //============================================
  componentDidMount() {
    this.sendGamesRequest();
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
  
  //============================================
  // VIEW
  //============================================
  render() {
    console.log(this.state.game);
    return (
      <div className='d-md-flex justify-content-center'>
        <article className='game__details m-lg-3 w-100'>
          <header className='w-100'>
            <h1 className='w-100 pl-2 pl-lg-0'>{this.state.game.name || <Skeleton />}</h1>
          </header>
          <DetailsHeaderComponent game={this.state.game} />
          <hr />
          <section className='p-3 p-lg-0 my-3'>
            <h3 className='mb-3 capitalize'>Descripci&oacute;n</h3>
            {this.state.game.descripcion || <Skeleton count={10} />}
          </section>
          <section className='p-3 p-lg-0'>
            <header className='d-flex align-items-center'>
              <h4 className='capitalize'>Comentarios</h4>
              <span className='text-error ml-3'>{this.state.commentError}</span>
            </header>
            <div className='d-flex m-3'>
              <div className='d-flex align-items-start justify-content-center rounded mr-3'>
                <div className='game-comment-icon bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center'>
                  <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                </div>
              </div>
              <div className='flex-grow-1'>
                <textarea className='w-100 p-2 no-resize' rows={5} onChange={this.setCommentText.bind(this)} value={this.state.commentText} />
              </div>
            </div>
            <div className='d-flex flex-column justify-content-center'>
              <div className='row m-3'>
                <div className='col-8 col-sm-9 col-md-10 d-none d-sm-block m-auto'><hr /></div>
                <a className='col-12 col-sm-3 col-md-2 btn btn-quaternary align-self-baseline capitalize' onClick={this.sendCommentRequest.bind(this)}>Comentar</a>
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

  //============================================
  // COMMENTS
  //============================================
  getComments() {
    let comments = this.state.game.comments;
    let commentsView = new Set();
    for (let i = 0; i < comments.length && i < this.state.numOfComments; i++) {
      let comment = comments[i];
      commentsView.add(<CommentComponent key={`comment-${comment.id}`} comment={comment} />);
    }
    return commentsView;
  }

  getShowMoreView() {
    if (this.state.numOfComments + 1 >= this.state.game.comments.length) {
      return (<></>);
    }
    return (<a className='col-12 col-lg-6 mx-auto mt-3 py-2 btn btn-secondary' onClick={this.showMore.bind(this)}>Show More</a>);
  }
}

export default GameDetailsPage;
