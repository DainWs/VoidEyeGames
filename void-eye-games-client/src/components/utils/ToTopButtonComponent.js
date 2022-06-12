/**
 * File: ToTopButtonComponent.js
 * Purpose: Create a button that when 
 * pressed sends you to the top of the page.
 * DB Access: No
 * Used from:
 *  - LayoutPage.js
 * Uses files:
 *  - The following imported files:
 */
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

class ToTopButtonComponent extends React.Component {
    toTopOfView() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <a className="to-top-btn position-fixed p-right-bottom-1 d-flex align-items-center justify-content-center bg-secondary rounded-circle"
                style={{ minWidth: '50px', minHeight: '50px', width: '3vw', height: '3vw', zIndex: '200', cursor: "pointer" }}
                onClick={this.toTopOfView}>
                <FontAwesomeIcon icon={faAngleUp} style={{ width: '50%', height: '50%' }} />
            </a>
        );
    }
}

export default ToTopButtonComponent;