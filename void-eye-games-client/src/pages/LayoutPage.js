import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SessionManager } from "../domain/SessionManager";
import { withRouter } from "../routes/Routes";
import { CacheConfiguration } from '../domain/cache/CacheConfiguration';
import { DESTINATION_HEALTH } from "../services/socket/SocketDestinations";
import { SocketController } from "../services/socket/SocketController";
import SocketRequest from "../services/socket/SocketRequest";

const RouterHeaderComponent = withRouter(HeaderComponent);

class LayoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      errorMessage: ''
    }
  }

  toTopOfView() {
    window.scrollTo(0, 0);
  }

  healthResponse(response) {
    let health = response.data;
    if (!health || health.status != "UP") {
      this.setState({showModal: true, errorMessage: 'Ha ocurrido un error, y no se ha podido conectar con el servidor.'});
    } else {
      CacheConfiguration.set(health.details);
    }
  }

  closeModal() {
    this.setState({showModal: false, errorMessage: ''});
  }

  componentDidMount() {
    SessionManager.reload();
    
    let request = new SocketRequest();
    request.setParams({showDetails: true});
    request.setMethod('GET');
    SocketController.sendCustomWithCallback(
      request, DESTINATION_HEALTH,
      this.healthResponse.bind(this),
      this.healthResponse.bind(this)
    );
  }

  render() {
    return (
      <>
        <RouterHeaderComponent/>
        <div className="app-content flex-grow-1"><Outlet /></div>
        <FooterComponent/>

        <a className="to-top-btn position-fixed p-right-bottom-1 d-flex align-items-center justify-content-center bg-secondary rounded-circle" 
          style={{width: '3vw', height: '3vw', zIndex: '200'}} 
          onClick={this.toTopOfView}>
          <FontAwesomeIcon icon={faAngleUp} style={{ width: '50%', height: '50%' }} />
        </a>

        {this.getModal()}
      </>
    );
  }

  getModal() {
    return (
      <div className={'modal fade ' + ((this.state.showModal) ? 'show d-block' : '') } id="modalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden={!this.state.showModal}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-secondary">
              <h5 className="modal-title text-primary" id="modalLongTitle">Info</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal.bind(this)}>
                <span className="text-primary" style={{textShadow: 'none'}} aria-hidden="true">&times;</span>
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

export default LayoutPage;