import React from 'react';
import ReactPlayer from 'react-player'
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Game from '../../domain/models/dtos/Game';
import Media from '../../domain/models/dtos/Media';
import { DESTINATION_COMMENT, DESTINATION_GAMES } from '../../services/socket/SocketDestinations';
import { SessionManager } from '../../domain/SessionManager';
import SocketRequest from '../../services/socket/SocketRequest';
import { SocketController } from '../../services/socket/SocketController';
import Plataform from '../../domain/models/dtos/Plataform';
import { SocketDataFilter } from '../../services/socket/SocketDataFilter';
import Carousel from 'nuka-carousel';
import { Player } from 'video-react';
import Comment from '../../domain/models/dtos/Comment';

//TODO check more button
class GameDetailsComponent extends React.Component {
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

        if (this.state.commentText.length <= 0) {
            this.setState({ commentError: 'The comment field is empty' });
            return;
        }

        let request = new SocketRequest();
        request.setBody(JSON.stringify({id: null, usersId: usersId, gamesId: gamesId, description: description}));
        request.setMethod('POST');
        SocketController.sendCustomWithCallback(request, DESTINATION_COMMENT, this.sendGamesRequest.bind(this));

        this.setState({ commentText: '' });
    }

    sendGamesRequest() {    
        let request = new SocketRequest();
        request.setParams({id: this.gameId});
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
        return (
            <div className='d-md-flex justify-content-center'>
                <article className='m-lg-3' style={{maxWidth: '960px'}}>
                    <header className='w-100'>
                        <h1 className='w-100 col-lg-4'>{this.state.game.name || <Skeleton />}</h1>
                    </header>
                    
                    <section className='details--header row p-0 m-0 m-sm-3'>
                        <div className='details--header__info row col-12 col-lg-4 w-100 p-0 m-0 my-2 my-lg-0'>
                            <div className='details--header__img col-12 col-sm-5 col-lg-12 p-0 d-flex align-items-center justify-content-center overflow-hidden'>
                                {this.getGameImageView() ||  <Skeleton className='mt-2 mt-sm-3 mx-2 mx-sm-0 p-2 p-sm-3 ' />}
                            </div>
                            <div className='col-12 col-sm-7 col-lg-12 py-4 px-2 p-sm-4 p-sm-1 px-sm-4 p-lg-0 d-flex flex-column justify-content-around flex-grow-1'>
                                {this.getBestPlataforms() || <Skeleton count={3} className='m-0 p-2 p-sm-3 ' />}
                            </div>
                        </div>
                        <div className='slider--dynamic col-12 col-lg-8 order-lg-first w-100 p-0 pr-lg-3 overflow-hidden'>
                            {this.getMediaTabView()}
                        </div>
                    </section>

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
                                <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{ width: '50px', height: '50px' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                                </div>
                            </div>
                            <textarea className='no-resize flex-grow-1' rows={5} onChange={this.setCommentText.bind(this)} value={this.state.commentText}/>
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

    getShowMoreView() {
        if (this.state.numOfComments + 1 >= this.state.game.comments.length) {
            return (<></>);
        }
        return (<a className='col-2 btn btn-secondary' onClick={this.showMore.bind(this)}>Show More</a>);
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
            bestPlataformsViews.push(this.preparePlataformView(plataformGame));
        }
        return bestPlataformsViews.slice(0, 3);
    }

    preparePlataformView(plataformGame) {
        let plataform = new Plataform(plataformGame.plataforms);
        let discount = (plataformGame.discount > 0) ? `(-${plataformGame.discount * 100}%)` : '';
        return (
            <div key={`${plataformGame.gamesId}-${plataformGame.plataformsId}__price-tag`}
                className='d-flex border border-black rounded m-0 mt-2 mt-md-0 w-100'>

                <div className='border border-black rounded-left p-0'>
                    <div className='m-2'>
                        {this.getPlataformImageView(plataform)}
                    </div>
                </div>
                <div className='d-flex flex-grow-1'>
                    <div className='w-50 d-flex align-items-center justify-content-center'>
                        {plataform.name}
                    </div>
                    <div className='w-50 d-flex align-items-center justify-content-center bg-quinary border-left border-black rounded-right font-weight-bold text-primary'>
                        <span>{plataformGame.price} {plataformGame.priceUnit} {discount}</span>
                    </div>
                </div>
            </div>
        );
    }

    getComments() {
        let comments = this.state.game.comments;
        let commentsView = new Set();
        for (let i = 0; i < comments.length && i < this.state.numOfComments; i++) {
            let comment = comments[i];
            commentsView.add(this.prepareCommentView(comment));
        }
        return commentsView;
    }

    prepareCommentView(comment) {
        return (
            <div key={`comment-${comment.id}`} className='d-flex mx-3 my-2 m-sm-3'>
                <div className='d-flex align-items-start justify-content-center rounded mr-3 mt-2'>
                    <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{ width: '50px', height: '50px' }}>
                        <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h5>{comment.users.name}</h5>
                    <p className='border border-black rounded p-2 m-0'>{comment.description}</p>
                </div>
            </div>
        );
    }

    getPlataformImageView(plataform) {
        return (<img src={plataform.getLogo()} alt={plataform.name} style={{ width: '25px' }} />);
    }

    getMediaTabView() {
        return (
            <>
                <ul className="nav nav-tabs bg-secondary border-0" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="nav-images-tab"  data-toggle="tab" href="#nav-images" role="tab" aria-controls="nav-images" aria-selected="true">Images</a>
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
        return (<div className='skeleton-image' ><Skeleton/></div>);
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
                    <Player src={videoDto.getUrl()} key='file' width='100%' height='100%'/>
                </div>
            )
        }
        return this.getCarouselWithItems(videosMedias);
    }

    getCarouselWithItems(items) {
        return (<Carousel className='w-100 h-100'>{items}</Carousel>);
    }
}

export default GameDetailsComponent;
