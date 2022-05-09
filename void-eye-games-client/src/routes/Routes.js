export function withRouter(Child) {
    return (props) => <Child {...props} params={useParams()} navigate={useNavigate()}/>;
}