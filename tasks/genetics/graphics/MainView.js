import Layout from "./Layout";
import ElementsStock from "./ElementsStock";
import {EventDispatcherInterface} from "./EventDispatcherMixin";

export default class MainView extends EventDispatcherInterface {
  constructor(alphabet_power, word_length, anchors_num, view_width, view_height, margin_size = 25, element_height = 20) {
    super();

    this._alphabet_power = alphabet_power;
    this._word_length = word_length;
    this._view_width = view_width;
    this._view_height = view_height;
    this._margin_size = margin_size;
    this._element_height = element_height;

    this._numbers_amount = Math.pow(this._alphabet_power, this._word_length);

    this._elements_stock = new ElementsStock(this);
    this._layout = new Layout(this, view_width - this._elements_stock.width, anchors_num);

    this.add_listener("onmove", evt => this._layout.checkAnchors(evt.source));
  }

  get alphabetPower() {
    return this._alphabet_power;
  }

  get wordLength() {
    return this._word_length;
  }

  get viewWidth() {
    return this._view_width;
  }

  get viewHeight() {
    return this._view_height;
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

  // Draw
  init(stage) {
    let delimiter = new createjs.Shape();
    delimiter.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").moveTo(this._layout.width, 0).lineTo(this._layout.width, this._view_height);
    stage.addChild(delimiter);

    this._layout.init(stage);
    this._elements_stock.init(stage, this._layout.width);

    return this;
  }
}