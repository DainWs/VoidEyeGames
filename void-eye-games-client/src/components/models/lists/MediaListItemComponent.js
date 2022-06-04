import React from 'react';
import ReactTooltip from 'react-tooltip';
import Media from '../../../domain/models/dtos/Media';
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
        if (media.mediaType == media.name) {
            return `${Math.trunc(Math.random() * 100000)}`;
        }
        return `${media.name}`;
    }

    render() {
        this.key = Math.random() * (new Date().getTime());
        return (
            <div key={this.key}
                className='list--item btn btn-primary text-left position-relative p-0 border-botton border-form' 
                style={{maxWidth: '100%', overflow: 'visible !important'}}
                onClick={this.onContextMenu.bind(this)}
                onContextMenu={this.onContextMenu.bind(this)}>
                <div className='col-12 p-0 py-2 pl-3 text-nowrap text-truncate'
                    style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflowX: 'hidden'}}
                    data-tip={this.getImageView()} >
                    <span>{this.getTitle()}</span>
                </div>
                <ul id={this.key} 
                    className='position-absolute bg-primary border border-top-0 rounded-bottom d-none col-12 col-xm-10 col-sm-8 col-md-6 m-0 p-0'
                    style={{top: '100%', right: 0, zIndex: 100}}>
                    {this.getContextMenuItemsList()}
                </ul>
                <ReactTooltip html={true} place={'top'} />
            </div>
        );
    }

    getImageView() {
        let media = new Media(this.state.data);
        if (media.mediaType.match(/.*video.*/)) {
            return `<video width="200" autoplay muted><source src="${media.getUrl()}" type="${media.mediaType}"/>Your browser does not support the video tag.</video>`;
        }
        return `<img src="${media.getUrl() || media.src}" alt="Main image" style="max-width: 200px" />`;
    }

    getContextMenuItemsList() {
        let contextMenuItems = [];
        contextMenuItems.push(this.getRemoveContextMenuItem());
        return contextMenuItems;
    }

    getRemoveContextMenuItem() {
        if (this.state.isRemoveEnable) {
            let id = this.state.data.id;
            let name = this.state.data.name;
            return (this.getContextItemView(`remove-${id}`, 'Remove', {id: id, name: name}, this.onRemoveClick))
        }
        return [];
    }

    getContextItemView(key, title, data, onclick) {
        return <a key={key} className='w-100 btn btn-primary text-left text-dark' onClick={e => onclick(data)}>{title}</a>;
    }
}

export default MediaListItemComponent;
