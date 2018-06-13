import * as Settings from "./../settings";
import Layout from "./Layout";
import ElementsStock from "./ElementsStock";

export default class MainView {

  _frame;
  _elem_pow;
  _elem_len;
  _stage;
  _layout;
  _stock;

  constructor(frame, power, length) {
    this._frame = frame;
    this._elem_pow = power;
    this._elem_len = length;
    this._elem_num = Math.pow(power, length);
    this._stage = frame.stage;
    //frame.color = "#333";

    this._stock = new ElementsStock(this);
    this._layout = new Layout(this, frame.width - this._stock.width, 300);
    this._stock.init(this._stage, this._layout.width);
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
}