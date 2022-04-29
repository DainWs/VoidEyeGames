import React from 'react';
import Skeleton from 'react-loading-skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Game from '../../domain/models/dtos/Game';
import Media from '../../domain/models/dtos/Media';
import { DESTINATION_COMMENT, DESTINATION_GAMES, DESTINATION_PLATAFORM_GAMES } from '../../services/socket/SocketDestinations';
import { SocketDataQuery } from '../../services/socket/SocketDataQuery';
import { SessionManager } from '../../domain/SessionManager';
import SocketRequest from '../../services/socket/SocketRequest';
import { SocketController } from '../../services/socket/SocketController';
import { SocketObserver } from '../../services/socket/SocketObserver';
import { ResourceManger } from '../../domain/ResourceManager';
import Plataform from '../../domain/models/dtos/Plataform';
import { FilterUtils } from '../../utils/FilterUtils';
import Carousel from 'nuka-carousel';
import { Player } from 'video-react';

//TODO check more button
class GameDetailsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.gameId = props.id;
        let defaultGame = new Game();
        defaultGame.id = this.gameId;

        this.state = {
            game: defaultGame,
            plataformsGames: [],
            commentText: '',
            commentError: '',
            numOfComments: 3
        };
    }

    updatePlataformsGames() {
        let newPlataformsGames = SocketDataQuery.getPlataformsGamesWithGameId(this.gameId);
        this.setState({ plataformsGames: newPlataformsGames });
    }

    updateGame() {
        let newGame = SocketDataQuery.getGameWithId(this.gameId);
        if (newGame == null) {
            return;
        }
        this.setState({ game: newGame });
    }

    setCommentText(event) {
        this.setState({ commentText: event.target.value });
    }

    doComment() {
        if (!SessionManager.has()) {
            this.setState({ commentError: 'You have to log in to be able to comment.' });
            return;
        }

        if (this.state.commentText.length <= 0) {
            this.setState({ commentError: 'The comment field is empty' });
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

        this.setState({ commentText: '' });
    }

    updateComment() {
        SocketController.send(DESTINATION_GAMES);
    }

    showMore() {
        let num = this.state.numOfComments;
        this.setState({ numOfComments: num + 3 });
    }

    componentDidMount() {
        SocketObserver.subscribe(DESTINATION_GAMES, 'GameDetailsPage', this.updateGame.bind(this));
        SocketObserver.subscribe(DESTINATION_COMMENT, 'GameDetailsPage', this.updateComment.bind(this));
        SocketObserver.subscribe(DESTINATION_PLATAFORM_GAMES, 'GameDetailsPage', this.updatePlataformsGames.bind(this));
        SocketController.send(DESTINATION_GAMES);
        SocketController.send(DESTINATION_PLATAFORM_GAMES);
    }

    componentWillUnmount() {
        SocketObserver.unsubscribe(DESTINATION_GAMES, 'GameDetailsPage');
        SocketObserver.unsubscribe(DESTINATION_COMMENT, 'GameDetailsPage');
    }

    render() {
        console.log(this.state.game);
        return (
            <article className='m-lg-3'>
                <header className='row'>
                    <h1 className='col-lg-4 ml-2 ml-sm-0'>{this.state.game.name || <Skeleton />}</h1>
                </header>
                <section className='row p-0 m-0 m-sm-1'>
                    <div className='row col-12 col-lg-4 w-100 h-50 h-lg-100 overflow-hidden p-0 m-0 my-2 my-lg-0'>
                        <div className='col-12 col-sm-5 col-lg-12 h-100 h-lg-50 p-0 overflow-hidden'>
                            {this.getGameImageView() ||  <Skeleton className='mt-2 mt-sm-3 mx-2 mx-sm-0 p-2 p-sm-3 ' />}
                        </div>
                        <div className='col-12 col-sm-7 col-lg-12 h-100 h-lg-50 p-4 p-sm-1 px-sm-4 p-lg-0 d-flex flex-column justify-content-center'>
                            {this.getBestPlataforms() || <Skeleton count={3} className='mt-2 mt-sm-3 mx-2 mx-sm-0 p-2 p-sm-3 ' />}
                        </div>
                    </div>
                    <div className='col-12 col-lg-8 order-lg-first w-100 h-100 p-0 pr-lg-3 overflow-hidden'>
                        {this.getMediaTabView()}
                    </div>
                </section>
                <hr />
                <section className='p-3 p-lg-0'>
                    <h3>Description</h3>
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
                        <textarea className='no-resize flex-grow-1' rows={5} onChange={this.setCommentText.bind(this)}></textarea>
                    </div>
                    <div className='d-flex flex-column justify-content-center'>
                        <div className='row m-3'>
                            <div className='col-8 col-sm-9 col-md-10 d-none d-sm-block'><hr /></div>
                            <a className='col-12 col-sm-3 col-md-2 btn btn-quaternary align-self-baseline' onClick={this.doComment.bind(this)}>Comment</a>
                        </div>
                        <div>
                            <div className='d-flex flex-column'>
                                {this.getComments() || this.prepareCommentView({ id: 1 })}
                            </div>
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
        let game = new Game(this.state.game);
        if (game.name === null) return null;
        let relativeImageUrl = game.getMainImage();
        let completeImageUrl = ResourceManger.getImageUrl(relativeImageUrl);
        return (<img src={completeImageUrl} alt={game.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />);
    }

    getBestPlataforms() {
        if (this.state.game.name === null) return null;
        var bestPlataformsViews = new Set();
        for (const plataformGame of this.state.plataformsGames) {
            bestPlataformsViews.add(this.preparePlataformView(plataformGame));
        }
        return bestPlataformsViews;
    }

    preparePlataformView(plataformGame) {
        console.log(plataformGame);
        let plataform = new Plataform(plataformGame.plataforms);
        let discount = (plataformGame.discount > 0) ? `(${plataformGame.discount})` : '';
        return (
            <div key={`${plataformGame.gamesId}-${plataformGame.plataformsId}__price-tag`}
                className='d-flex border border-black rounded m-0 mt-2 w-100'>

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
        if (comments.length <= 0) return null;
        let commentsView = new Set();
        for (let i = 0; i < comments.length && i < this.state.numOfComments; i++) {
            let comment = comments[i];
            commentsView.add(this.prepareCommentView(comment));
        }
        return commentsView;
    }

    prepareCommentView(comment) {
        if (comment.users == undefined) comment.users = { name: null };
        console.log(comment);
        return (
            <div key={`comment-${comment.id}`} className='d-flex m-3'>
                <div className='d-flex align-items-start justify-content-center rounded mr-3 mt-2'>
                    <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{ width: '50px', height: '50px' }}>
                        <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h5>{comment.users.name || <Skeleton width='30%' />}</h5>
                    <p className='border border-black rounded p-2'>{comment.description || <Skeleton count={5} />}</p>
                </div>
            </div>
        );
    }

    getPlataformImageView(plataform) {
        return (<img src={ResourceManger.getImageUrl(plataform.getLogo())} alt={plataform.name} style={{ width: '25px' }} />);
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
                <div className="tab-content bg-tertiary border border-dark" id="myTabContent">
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
        let images = FilterUtils.getImageMediasFrom(this.state.game.medias);
        for (const imageObject of images) {
            let imageDto = new Media(imageObject);
            let imageUrl = ResourceManger.getImageUrl(imageDto.getMediaSource());
            let key = `${imageDto.gamesId}-${imageDto.gamesId}`;
            imageMedias.push(<div key={key} className='w-100 h-100 d-flex justify-content-center'><img className='w-100' src={imageUrl} alt={key} /></div>)
        }
        return this.getCarouselWithItems(imageMedias);
    }

    getVideoMedias() {
        var videosMedias = [];
        let videos = FilterUtils.getVideoMediasFrom(this.state.game.medias);
        for (const videoObject of videos) {
            let videoDto = new Media(videoObject);
            let videoUrl = ResourceManger.getImageUrl(videoDto.getMediaSource());
            let key = `${videoDto.gamesId}-${videoDto.gamesId}`;
            videosMedias.push(<div key={key} className='w-100 d-flex justify-content-center video'><Player src={videoUrl}   playsInline /></div>)
        }
        return this.getCarouselWithItems(videosMedias);
    }

    getCarouselWithItems(items) {
        return (<Carousel className='w-100 h-100'>{items}</Carousel>);
    }
}

export default GameDetailsComponent;
