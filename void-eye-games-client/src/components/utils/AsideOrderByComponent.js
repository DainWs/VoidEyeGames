import React from 'react';

class AsideOrderByComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = props.onChange;
        this.state = {
            orderMethod: props.orderMethod
        };
    }

    render() {
        return (
            <section>
                <header className='bg-secondary text-primary'>
                    <h4 className='m-0 px-2 py-2'>Order by</h4>
                </header>
                <div className='d-flex flex-column mt-2 mb-4'>
                    <label className='m-0 pl-3' htmlFor='order-name'>
                        <input id='order-name' type="radio" value="Name" name="order" checked={this.state.orderMethod == 'name'} onChange={this.onChange} /> Name
                    </label>
                    <label className='m-0 pl-3' htmlFor='order-price'>
                        <input id='order-price' type="radio" value="Price" name="order" checked={this.state.orderMethod == 'price'} onChange={this.onChange} /> Price
                    </label>
                    <label className='m-0 pl-3' htmlFor='order-plataform'>
                        <input id='order-plataform' type="radio" value="Plataform" name="order" checked={this.state.orderMethod == 'plataform'} onChange={this.onChange} /> Plataform
                    </label>
                </div>
            </section>
        );
    }
}

export default AsideOrderByComponent;
