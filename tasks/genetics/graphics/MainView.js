import Layout from "./Layout";
import ElementsStock from "./ElementsStock";
import {States as ElementStates, TextModes} from "./ChainElement"
import {EventDispatcherInterface} from "./EventDispatcherMixin";

export default class MainView extends EventDispatcherInterface {

  _kio_api;
  _view_width;
  _view_height;
  _text_mode;
  _margin_size;
  _element_height;

  constructor(kio_api, view_width, view_height, text_mode, margin_size = 25, element_height = 20) {
    super();

    this._kio_api = kio_api;
    this._view_width = view_width;
    this._view_height = view_height;
    this._text_mode = text_mode;
    this._margin_size = margin_size;
    this._element_height = element_height;

    this.add_listener("onmove", (evt) => this._layout.checkAnchors(evt.source));
    this.add_listener("onanchor", (evt) => this._checkSolution(evt.source));
  }

  get alphabetPower() {
    return this._alphabet_power;
  }

  get wordLength() {
    return this._word_length;
  }
  
  get anchorsNum() {
    return this._anchors_num;
  }

  get viewWidth() {
    return this._view_width;
  }

  get viewHeight() {
    return this._view_height;
  }

  get textMode() {
    return this._text_mode;
  }

  get margin() {
    return this._margin_size;
  }

  get elementHeight() {
    return this._element_height;
  }

  get elementWidth() {
    return this.wordLength * 11; // TODO: calc text width
  }

  get numbersAmount() {
    return this._numbers_amount;
  }

  get width() {
    return this._layout.width + this._elements_stock.width;
  }

  get elements() {
    return this._elements;
  }

  _checkSolution(element) {
    this._layout.checkSolution(element);
    this._stage.update();
  }

  serialize() {
    let items = this._layout.getItems();
    let i;
    for (i = items.length-1; i >= 0; i--)
      if (items[i])
        break;
    items.splice(i+1, items.length-1-i);
    return JSON.stringify( [this._alphabet_power, this._word_length, ...items.map(val => val && val.id)] );
  }

  submitResult() {
    this._kio_api.submitResult({
      elements: this._numbers_amount
    });
  }

  _stage;
  _alphabet_power;
  _word_length;
  _numbers_amount;
  _elements;
  _elements_stock;
  _layout;

  // Draw
  init(stage, alphabet_power, word_length, ...anchor_states) {
    this._stage = stage;
    this._alphabet_power = alphabet_power;
    this._word_length = word_length;

    this._numbers_amount = Math.pow(this._alphabet_power, this._word_length);

    this._elements = [];
    this._elements_stock = new ElementsStock(this);
    this._layout = new Layout(this, this._view_width - this._elements_stock.width);

    let delimiter = new createjs.Shape();
    delimiter.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").moveTo(this._layout.width, 0).lineTo(this._layout.width, this._view_height);
    stage.addChild(delimiter);

    this._layout.init(stage);
    this._elements_stock.init(stage, this._layout.width);

    if(anchor_states)
      this._layout.deserialize(anchor_states);

    return this;
  }
}