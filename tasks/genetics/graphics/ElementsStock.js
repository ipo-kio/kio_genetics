import ChainElement from './ChainElement';
import {MARGIN_SIZE} from './Layout';

export const ELEMENT_HEIGHT = 20;

export default class ElementsStock {
  constructor(layout) {
    this._layout = layout;
  }

  init(stage) {
    this._stage = stage;

    let x = MARGIN_SIZE + this._layout.width,
      y = MARGIN_SIZE;

    for (let i = 0; i < Math.pow(this._layout.alphabetPower, this._layout.wordLength) - 1; i++) {
      new ChainElement(x, y, i, this._layout, true, ELEMENT_HEIGHT).init(this._stage);
      y += ELEMENT_HEIGHT * 1.5;
      if (y + ELEMENT_HEIGHT + MARGIN_SIZE > this._stage.canvas.height / this._stage.scale) {
        x += this._layout.wordWidth + MARGIN_SIZE;
        y = MARGIN_SIZE;
      }
    }

    this._width = x - this._layout.width + MARGIN_SIZE + this._layout.wordWidth;

    return this;
  }

  get width() {
    return this._width;
  }
}