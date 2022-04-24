import React from 'react';
import PlataformGame from '../../domain/models/dtos/PlataformGame';
import ResourceMangerInstance from '../../domain/ResourceManager';

class GameItemComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.plataformGame = new PlataformGame(props.plataformGame);
    this.state = {
      showType: props.showType
    };
  }

  componentDidMount() {
  }

  render() {
    let type = this.getShowTypeView();
    let imageUrl = ResourceMangerInstance.getImageUrl(this.plataformGame.games.getMainImage());
    let plataformImageUrl = ResourceMangerInstance.getImageUrl(this.plataformGame.plataforms.getLogo());
    return (
      <div className='position-relative p-0 m-1 border border-secondary'>
        <img className='mw-100' src={imageUrl} alt={this.plataformGame.games.name}/>
        <span className='position-absolute w-50 bg-secondary pl-2 border border-secondary text-primary' style={{left: 0, top: 0, fontWeight: 'bold'}}>{this.plataformGame.games.name}</span>
        <div className='position-absolute bg-quinary border border-secondary d-flex align-items-center' style={{right: 0, bottom: 0}}>
          <div className='bg-primary p-1 h-100' style={{maxWidth: '34px'}}><img className='mw-100' src={plataformImageUrl} alt={this.plataformGame.plataforms.name}/></div>
          <span className='px-2 text-primary' style={{fontWeight: 'bold'}}>{type}</span>
        </div>
      </div>
    );
  }

  getShowTypeView() {
    if (this.state.showType === 'discount') {
      return `${this.plataformGame.discount}%`;
    }
    return `${this.plataformGame.price} ${this.plataformGame.priceUnit}`;
  }
}

export default GameItemComponent;
