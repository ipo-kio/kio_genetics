import {Event} from "./EventDispatcherMixin";
import ChainElement, {States as ElementStates} from './ChainElement';

const ANCHOR_STICK_RADIUS = 50;

export default class Anchors {
  constructor(view, stage, anchor_size = 2) {
    this._view = view;
    this._stage = stage;
    this._anchor_size = anchor_size;
    this._anchors = [];
  }

  createAnchor(x, y) {
    this._anchors.push(new Anchor(this._anchors.length, x, y));

    let anchor = new createjs.Shape();
    anchor.graphics.beginFill("Black").drawCircle(x, y, this._anchor_size);
    this._stage.addChild(anchor);
  }

  checkAnchors(element) {
    let free_anchors = this._anchors.filter(anchor => anchor.item === null);
    let distances = free_anchors.map(anchor => anchor.dist(element.container.x + element.width / 2, element.container.y + element.height / 2));
    let anchor_index = distances.reduce((min, val, i, arr) => val < arr[min] ? i : min, 0);

    if (distances[anchor_index] <= ANCHOR_STICK_RADIUS) {
      element.anchor = free_anchors[anchor_index];
      this._view.fire(new Event("onanchor", element));
    }
  }

  getItems() {
    return this._anchors.map(val => val.item);
  }

  deserialize(anchor_states) {
    for(let i=0; i<anchor_states.length; i++) {
      if(anchor_states[i] !== null)
        this._view.elements[anchor_states[i]].anchor = this._anchors[i];
    }
    this._view.fire(new Event("onanchor", null));
  }

  checkSolution(element) {
    let elements;
    if(element)
      elements = [element];
    else
      elements = this._view.elements;

    for(element of elements) {
      if(!element.anchor)
        continue;
      let prev = this._anchors[element.anchor.index - 1];
      if (!prev || !prev.item)
        element.state = ElementStates.OK;
      else if (prev.item.text[this._view.wordLength - 1] === element.text[0])
        element.state = ElementStates.OK;
      else
        element.state = ElementStates.BAD;
    }

    let i;
    for (i = 0; i < this._view.elements.length; i++)
      if(!this._view.elements[i].anchor)
        break;
    if(i === this._view.elements.length)
      this._view.submitResult();
  }
}


class Anchor {
  constructor(index, x, y) {
    this._index = index;
    this._x = x;
    this._y = y;
    this._item = null;
  }

  get index() {
    return this._index;
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