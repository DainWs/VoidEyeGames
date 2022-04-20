import React from 'react';

class FooterComponent extends React.Component {
  render() {
    return (
      <footer className='d-flex'>
        <section>
            <h6>Example 1</h6>
            <ul>
                <li>Subexample 1</li>
                <li>Subexample 2</li>
            </ul>
        </section>
        <section>
            <h6>Example 2</h6>
            <ul>
                <li>Subexample 1</li>
                <li>Subexample 2</li>
            </ul>
        </section>
        <section>
            <h6>Example 3</h6>
            <ul>
                <li>Subexample 1</li>
                <li>Subexample 2</li>
            </ul>
        </section>
      </footer>
    );
  }
}

export default FooterComponent;
