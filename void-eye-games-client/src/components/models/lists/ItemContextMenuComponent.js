import React from 'react';

class ItemContextMenuComponent extends React.Component {
    constructor(props) {
        super(props);
        this.navigate = props.navigate;
        this.state = this.createState(props);
    }

    createState(props) {
        return { data: props.data };
    }

    onContextMenu(event) {
        event.preventDefault();
        let contextMenu = document.getElementById(`${this.key}`);
        if (contextMenu.className.match('d-none')) {
            contextMenu.className = contextMenu.className.replace('d-none', 'd-block');
            contextMenu.parentElement.className = contextMenu.parentElement.className + ' active';
            contextMenu.parentElement.focus();
            return;
        }
        contextMenu.className = contextMenu.className.replace('d-block', 'd-none');
        contextMenu.parentElement.className = contextMenu.parentElement.className.replace('active', '');
        contextMenu.parentElement.blur();
    }

    render() {
        this.key = Math.random() * (new Date().getTime());
        return (
            <div key={this.key} 
                className='list--item btn btn-primary text-left position-relative p-0 py-2 border-botton border-form'
                onClick={this.onContextMenu.bind(this)}
                onContextMenu={this.onContextMenu.bind(this)}>
                <span className='col-12 p-0 py-2 pl-3 text-nowrap text-truncate'>{this.getTitle()}</span>
                <ul id={this.key} 
                    className='position-absolute bg-primary border border-top-0 rounded-bottom d-none col-12 col-xm-10 col-sm-8 col-md-6 col-lg-4 col-xl-2 m-0 p-0 py-2'
                    style={{top: '100%', right: 0, zIndex: 100}}>
                    {this.getContextMenuItemsList()}
                </ul>
            </div>
        );
    }

    getTitle() {
        return this.state.data;
    }

    getContextMenuItemsList() {
        return (<></>);
    }
}

export default ItemContextMenuComponent;
