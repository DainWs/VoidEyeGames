import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import React from "react";
import { SessionManager } from "../domain/SessionManager";
import { withRouter } from "../routes/Routes";
import ToTopButtonComponent from "../components/utils/ToTopButtonComponent";
import WhileLoadingComponent from "../components/utils/WhileLoadingComponent";
import HealthDialogComponent from "../components/utils/HealthDialogComponent";

const RouterHeaderComponent = withRouter(HeaderComponent);

/**
 * The main view container
 */
class LayoutPage extends React.Component {
  componentDidMount() {
    SessionManager.reload();
  }
  
  //============================================
  // VIEW
  //============================================
  render() {
    return (
      <>
        <RouterHeaderComponent />
        <div className="app-content flex-grow-1"><Outlet /></div>
        <FooterComponent />

        <ToTopButtonComponent/>
        <WhileLoadingComponent/>
        <HealthDialogComponent/>
      </>
    );
  }
}

export default LayoutPage;