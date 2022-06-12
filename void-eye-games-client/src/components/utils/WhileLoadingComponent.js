/**
 * File: WhileLoadingComponent.js
 * Purpose: Its a utility menssage that notify when data is still loading.
 * DB Access: No
 * Used from:
 *  - LayoutPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import { CacheConfiguration, ON_CACHE_LOAD } from '../../domain/cache/CacheConfiguration';
import { EventObserver } from '../../domain/EventObserver';

class WhileLoadingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingItemsCount: 1
        };
    }

    addItem() {
        this.setState({loadingItemsCount: this.state.loadingItemsCount + 1});
    }

    removeItem() {
        this.setState({loadingItemsCount: this.state.loadingItemsCount - 1});
    }

    componentDidMount() {
        EventObserver.subscribe('newLoading', 'WhileLoadingComponent', this.addItem.bind(this) );
        EventObserver.subscribe('endLoading', 'WhileLoadingComponent', this.removeItem.bind(this) );
        EventObserver.subscribe(ON_CACHE_LOAD, 'WhileLoadingComponent', this.removeItem.bind(this) );
    }

    render() {
        if (!CacheConfiguration.has() || this.state.loadingItemsCount <= 0) {
            return <></>;
        }

        return (
            <div className='to-top-btn position-fixed d-flex align-items-center justify-content-center bg-secondary p-left-bottom-1'
                style={{ zIndex: '200'}}>
                <p className='text-white px-4 py-2'>Loading...</p>
            </div>
        );
    }
}

export default WhileLoadingComponent;
