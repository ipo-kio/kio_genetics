const ANCHOR_STICK_RADIUS = 50;

export default class Anchors {
  constructor(stage, anchor_size = 2) {
    this._stage = stage;
    this._anchor_size = anchor_size;
    this._anchors = [];
  }

  createAnchor(x, y) {
    this._anchors.push(new Anchor(x, y));

    let anchor = new createjs.Shape();
    anchor.graphics.beginFill("Black").drawCircle(x, y, this._anchor_size);
    this._stage.addChild(anchor);
  }

  checkAnchors(element) {
    let free_anchors = this._anchors.filter(anchor => anchor.item === null);
    let distances = free_anchors.map(anchor => anchor.dist(element.container.x + element.width / 2, element.container.y + element.height / 2));
    let anchor_index = distances.reduce((min, val, i, arr) => val < arr[min] ? i : min, 0);

    if (distances[anchor_index] <= ANCHOR_STICK_RADIUS)
      element.anchor = free_anchors[anchor_index];
  }

  getItems() {
    return this._anchors.map(val => val.item);
  }
}

class Anchor {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._item = null;
  }

  get item() {
    return this._item;
  }

  set item(value) {
    this._item = value;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  dist(x, y) {
    return Math.hypot(this._x - x, this._y - y);
  }
}