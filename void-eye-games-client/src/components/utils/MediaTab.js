import React from "react";
import Skeleton from "react-loading-skeleton";
import { Player } from 'video-react';
import { ResourceManger } from "../../domain/ResourceManager";
import { FilterUtils } from "../../utils/FilterUtils";
import Carousel from "nuka-carousel";

class MediaTab extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.medias);
        this.state = {
            medias: props.medias
        }
    }
    
    render() {
        return (
            <>
                <ul className="nav nav-tabs bg-secondary" id="media-tab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="images-tab" data-toggle="tab" href="#images" role="tab" aria-controls="nav-images" aria-selected="true">Images</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="videos-tab" data-toggle="tab" href="#videos" role="tab" aria-controls="nav-videos" aria-selected="false">Videos</a>
                    </li>
                </ul>
                <div className="tab-content" id="media-tabContent">
                    <div className="tab-pane fade show active" id="nav-images" role="tabpanel" aria-labelledby="nav-images-tab">
                        {this.getImagesTabView()}
                    </div>
                    <div className="tab-pane fade" id="nav-videos" role="tabpanel" aria-labelledby="nav-videos-tab">
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
        return (<Skeleton height='50vh'/>);
    }

    /** NORMAL **/
    getImagesMedias() {
        var imageMedias = new Set();
        let images = FilterUtils.getImageMediasFrom(this.state.medias);
        for (const imageObject of images) {
            let imageDto = new Media(imageObject);
            let imageUrl = ResourceManger.getImageUrl(imageDto.getMediaSource());
            let key = `${imageDto.gamesId}-${imageDto.gamesId}`;
            imageMedias.add(<img key={key} src={imageUrl} alt={key}/>)
        }
        return this.getCarouselWithItems(imageMedias);
    }

    getVideoMedias() {
        var videosMedias = new Set();
        let videos = FilterUtils.getVideoMediasFrom(this.state.medias);
        for (const videoObject of videos) {
            let videoDto = new Media(videoObject);
            let videoUrl = ResourceManger.getImageUrl(videoDto.getMediaSource());
            let key = `${videoDto.gamesId}-${videoDto.gamesId}`;
            videosMedias.add(<Player key={key} src={videoUrl} playsInline/>)
        }
        return this.getCarouselWithItems(videosMedias);
    }

    getCarouselWithItems(items) {
        return (<Carousel className='w-100' >{items}</Carousel>);
    }
}

export default MediaTab;