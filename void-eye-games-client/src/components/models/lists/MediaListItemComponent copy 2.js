import React from 'react';
import ItemContextMenuComponent from './ItemContextMenuComponent';

class MediaListItemComponent extends ItemContextMenuComponent {
    constructor(props) {
        super(props);
        this.onRemoveClick = props.onRemoveClick;
    }

    createState(props) {
        let parentState = super.createState(props);
        parentState.isRemoveEnable = (props.canRemove);
        return parentState;
    }

    getTitle() {
        let media = this.state.data;
        return `${media.id} - ${media.name}`;
    }

    getContextMenuItemsList() {
        let contextMenuItems = [];
        contextMenuItems.push(this.getRemoveContextMenuItem());
        return contextMenuItems;
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

export default MediaListItemComponent;
