import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Game from '../../domain/models/dtos/Game';
import MediasComponent from '../models/MediasComponent';
import PlataformComponent from '../models/PlataformComponent';

class DetailsHeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: new Game()
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.game !== state.game) {
            console.log(props.game);
            return { game: props.game };
        }
        return null;
    }

    render() {
        return (
            <section className='game__details--header row p-0 m-0 my-sm-3'>
                <div className='game__details--header__info row col-12 col-lg-4 w-100 p-0 pl-lg-3 m-0 my-2 my-lg-0'>
                    <div className='game__details--header__img col-12 col-sm-5 col-lg-12 p-0 d-flex align-items-center justify-content-center overflow-hidden'>
                        {this.getGameImageView() || <Skeleton className='mt-2 mt-sm-3 mx-2 mx-sm-0 p-2 p-sm-3 ' />}
                    </div>
                    <div className='game__details--header__plataforms col-12 col-sm-7 col-lg-12 py-4 px-2 p-sm-4 p-sm-1 px-sm-4 p-lg-0 d-flex flex-column justify-content-around flex-grow-1'>
                        {this.getBestPlataforms() || <Skeleton count={3} className='m-0 p-2 p-sm-3 ' />}
                    </div>
                </div>
                <div className='col-12 col-lg-8 order-lg-first p-0 flex-grow-1'>
                    <div className='slider--dynamic w-100 h-100 p-0 overflow-hidden'>
                        <MediasComponent medias={this.state.game.medias}/>
                    </div>
                </div>
                
            </section>
        );
    }

    getGameImageView() {
        let game = new Game(this.state.game);
        if (game.name === null) return null;
        return (<img src={game.getImageUrl()} alt={game.name} style={{ maxHeight: 'calc(80% + 1vw)' }} />);
    }

    getBestPlataforms() {
        if (this.state.game.name === null) return null;
        var bestPlataformsViews = [];
        for (const plataformGame of this.state.game.plataforms_games) {
            let key = `${plataformGame.gamesId}-${plataformGame.plataformsId}__price-tag`;
            bestPlataformsViews.push(<PlataformComponent key={key} plataformGame={plataformGame} />);
        }
        return bestPlataformsViews.slice(0, 3);
    }

    
}

export default DetailsHeaderComponent;
