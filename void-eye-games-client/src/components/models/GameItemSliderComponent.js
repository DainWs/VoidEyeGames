/**
 * File: GameItemSliderComponent.js
 * Purpose: This component view creates the GameItemComponent that is used for Slider items.
 * DB Access: No
 * Used from:
 *  - HomePage.js
 * Uses files:
 *  - The following imported files:
 */
import GameItemComponent from './GameItemComponent';

class GameItemSliderComponent extends GameItemComponent {
  getContainerClasses() {
    return 'game-item__container game-slider p-1';
  }
}

export default GameItemSliderComponent;
