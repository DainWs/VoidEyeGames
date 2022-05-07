import React from 'react';
import { Navigate } from 'react-router-dom';
import Select from 'react-select'
import GameListItemComponent from '../../../components/models/lists/GameListItemComponent';
import Category from '../../../domain/models/dtos/Category';
import { SessionManager } from '../../../domain/SessionManager';
import { withRouter } from '../../../Main';
import { SocketController } from '../../../services/socket/SocketController';
import { SocketDataFilter } from '../../../services/socket/SocketDataFilter';
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORIES_UPDATES, DESTINATION_CATEGORY, DESTINATION_LIST_OF_GAMES } from '../../../services/socket/SocketDestinations';
import SocketRequest from '../../../services/socket/SocketRequest';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

// TODO check multi games context menu
class CategoryFormPage extends ModelFormPage {

    createState(props) {
        let parentState = super.createState(props);
        parentState.category = new Category();
        parentState.selectedGame = null;
        parentState.listedGames = [];
        return parentState;
    }

    //---------------------------------------------------------------------------------------------
    // CATEGORIES FORM
    //---------------------------------------------------------------------------------------------

    onChangeName(event) {
        let category = this.state.category;
        category.name = event.target.value;
        this.setState({category:category});
    }

    //---------------------------------------------------------------------------------------------
    // GAMES FORM
    //---------------------------------------------------------------------------------------------

    onChangeSelectedGame(event) {
        this.setState({selectedGame: event.value});
    }

    addSelectedGame() {
        let selectedGameId = this.state.selectedGame;
        if (!selectedGameId || selectedGameId <= 0) return;

        let game = Array.from(this.state.listedGames)
            .find(v => v.id === selectedGameId);

        let category = new Category(this.state.category);
        category.addGame(game);
        this.setState({category: category});
    }

    onRemoveGameItemClick(id) {
        let category = new Category(this.state.category);
        category.removeGame(id);
        this.setState({category: category});
    }

    onGameContextClick(id) {
        let gamesElements = document.getElementById('games-list');
        for(const element of gamesElements.children) {
            if (element.id !== id) element.blur();
        }
    }

    //---------------------------------------------------------------------------------------------
    // SUBMIT
    //---------------------------------------------------------------------------------------------

    submit() {
        let category = this.state.category;
        category.games = [];
        let request = new SocketRequest();
        request.setBody(JSON.stringify(category));
        request.setMethod('POST');
        
        let destination = DESTINATION_CATEGORIES;
        if (this.state.mode === MODEL_FORM_MODE_EDIT) {
            destination = DESTINATION_CATEGORIES_UPDATES;
        }

        SocketController.sendCustomWithCallback(
            request, destination,
            this.onSuccess.bind(this),
            this.onFailed.bind(this)
        );
    }

    onSuccess(response) {
        if (response.data.status !== 200) {
            this.onFailed(response);
            return;
        }
        document.getElementById('navigate-home').click();
    }

    onFailed(response) {
        this.setState({errors: response.data.body });
    }

    componentDidMount() {
        SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_GAMES, this.onGameSuccess.bind(this));
        if (this.state.mode === MODEL_FORM_MODE_EDIT) {
            let request = new SocketRequest();
            request.setParams({id: this.state.id});
            SocketController.sendCustomWithCallback(request, DESTINATION_CATEGORY, this.onCategoryResult.bind(this));
        }
    }

    onCategoryResult(response) {
        console.log(response);
        this.setState({category: response.data});
    }

    onGameSuccess(response) {
        console.log(response);
        this.setState({listedGames: response.data});
    }

    render() {
        SessionManager.reload();
        return (
            <section className='row h-100'>
                {this.checkSession()}
                <article className='d-flex flex-column mx-auto p-2 col-10'>
                    <header>
                        <h1 className='text-center'>Categories Form</h1>
                    </header>
                    <form className='d-flex flex-column flex-grow-1'>
                        <section className='mb-3'>
                            <label htmlFor='category-form--name'>Name:</label>
                            <input id='category-form--name' className='w-100 form-control' type='text' value={this.state.category.name} onChange={this.onChangeName.bind(this)} autoComplete='false'/>
                        </section>
                        <section className='row w-100 m-0'>
                            <Select className='flex-grow-1 p-0' options={this.getGamesOptions()} onChange={this.onChangeSelectedGame.bind(this)}/>
                            <a className='btn btn-form  text-dark col-12 col-sm-2 m-0 mt-3 mt-sm-0 ml-sm-2' onClick={this.addSelectedGame.bind(this)}>Add game</a>
                        </section>
                        <hr className='w-100'/>
                        <fieldset id='games-list' title='Games in category' className='d-flex flex-column flex-grow-1 w-100 border border-gray rounded' style={{ overflowX: 'hidden',overflowY: 'scroll', minHeight: '100px'}}>
                            <div className='d-flex flex-column flex-grow-1 w-100 h-100' style={{ overflowX: 'hidden', overflowY: 'scroll', minHeight: '200px' }}>
                                {this.getGamesList()}
                            </div>
                        </fieldset>
                        <section className='my-3'>
                            <a className='btn btn-form w-100 text-dark' onClick={this.submit.bind(this)}>Save all</a>
                        </section>
                    </form>
                    {this.getErrorView()}
                </article>
            </section>
        );
    }

    checkSession() {
        return (SessionManager.check()) ? <Navigate replace to="/home" /> : <></>;
    }

    getGamesOptions() {
        let gamesOptions = [];
        let leakedGames = SocketDataFilter.getGamesNotIn(this.state.listedGames, this.state.category.games);
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