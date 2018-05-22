const ANCHOR_STICK_RADIUS = 50;

export default class Anchors {
    constructor(stage, check_callback, anchor_size = 2) {
      this._stage = stage;
      this._check_callback = check_callback;
      this._anchor_size = anchor_size;
      this._anchors = [];
    }

    createAnchor(x, y) {
      this._anchors.push(new Anchor(this._stage, this._check_callback, x, y, this._anchor_size));
    }

    stick(element) {
      let free_anchors = this._anchors.filter(anchor => anchor.item === null);
      let distances = free_anchors.map(anchor => anchor.dist(element.container.x + element.width/2, element.container.y + element.height/2));
      let anchor_index = distances.reduce((min, val, i, arr) => val < arr[min] ? i : min, 0);

      if(distances[anchor_index] <= ANCHOR_STICK_RADIUS)
        element.anchor = free_anchors[anchor_index];
    }

    getItems() {
      return this._anchors.map(val => val.item);
    }
  }

class Anchor {
  constructor(stage, check_callback, x, y, anchor_size = 2) {
    this._check_callback = check_callback;
    this.x = x;
    this.y = y;
    this._item = null;

    this._anchor = new createjs.Shape();
    this._anchor.graphics.beginFill("Black").drawCircle(x, y, anchor_size);
    stage.addChild(this._anchor);
  }

  get item() {
    return this._item;
  }

  set item(value) {
    this._item = value;
    this._check_callback();
  }

  dist(x, y) {
    return Math.hypot(this.x - x, this.y - y);
  }
}