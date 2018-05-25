import Anchors from "./Anchors";

export default class Layout {
  constructor(view, width, min_anchors_num) {
    this._view = view;
    this._width = width;

    this._anchor_width = view.elementWidth*1.1;
    this._anchor_height = view.elementHeight+view.margin;
    this._anchors_per_row = Math.round((width - view.margin*2) / (this._anchor_width));
    this._anchors_num = Math.ceil(min_anchors_num / this._anchors_per_row) * this._anchors_per_row;
    this._rows = Math.ceil(this._anchors_num / this._anchors_per_row);

    if((view.viewHeight - view.margin*2) / this._rows < this._anchor_height)
      throw 'Not enough space to place anchors';
  }

  get width() {
    return this._width;
  }

  checkAnchors(element) {
    this._anchors.checkAnchors(element);
  }

  init(stage) {
    this._stage = stage;

    let x_offset = this._anchor_width*0.5 + (this._width - this._anchor_width*this._anchors_per_row) / 2;
    let y_offset = this._anchor_height*0.5 + (this._view.viewHeight - this._anchor_height*this._rows) / 2;

    this._anchors = new Anchors(this._stage);
    for(let i=0; i<this._anchors_num; i++) {
      this._anchors.createAnchor(x_offset + i%this._anchors_per_row*this._anchor_width,
        y_offset);

      if(i%this._anchors_per_row === this._anchors_per_row-1 && i+1<this._anchors_num) {
        let x1 = x_offset + i%this._anchors_per_row*this._anchor_width,
          y1 = y_offset,
          x2, y2 = y_offset + this._anchor_height,
          x3 = x_offset, y3,
          x4, y4;
        x2 = x1; y3 = y1; x4 = x3; y4 = y2;

        let curve = new createjs.Shape();
        curve.graphics.setStrokeStyle(1).beginStroke("rgba(173,216,230,1)").moveTo(x1, y1).bezierCurveTo(x2, y2, x3, y3, x4, y4);
        stage.addChild(curve);
        stage.setChildIndex(curve, 0);

        y_offset += this._anchor_height;
      }
    }

    return this;
  }
}