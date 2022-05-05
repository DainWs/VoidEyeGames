import React from 'react';
import { Link } from 'react-router-dom';
import PlataformGame from '../../domain/models/dtos/PlataformGame';
import PriceUnitEnum from '../../domain/models/PriceUnits';

class GameItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plataformGame: new PlataformGame(props.plataformGame),
      showType: props.showType
    };
  }

  navigate() {
    document.getElementById(this.linkId).click();
  }

  render() {
    console.log(this.state.plataformGame);
    this.linkId = `${this.state.plataformGame.plataformsId}-${this.state.plataformGame.games.id}__link-navigation`;
    return (
      <div className={this.getContainerClasses()}>
        <Link id={this.linkId} to={'/details/' + this.state.plataformGame.games.id}></Link>
        <div style={this.getGameImageView()}  onClick={this.navigate.bind(this)}
          className='game-item noselect position-relative p-0 m-0 border border-secondary mw-100 mh-100 w-100 h-100'>
          <span className='position-absolute w-100 bg-secondary pl-2 border border-secondary text-primary font-weight-bold p-left-top-0' style={{fontSize: 'calc(1vw + 0.5rem)'}}>{this.state.plataformGame.games.name}</span>
          <div className='position-absolute bg-quinary border border-secondary d-flex align-items-center p-right-bottom-0' style={{fontSize: 'calc(1vw + 0.5rem)', minWidth: '20%'}}>
            <div className='bg-primary p-1 h-100' style={{maxWidth: 'calc(1vw + 2rem)'}}>{this.getPlataformImageView()}</div>
            <div className='flex-grow-1 d-flex align-items-center justify-content-center'><span className='px-2 text-primary font-weight-bold'>{this.getShowTypeView()}</span></div>
          </div>
        </div>
      </div>
    );
  }
  // Can be override by childs classes
  getContainerClasses() {
    return 'game-item__container p-1';
  }

  // Can be override by childs classes
  getGameImageView() {
    return {backgroundImage: `url(${this.getGameImageUrl()})`}
  }

  // Can be override by childs classes
  getGameImageUrl() {
    return this.state.plataformGame.games.getImageUrl();
  }

  // Can be override by childs classes
  getPlataformImageView() {
    return (<img src={this.getPlataformImageUrl()} alt={this.state.plataformGame.plataforms.name} className='mw-100' />);
  }

  // Can be override by childs classes
  getPlataformImageUrl() {
    return this.state.plataformGame.plataforms.getLogo();
  }

  // Can be override by childs classes
  getShowTypeView() {
    if (this.state.showType === 'discount' && this.state.plataformGame.discount > 0) {
      return `-${(this.state.plataformGame.discount * 100)}%`;
    }
    let priceUnit = PriceUnitEnum.getPriceUnitById(this.state.plataformGame.priceUnit);
    return `${this.state.plataformGame.price} ${priceUnit.getSymbol()}`;
  }
}

export default GameItemComponent;
