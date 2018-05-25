import Anchors from "./Anchors";

export default class Layout {
  constructor(view, width, min_anchors_num) {
    this._view = view;
    this._width = width;

    this._anchor_width = this._view.elementWidth*1.1;
    this._anchor_height = this._view.elementHeight*1.5;
    this._anchors_per_row = Math.round((width - this._view.margin*2) / (this._anchor_width));
    this._anchors_num = Math.ceil(min_anchors_num / this._anchors_per_row) * this._anchors_per_row;
    this._rows = Math.ceil(this._anchors_num / this._anchors_per_row);

    if((this._view.viewHeight - this._view.margin*2) / this._rows < this._anchor_height)
      throw 'Not enough space to place anchors';
  }

  get width() {
    return this._width;
  }

  init(stage) {
    this._stage = stage;

    let x_offset = this._anchor_width*0.5 + (this._width - this._anchor_width*this._anchors_per_row) / 2;
    let y_offset = this._anchor_height*0.5 + (this._view.viewHeight - this._anchor_height*this._rows) / 2;

    this._anchors = new Anchors(this._stage);
    for(let i=0; i<this._anchors_num; i++) {
      this._anchors.createAnchor(x_offset + i%this._anchors_per_row*this._anchor_width,
        y_offset);

      if(i%this._anchors_per_row === this._anchors_per_row-1)
        y_offset += this._anchor_height;
    }

    return this;
  }
}