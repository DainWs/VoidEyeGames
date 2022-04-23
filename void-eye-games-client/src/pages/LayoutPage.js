import { Outlet } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import HeaderComponent from "../components/HeaderComponent";
import { StatusBar } from "expo-status-bar";

const LayoutPage = () => {
  return (
    <>
      <StatusBar style="auto" />
      <HeaderComponent/>
      <Outlet />
      <FooterComponent/>
    </>
  )
};

export default LayoutPage;