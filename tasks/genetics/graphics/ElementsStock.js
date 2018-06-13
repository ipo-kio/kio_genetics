import * as Settings from "./../settings";
import ChainElement from './ChainElement';

export default class ElementsStock {
  constructor(view) {
    this._view = view;

    this._elem_width = view.elemLen*Settings.BLOCK_WIDTH+Settings.MARGIN;
    this._elem_height = Settings.ELEMENT_HEIGHT*1.3;

    this._elem_per_column = Math.round((view.frame.height - Settings.MARGIN*2) / this._elem_height);
    let rows = Math.ceil(view.elemNum / this._elem_per_column);
    this._width = Settings.MARGIN*2 + this._elem_width*rows;

    if(this._width > view.frame.width / 2)
      throw 'Error: ElementsStock is wider than half of MainView';
  }

  get width() {
    return this._width;
  }

  // Draw
  init(stage, x_offset) {
    let y_offset = Settings.ELEMENT_HEIGHT*0.5 + (this._view.frame.height - this._elem_height*this._elem_per_column) / 2;
    for(let i=0; i<this._view.elemNum; i++) {
      this._view.elements[i] = new ChainElement(this._view, i);
      this._view.elements[i].container.pos(Settings.MARGIN + x_offset, y_offset + i % this._elem_per_column * this._elem_height, stage);

      if(i % this._elem_per_column === this._elem_per_column - 1)
        x_offset += this._elem_width;
    }

    return this;
  }
}