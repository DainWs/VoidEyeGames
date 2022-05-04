import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class LayoutPage extends React.Component {
  toTopOfView() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <StatusBar style="auto" />
        <HeaderComponent/>
        <Outlet />
        <FooterComponent/>

        <a className="position-fixed p-right-bottom-1 d-flex align-items-center justify-content-center bg-secondary rounded-circle" style={{width: '50px', height: '50px'}} onClick={this.toTopOfView.bind(this)}>
          <FontAwesomeIcon icon={faAngleUp} style={{ width: '50%', height: '50%' }} />
        </a>
      </>
    );
  }
}

export default LayoutPage;