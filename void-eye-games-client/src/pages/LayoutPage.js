import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import { StatusBar } from "expo-status-bar";
import React from "react";

class LayoutPage extends React.Component {
  render() {
    return (
      <>
        <StatusBar style="auto" />
        <HeaderComponent/>
        <Outlet />
        <FooterComponent/>
      </>
    );
  }
}

export default LayoutPage;