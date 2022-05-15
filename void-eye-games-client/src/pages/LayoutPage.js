import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SessionManager } from "../domain/SessionManager";
import { withRouter } from "../routes/Routes";

const RouterHeaderComponent = withRouter(HeaderComponent);

class LayoutPage extends React.Component {
  toTopOfView() {
    window.scrollTo(0, 0);
  }

  componentDidMount() {
    SessionManager.reload();
  }

  render() {
    return (
      <>
        <RouterHeaderComponent/>
        <div className="flex-grow-1"><Outlet /></div>
        <FooterComponent/>

        <a className="position-fixed p-right-bottom-1 d-flex align-items-center justify-content-center bg-secondary rounded-circle" 
          style={{width: '50px', height: '50px', zIndex: '200'}} 
          onClick={this.toTopOfView}>
          <FontAwesomeIcon icon={faAngleUp} style={{ width: '50%', height: '50%' }} />
        </a>
      </>
    );
  }
}

export default LayoutPage;