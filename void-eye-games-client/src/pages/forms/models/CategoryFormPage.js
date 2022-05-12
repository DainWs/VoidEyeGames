import React from 'react';
import { Navigate } from 'react-router-dom';
import Select from 'react-select'
import GameListItemComponent from '../../../components/models/lists/GameListItemComponent';
import Category from '../../../domain/models/dtos/Category';
import { SessionManager } from '../../../domain/SessionManager';
import { withRouter } from '../../../routes/Routes';
import { SocketController } from '../../../services/socket/SocketController';
import { SocketDataFilter } from '../../../services/socket/SocketDataFilter';
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORIES_UPDATES, DESTINATION_CATEGORY, DESTINATION_LIST_OF_CATEGORIES, DESTINATION_LIST_OF_GAMES } from '../../../services/socket/SocketDestinations';
import SocketRequest from '../../../services/socket/SocketRequest';
import ModelFormPage, { MODEL_FORM_MODE_EDIT } from './ModelFormPage';

// TODO check multi games context menu
class CategoryFormPage extends ModelFormPage {

    createState(props) {
        let parentState = super.createState(props);
        parentState.category = new Category();
        parentState.selectedGame = null;
        parentState.listedGames = [];
        parentState.listedCategories = [];
        return parentState;
    }

    onChangeEditingCategory(newOne) {
        this.navigate(`/admin/category/${newOne.value}`, { replace: true });
        this.requestCategory(newOne.value);
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
        SocketController.sendCustomWithCallback(new SocketRequest(), DESTINATION_LIST_OF_CATEGORIES, this.onCategoriesResult.bind(this));
        this.requestCategory();
    }

    requestCategory(id = this.state.id) {
        if (this.state.mode === MODEL_FORM_MODE_EDIT && (this.state.id)) {
            let request = new SocketRequest();
            request.setParams({id: id});
            SocketController.sendCustomWithCallback(request, DESTINATION_CATEGORY, this.onCategoryResult.bind(this));
        }
    }

    onCategoryResult(response) {
        this.setState({category: response.data});
    }

    onCategoriesResult(response) {
        this.setState({listedCategories: response.data});
    }

    onGameSuccess(response) {
        this.setState({listedGames: response.data});
    }

    render() {
        let category = this.state.category;
        if (category == null) {
            category = new Category();
        }
        console.log(this.state.category);
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
                            <label htmlFor='selected-category-form'>Editing:</label>
                            <Select id='selected-category-form' className='flex-grow-1 p-0 pt-2 pt-sm-0 pl-sm-2' 
                                placeholder={category.name || 'New Category'}
                                isOptionSelected={opt => opt.value == category.id}
                                hideSelectedOptions={true}
                                options={this.getCategoriesOptions()} 
                                onChange={this.onChangeEditingCategory.bind(this)}/>    
                        </section>

                        <section className='mb-3'>
                            <label htmlFor='category-form--name'>Name:</label>
                            <input id='category-form--name' className='w-100 form-control' type='text' value={category.name || ''} onChange={this.onChangeName.bind(this)} autoComplete='false'/>
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

    getCategoriesOptions() {
        let categoriesOptions = [{value: -1, label: 'New category'}];
        let listedCategories = this.state.listedCategories;
        for (const category of listedCategories) {
            categoriesOptions.push({ value: category.id, label: category.name });
        }
        return categoriesOptions;
    }

    getGamesOptions() {
        if (!this.state.category) return [];
        let gamesOptions = [];
        let leakedGames = SocketDataFilter.getGamesNotIn(this.state.listedGames, this.state.category.games);
        for (const leakedGame of leakedGames) {
            gamesOptions.push({ value: leakedGame.id, label: leakedGame.name });
        }
        return gamesOptions;
    }

    getGamesList() {
        if (!this.state.category) return [];
        let gamesList = [];
        for (const game of this.state.category.games) {
            let GameItem = withRouter(GameListItemComponent);
            gamesList.push(<GameItem key={`game-item--${game.id}`} data={game} canRemove={true} onRemoveClick={this.onRemoveGameItemClick.bind(this)} />);
        }
        return gamesList;
    }
}

export default CategoryFormPage;