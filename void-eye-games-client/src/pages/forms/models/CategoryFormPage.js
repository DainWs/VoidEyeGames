import React from 'react';
import Select from 'react-select'
import GameListItemComponent from '../../../components/models/lists/GameListItemComponent';
import Category from '../../../domain/models/dtos/Category';
import { withRouter } from '../../../Main';
import { SocketController } from '../../../services/socket/SocketController';
import { SocketDataQuery } from '../../../services/socket/SocketDataQuery';
import { DESTINATION_CATEGORIES, DESTINATION_GAMES } from '../../../services/socket/SocketDestinations';
import { SocketObserver } from '../../../services/socket/SocketObserver';
import SocketRequest from '../../../services/socket/SocketRequest';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

// TODO check multi games context menu
class CategoryFormPage extends ModelFormPage {

    createState(props) {
        let category = new Category();
        let parentState = super.createState(props);
        if (parentState.mode === MODEL_FORM_MODE_EDIT) {
            category = SocketDataQuery.getCategoryWithId(props.id);
        }
        parentState.category = category;
        parentState.selectedGame = null;
        return parentState;
    }

    onChangeName(event) {
        let category = this.state.category;
        category.name = event.target.value;
        this.setState({category:category});
    }

    onChangeSelectedGame(event) {
        console.log(event);
        this.setState({selectedGame: event.value});
    }

    addSelectedGame() {
        let selectedGameId = this.state.selectedGame;
        if (!selectedGameId || selectedGameId <= 0) return;
        let category = this.state.category;
        category.addGame(SocketDataQuery.getGameWithId(selectedGameId));
        this.setState({category: category});
    }

    onRemoveGameItemClick(id) {
        let category = new Category(this.state.category);
        category.removeGame(id);
        this.setState({category: category});
    }

    submit() {
        let category = this.state.category;
        category.games = [];
        console.log(JSON.stringify(category));
        let request = new SocketRequest();
        request.setBody(JSON.stringify(category));
        request.setMethod('POST');
        SocketController.sendCustomWithCallback(
            request,
            DESTINATION_CATEGORIES,
            this.onSuccess.bind(this),
            this.onFailed.bind(this)
        );
    }

    onSuccess(response) {
        document.getElementById('navigate-home').click();
    }

    onFailed(response) {
        this.setState({errors: response.data});
    }

    componentDidMount() {
        SocketObserver.subscribe(DESTINATION_GAMES, 'CategoryFormPage', this.forceUpdate.bind(this));
        SocketController.send(DESTINATION_GAMES);
    }

    componentWillUnmount() {
        SocketObserver.unsubscribe(DESTINATION_GAMES);
    }

    render() {
        return (
            <section className='row h-100'>
                <article className='d-flex flex-column mx-auto p-2 p-sm-0 col-12 col-sm-10'>
                    <header>
                        <h1 className='text-center'>Categories Form</h1>
                    </header>
                    <form className='d-flex flex-column flex-grow-1'>
                        <section className='mb-3'>
                            <label htmlFor='category-form--name'>Name:</label>
                            <input id='category-form--name' className='w-100' type='text' value={this.state.category.name} onChange={this.onChangeName.bind(this)} autoComplete='false'/>
                        </section>
                        <section className='d-flex w-100 m-0'>
                            <Select className='flex-grow-1 p-0' options={this.getGamesOptions()} onChange={this.onChangeSelectedGame.bind(this)}/>
                            <a className='btn btn-form text-dark col-2 ml-2' onClick={this.addSelectedGame.bind(this)}>Add game</a>
                        </section>
                        <hr className='w-100'/>
                        <fieldset title='Games in category' className='d-flex flex-column flex-grow-1 w-100 border border-dark rounded' style={{overflowY: 'scroll'}}>
                            {this.getGamesList()}
                        </fieldset>
                        <section className='my-3'>
                            <a className='btn btn-form w-100 text-dark' onClick={this.submit.bind(this)}>Save all</a>
                        </section>
                    </form>
                </article>
            </section>
        );
    }

    getGamesOptions() {
        let gamesOptions = [];
        let leakedGames = SocketDataQuery.getGamesNotIn(this.state.category.games);
        for (const leakedGame of leakedGames) {
            gamesOptions.push({ value: leakedGame.id, label: leakedGame.name });
        }
        return gamesOptions;
    }

    getGamesList() {
        let gamesList = [];
        for (const game of this.state.category.games) {
            let GameItem = withRouter(GameListItemComponent);
            gamesList.push(<GameItem key={`game-item--${game.id}`} data={game} canRemove={true} onRemoveClick={this.onRemoveGameItemClick.bind(this)} />);
        }
        return gamesList;
    }
}

export default CategoryFormPage;