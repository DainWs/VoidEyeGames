import { useParams } from "react-router-dom";
import GameDetailsComponent from "../components/models/GameDetailsComponent";

function GameDetailsPage() {
  let { id } = useParams();
  return (<GameDetailsComponent id={id}/>);
}

export default GameDetailsPage;