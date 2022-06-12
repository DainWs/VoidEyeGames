/**
 * File: PlataformComponent.js
 * Purpose: This component view creates the plataform view used in details.
 * DB Access: No
 * Used from:
 *  - GameDetailsPage.js
 * Uses files:
 *  - The following imported files:
 */
import React from 'react';
import Plataform from '../../domain/models/dtos/Plataform';

class PlataformComponent extends React.Component {
    constructor(props) {
        super(props);
        this.plataformGame = props.plataformGame;
        this.plataform = new Plataform(this.plataformGame.plataforms);
    }

    render() {
        return (
            <a className='plataform-link d-flex border border-black rounded m-0 mt-2 mt-md-0 w-100 text-decoration-none'
                href={this.plataform.url} target="_blank">

                <div className='border border-black rounded-left p-0'>
                    <div className='h-100 p-2 d-flex align-items-center justify-content-center'>
                        <img src={this.plataform.getLogo()} alt={this.plataform.name} className='plataform-image' style={{ width: '25px' }} />
                    </div>
                </div>
                <div className='d-flex flex-grow-1'>
                    <div className='w-50 d-flex align-items-center justify-content-center text-dark'>
                        {this.plataform.name}
                    </div>
                    <div className='plataform-price w-50 d-flex align-items-center justify-content-center bg-quinary border-left border-black rounded-right font-weight-bold text-primary'>
                        {this.getPriceView()}
                    </div>
                </div>
            </a>
        );
    }

    getPriceView() {
        let discount = (this.plataformGame.discount > 0) ? `(-${this.plataformGame.discount * 100}%)` : '';
        let discountView = (this.plataformGame.discount > 0) ? (<span className='discount'>{discount}</span>) : <></>;
    
        let price = `${this.plataformGame.price} ${this.plataformGame.priceUnit}`;
        if (this.plataformGame.price <= 0) {
          price = 'FREE'
        }
    
        return ( <><span className='text-center'>{price}</span>{discountView}</> );
    }
}

export default PlataformComponent;
