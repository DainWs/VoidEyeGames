import React from 'react';
import { Link } from 'react-router-dom';
import PlataformGame from '../../domain/models/dtos/PlataformGame';
import { ResourceManger } from '../../domain/ResourceManager';

class GameItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = props.onClick;
    this.plataformGame = new PlataformGame(props.plataformGame);
    this.state = {
      showType: props.showType
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Link to={'details/' + this.plataformGame.gamesId}>
      <div className='game-item noselect position-relative p-0 m-1 border border-secondary mw-100 mh-100'>
        {this.getGameImageView()}
        <span className='position-absolute w-50 bg-secondary pl-2 border border-secondary text-primary' style={{left: 0, top: 0, fontWeight: 'bold'}}>{this.plataformGame.games.name}</span>
        <div className='position-absolute bg-quinary border border-secondary d-flex align-items-center' style={{right: 0, bottom: 0}}>
          <div className='bg-primary p-1 h-100' style={{maxWidth: '34px'}}>{this.getPlataformImageView()}</div>
          <span className='px-2 text-primary' style={{fontWeight: 'bold'}}>{this.getShowTypeView()}</span>
        </div>
      </div>
      </Link>
    );
  }

  getGameImageView() {
    return (<img src={this.getGameImageUrl()} alt={this.plataformGame.games.name} style={this.getGameImageStyle()}/>);
  }

  getGameImageUrl() {
    let imageUrl = this.plataformGame.games.getMainImage();
    return ResourceManger.getImageUrl(imageUrl);
  }

  getGameImageStyle() {
    return {maxHeight: '100%', maxWidth: '100%'};
  }

  getPlataformImageView() {
    return (<img src={this.getPlataformImageUrl()} alt={this.plataformGame.plataforms.name} className='mw-100' />);
  }

  getPlataformImageUrl() {
    let logoUrl = this.plataformGame.plataforms.getLogo();
    return ResourceManger.getImageUrl(logoUrl);
  }

  getShowTypeView() {
    if (this.state.showType === 'discount') {
      return `${this.plataformGame.discount}%`;
    }
    return `${this.plataformGame.price} ${this.plataformGame.priceUnit}`;
  }
}

export default GameItemComponent;
