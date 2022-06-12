import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function withRouter(Child) {
    return (props) => <Child {...props} params={useParams()} navigate={useNavigate()}/>;
}