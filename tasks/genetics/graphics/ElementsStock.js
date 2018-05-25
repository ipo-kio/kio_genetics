import ChainElement from './ChainElement';

export default class ElementsStock {
  constructor(view) {
    this._view = view;

    this._elem_width = view.elementWidth+view.margin;
    this._elem_height = view.elementHeight*1.5;

    this._elem_per_column = Math.round((view.viewHeight - view.margin*2) / this._elem_height);
    let rows = Math.ceil(view.numbersAmount / this._elem_per_column);
    this._width = view.margin + this._elem_width*rows;

    if(this._width > view.viewWidth / 2)
      throw 'ElementsStock is wider than half of MainView';
  }

  get width() {
    return this._width;
  }

  // Draw
  init(stage, x_offset) {
    let y_offset = this._view.elementHeight*0.5 + (this._view.viewHeight - this._elem_height*this._elem_per_column) / 2;

    for(let i=0; i<this._view.numbersAmount; i++) {
      new ChainElement(this._view.margin + x_offset, y_offset + i % this._elem_per_column * this._elem_height,
        i, this._view, true).init(stage);

      if(i % this._elem_per_column === this._elem_per_column-1)
        x_offset += this._elem_width;
    }

    return this;
  }
}