import * as Settings from "./../settings";
import {States as ElementStates} from "./ChainElement"

export default class Chain {
  constructor(view) {
    this._view = view;
    this._chain = []; // Массив элементов цепи
    this._steps = []; // Шаги
    this._container = new Container(); // Контейнер для элементов цепи
  }

  get container() {
    return this._container;
  }

  _pop() {
    this._steps.pop().elem.state = ElementStates.INDEFINITE;
    if(this._steps.length > 0) {
      let elem = this._steps[this._steps.length - 1].elem;
      elem.active = true;
      elem.state = ElementStates.OK;
      elem._onpressmove_popwrap = elem.container.on("pressmove", elem._onpressmove_popwrap);
      this._chain = this._steps[this._steps.length - 1].chain.slice(0);
    }
    else
      this._chain = [];

    zog(this._steps);
  }

  _apply(elem, idx) {
    if(this._steps.length > 0) {
      let prev_elem =  this._steps[this._steps.length - 1].elem
      prev_elem.active = false;
      prev_elem.container.off("pressmove", prev_elem._onpressmove_popwrap);
    }

    this._chain.splice(idx, this._view.elemLen, ...elem._text);
    this._steps.push( {chain: this._chain.slice(0), elem: elem} );
    elem.state = ElementStates.OK;
    elem.container.pos(Settings.BLOCK_WIDTH * idx, 0, this._container);
    elem._onpressmove_popwrap = elem.container.on("pressmove", () => this._pop(), null, true);

    if(this._container.width + Settings.MARGIN*2 > this._view.layout.container.width)
      this._view.layout.rearrangeScroll(this._view.elemLen * Settings.BLOCK_WIDTH + Settings.MARGIN);
  }

  stick(elem) {
    //First element of the chain
    if(this._steps.length === 0) {
      this._apply(elem, 0);
      return;
    }

    // Calc distances
    let distances = [];
    for (let i = 0; i <= this._chain.length; i++)
      distances[i] = dist(this._container.x + Settings.BLOCK_WIDTH * i, this._container.y + Settings.ELEMENT_HEIGHT / 2,
        elem.container.x, elem.container.y + elem.container.height / 2);

    // Find min distance index
    let idx = distances.reduce((min, val, i, arr) => val < arr[min] ? i : min, 0);
    // Check if element fits the chain
    if (distances[idx] <= Settings.STICK_DISTANCE) {
      let fit = true;
      if(idx === this._chain.length) {
        if(this._chain[this._chain.length - 1] !== elem._text[0])
          fit = false;
      }
      else {
        let len = idx+this._view.elemLen > this._chain.length ? this._chain.length : idx+this._view.elemLen;
        for (let i = idx; i < len; i++) {
          if (this._chain[i] !== elem._text[i - idx]) {
            fit = false;
            break;
          }
        }
      }

      // Apply element to the chain
      if (fit)
        this._apply(elem, idx);
    }
  }
}