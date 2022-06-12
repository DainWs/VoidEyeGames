/**
 * File: GameListItemComponent.js
 * Purpose: This component view creates a context ListItemComponent that
 * represents a game model.
 * DB Access: No
 * Used from:
 *  - CategoryFormPage.js
 *  - PlataformFormPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import ItemContextMenuComponent from './ItemContextMenuComponent';

class GameListItemComponent extends ItemContextMenuComponent {
    constructor(props) {
        super(props);
        this.onEditClick = props.onEditClick;
        this.onRemoveClick = props.onRemoveClick;
    }

    createState(props) {
        let parentState = super.createState(props);
        parentState.isEditEnable = (props.canEdit);
        parentState.isRemoveEnable = (props.canRemove);
        return parentState;
    }

    getTitle() {
        let game = this.state.data;
        return `${game.id} - ${game.name}`;
    }

    getContextMenuItemsList() {
        let contextMenuItems = [];
        contextMenuItems.push(this.getEditContextMenuItem());
        contextMenuItems.push(this.getRemoveContextMenuItem());
        return contextMenuItems;
    }

    getEditContextMenuItem() {
        if (this.state.isEditEnable) {
            let id = this.state.data.id;
            return (this.getContextItemView(`edit-${id}`, 'Edit', id, this.onEditClick));
        }
        return [];
    }

    getRemoveContextMenuItem() {
        if (this.state.isRemoveEnable) {
            let id = this.state.data.id;
            return (this.getContextItemView(`remove-${id}`, 'Remove', id, this.onRemoveClick))
        }
        return [];
    }

    getContextItemView(key, title, data, onclick) {
        return <a key={key} className='w-100 btn btn-primary text-left text-dark' onClick={e => onclick(data)}>{title}</a>;
    }
}

export default GameListItemComponent;
