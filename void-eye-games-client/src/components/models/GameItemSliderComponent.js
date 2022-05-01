import GameItemComponent from './GameItemComponent';

class GameItemSliderComponent extends GameItemComponent {
  getContainerClasses() {
    return 'game-item__container game-slider p-1';
  }
}

export default GameItemSliderComponent;
