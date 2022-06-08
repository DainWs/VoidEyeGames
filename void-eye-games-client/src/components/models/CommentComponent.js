import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.comment = props.comment
    }

    render() {
        return (
            <div className='d-flex mx-3 my-2 m-sm-3'>
                <div className='d-flex align-items-start justify-content-center rounded mr-3 mt-2'>
                    <div className='bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center' style={{ width: '50px', height: '50px' }}>
                        <FontAwesomeIcon icon={faUser} style={{ width: '50%', height: '50%' }} />
                    </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                    <h5 className='pb-3'>{this.comment.users.name}</h5>
                    <p className='border border-black rounded p-2 m-0' style={{ wordWrap: 'anywhere' }}>{this.comment.description}</p>
                </div>
            </div>
        );
    }
}

export default CommentComponent;
