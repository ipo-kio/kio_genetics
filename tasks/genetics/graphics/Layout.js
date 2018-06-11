import Anchors from "./Anchors";

export default class Layout {
  constructor(view, width) {
    this._view = view;
    this._width = width;

    this._anchor_width = view.elementWidth*1.1;
    this._anchor_height = view.elementHeight*1.5; // min height
    this._anchors_per_row = Math.round((width - view.margin*2) / (this._anchor_width));
    this._anchors_num = Math.ceil(view.numbersAmount / this._anchors_per_row) * this._anchors_per_row;
    this._rows = Math.ceil(this._anchors_num / this._anchors_per_row);

    if((view.viewHeight - view.margin*2) / this._rows < this._anchor_height)
      throw 'Error: not enough space to place anchors';

    this._anchor_height = (this._view.viewHeight - this._view.margin*2) / this._rows; // real height (flex)
  }

  get width() {
    return this._width;
  }

  getItems() {
    return this._anchors.getItems();
  }

  checkAnchors(element) {
    this._anchors.checkAnchors(element);
  }

  checkSolution(element) {
    this._anchors.checkSolution(element);
  }

  deserialize(anchor_states) {
    this._anchors.deserialize(anchor_states);
  }

  init(stage) {
    let x_offset = this._anchor_width*0.5 + (this._width - this._anchor_width*this._anchors_per_row) / 2;
    let y_offset = this._view.margin + this._anchor_height*0.5;

    this._anchors = new Anchors(this._view, stage);
    for(let i=0; i<this._anchors_num; i++) {
      this._anchors.createAnchor(x_offset + i%this._anchors_per_row*this._anchor_width,
        y_offset);

      if(i%this._anchors_per_row === this._anchors_per_row-1 && i+1<this._anchors_num) {
        let x1 = x_offset + i%this._anchors_per_row*this._anchor_width,
          y1 = y_offset,
          x2, y2 = y_offset + this._anchor_height/2,
          x3 = x_offset, y3,
          x4, y4 = y_offset + this._anchor_height;
        x2 = x1; y3 = y2; x4 = x3;

        let line = new createjs.Shape();
        line.graphics.setStrokeStyle(1).beginStroke("rgba(173,216,230,1)").moveTo(x1, y1).lineTo(x2, y2).lineTo(x3, y3).lineTo(x4, y4);
        stage.addChild(line);
        stage.setChildIndex(line, 0);

        y_offset += this._anchor_height;
      }
    }

    return this;
  }
}