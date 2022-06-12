/**
 * File: HealthDialogComponent.js
 * Purpose: This component view creates a dialog
 * that is show when we failed to connect with the api.
 * DB Access: No
 * Used from:
 *  - LayoutPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from "react";
import { CacheConfiguration } from "../../domain/cache/CacheConfiguration";
import { SocketController } from "../../services/socket/SocketController";
import { DESTINATION_HEALTH } from "../../services/socket/SocketDestinations";
import SocketRequest from "../../services/socket/SocketRequest";

class HealthDialogComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            errorMessage: ''
        }
    }

    healthResponse(response) {
        let health = response.data;
        if (!health || health.status != "UP") {
            this.setState({ showModal: true, errorMessage: 'Ha ocurrido un error, y no se ha podido conectar con el servidor.' });
        } else {
            CacheConfiguration.set(health.details);
        }
    }

    closeModal() {
        this.setState({ showModal: false, errorMessage: '' });
    }

    componentDidMount() {
        let request = new SocketRequest();
        request.setParams({ showDetails: true });
        request.setMethod('GET');
        SocketController.sendCustomWithCallback(
            request, DESTINATION_HEALTH,
            this.healthResponse.bind(this),
            this.healthResponse.bind(this)
        );
    }

    render() {
        return (
            <div className={'modal fade ' + ((this.state.showModal) ? 'show d-block' : '')} id="modalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden={!this.state.showModal}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header bg-secondary">
                            <h5 className="modal-title text-primary" id="modalLongTitle">Info</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal.bind(this)}>
                                <span className="text-primary" style={{ textShadow: 'none' }} aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body text-error">
                            <p>{this.state.errorMessage || ''}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeModal.bind(this)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HealthDialogComponent;