import * as Settings from "./../settings";
import {States as ElementStates} from "./ChainElement"

export default class Chain {

  _view;
  _chain;
  _steps;
  _container;

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
    let last_step = this._steps.pop();
    last_step.elem.state = ElementStates.INDEFINITE;
    if(this._steps.length > 0) {
      let elem = this._steps[this._steps.length - 1].elem;
      elem.active = true;
      elem.state = ElementStates.OK;
      elem.onpressmove_popwrap = elem.container.on("pressmove", elem.onpressmove_popwrap);
      this._chain = this._steps[this._steps.length - 1].chain.slice(0);

      if (last_step.shift) {
        this._container.mov(last_step.shift);
        for (let child of this._container.children)
          child.mov(-last_step.shift);
      }
    }
    else
      this._chain = [];

    zog(this._steps);
  }

  _apply(elem, idx) {
    if(this._steps.length > 0) {
      let prev_elem =  this._steps[this._steps.length - 1].elem;
      prev_elem.active = false;
      prev_elem.container.off("pressmove", prev_elem.onpressmove_popwrap);
    }

    let step = {elem:elem};
    if (idx <= this._chain.length) {
      this._chain.splice(idx, this._view.elemLen, ...elem._text);
      elem.container.pos(Settings.BLOCK_WIDTH * idx, 0, this._container);
    }
    else {
      step.shift = Settings.BLOCK_WIDTH * (this._view.elemLen - (idx - this._chain.length - 1));
      this._chain.splice(0, idx - this._chain.length - 1, ...elem._text);
      this._container.mov(-step.shift);
      for (let child of this._container.children)
        child.mov(step.shift);
      elem.container.pos(0, 0, this._container);
    }
    step.chain = this._chain.slice(0);
    this._steps.push(step);
    elem.state = ElementStates.OK;
    elem.onpressmove_popwrap = elem.container.on("pressmove", () => this._pop(), null, true);
  }

  stick(elem) {
    //First element of the chain
    if(this._steps.length === 0) {
      this._container.pos(elem.container.x, elem.container.y);
      this._apply(elem, 0);
      return;
    }

    // Calc distances
    let distances = [];
    for (let i = 0; i <= this._chain.length; i++) {
      let anchor_x = this._container.x + Settings.BLOCK_WIDTH * i;
      let anchor_y = this._container.y + Settings.ELEMENT_HEIGHT / 2;

      distances[i] = dist(anchor_x, anchor_y, elem.container.x, elem.container.y + elem.container.height / 2);
      distances[this._chain.length + 1 + i] = dist(anchor_x, anchor_y, elem.container.x + elem.container.width, elem.container.y + elem.container.height / 2);
    }

    // Find min distance index
    let idx = distances.reduce((min, val, i, arr) => val < arr[min] ? i : min, 0);
    // Check if element fits the chain
    if (distances[idx] <= Settings.STICK_DISTANCE) {
      let fit = true;
      if(idx === this._chain.length) {
        if(this._chain[this._chain.length - 1] !== elem._text[0])
          fit = false;
      }
      else if(idx === this._chain.length + 1) {
        if(this._chain[0] !== elem._text[elem._text.length - 1])
          fit = false;
      }
      else {
        // Right overlap
        if (idx < this._chain.length) {
          let len = idx + this._view.elemLen;
          if (len > this._chain.length)
            len = this._chain.length;
          for (let i = idx; i < len; i++) {
            if (this._chain[i] !== elem._text[i - idx]) {
              fit = false;
              break;
            }
          }
        }
        // Left overlap
        else {
          let real_idx = idx - this._chain.length - 1;
          if (real_idx < this._view.elemLen) {
            for (let i = real_idx - 1; i >= 0; i--) {
              if (this._chain[i] !== elem._text[this._view.elemLen - real_idx + i]) {
                fit = false;
                break;
              }
            }
          }
        }
      }

      // Apply element to the chain
      if (fit)
        this._apply(elem, idx);
    }
  }
}