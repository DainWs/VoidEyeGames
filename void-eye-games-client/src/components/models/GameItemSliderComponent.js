import GameItemComponent from './GameItemComponent';

class GameItemSliderComponent extends GameItemComponent {
  getImageStyle() {
    return {minHeight: '100%', minWidth: '100%', maxWidth: '90vw', maxHeight: '100%'};
  }
}

export default GameItemSliderComponent;
