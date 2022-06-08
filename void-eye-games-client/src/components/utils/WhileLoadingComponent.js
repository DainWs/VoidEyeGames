import React from 'react';
import { EventObserver } from '../../domain/EventObserver';

class WhileLoadingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingItemsCount: 0
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
    }

    render() {
        if (this.state.loadingItemsCount <= 0) {
            return <></>;
        }

        return (
            <div>
                
            </div>
        );
    }
}

export default WhileLoadingComponent;
