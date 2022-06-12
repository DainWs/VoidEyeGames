/**
 * File: Routes.js
 * Purpose: A file used to create a function component and can
 * use useParams() and useNavigate() functions, allow arguments via url.
 * DB Access: No
 * Used from:
 *  - index.js
 *  - LayoutPage.js
 *  - CategoryFormPage.js
 *  - GameFormPage.js
 *  - PlataformFormPage.js
 * Uses files:
 *  - The following imported files:
 */
import { useNavigate, useParams } from "react-router-dom";

/**
 * create a function component and can
 * use useParams() and useNavigate() functions, 
 * allow arguments via url.
 * @param {*} Child a element object.
 * @returns the function component from the specified child element.
 */
export function withRouter(Child) {
    return (props) => <Child {...props} params={useParams()} navigate={useNavigate()}/>;
}