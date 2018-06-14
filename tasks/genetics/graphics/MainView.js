import * as Settings from "./../settings";
import Layout from "./Layout";
import ElementsStock from "./ElementsStock";

export default class MainView {

  _kio_api;
  _frame;
  _elem_pow = Settings.DEFAULT_POW;
  _elem_len = Settings.DEFAULT_LEN;
  _layout;
  _stock;
  _elements;
  _init_solution;

  constructor(kio_api) {
    this._kio_api = kio_api;
  }

  init(frame, power, length, solution) {
    if (solution || !this._init_solution) {
      this._elem_pow = power;
      this._elem_len = length;
      this._elem_num = Math.pow(power, length);
      this._init_solution = solution;
    }

    if (frame)
      this._frame = frame;

    if (this._frame) {
        this._redraw();
        if (this._init_solution) {
          this._layout.deserialize(this._init_solution);
          this._init_solution = false;
        }
      }
  }

  _redraw() {
    this._frame.stage.removeAllChildren();
    this._elements = [];
    this._stock = new ElementsStock(this);
    this._layout = new Layout(this, this._frame.width - this._stock.width, Settings.LAYOUT_HEIGHT);
    this._stock.init(this._layout.width);
  }

  get frame() {
    return this._frame;
  }

  get elemPow() {
    return this._elem_pow;
  }

  get elemLen() {
    return this._elem_len;
  }

  get elemNum() {
    return this._elem_num;
  }

  get layout() {
    return this._layout;
  }

  get elements() {
    return this._elements;
  }

  serialize() {
    return JSON.stringify(this._layout ? this._layout.serialize() : []);
  }

  submitResult(len) {
    this._kio_api.submitResult({
      elements_num: this._elem_num,
      length: len
    });
  }
}