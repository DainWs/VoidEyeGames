/**
 * File: MediasComponent.js
 * Purpose: This component view creates the Medias Tabber view used in GameDetails.
 * DB Access: No
 * Used from:
 *  - GameDetailsPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import Carousel from 'nuka-carousel';
import { SocketDataFilter } from '../../services/socket/SocketDataFilter';
import Media from '../../domain/models/dtos/Media';
import { Player } from 'video-react';
import Skeleton from 'react-loading-skeleton';

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

class MediasComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {medias: []};
    }

    static getDerivedStateFromProps(props, state) {
        if (props.medias !== state.medias) {
            console.log(props.medias);
            return { medias: props.medias };
        }
        return null;
    }

    render() {
        return (
            <>
                <ul className="nav nav-tabs bg-secondary border-0" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active capitalize" id="nav-images-tab" data-toggle="tab" href="#nav-images" role="tab" aria-controls="nav-images" aria-selected="true">Imagenes</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link capitalize" id="nav-videos-tab" data-toggle="tab" href="#nav-videos" role="tab" aria-controls="nav-videos" aria-selected="false">Videos</a>
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
        if (Array.from(this.state.medias).length > 0) {
            return this.getImagesMedias();
        }
        return this.getSkeleton();
    }

    getVideosTabView() {
        if (Array.from(this.state.medias).length > 0) {
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
        let images = SocketDataFilter.getImageMediasFrom(this.state.medias);
        for (const imageObject of images) {
            let imageDto = new Media(imageObject);
            let key = `${imageDto.gamesId}-${imageDto.gamesId}-image`;
            imageMedias.push(<div key={key} className='w-100 h-100 d-flex justify-content-center'><img className='w-100' src={imageDto.getUrl()} alt={key} /></div>)
        }
        return this.getCarouselWithItems(imageMedias);
    }

    getVideoMedias() {
        var videosMedias = [];
        let videos = SocketDataFilter.getVideoMediasFrom(this.state.medias);
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

export default MediasComponent;
