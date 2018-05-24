import {EventDispatcherInterface} from "./EventDispatcherMixin";
import Anchors from "./Anchors";
import {ELEMENT_HEIGHT} from "./ElementsStock";

export const MARGIN_SIZE = 30;

export default class Layout extends EventDispatcherInterface {
  constructor(stage, alphabet_power, word_length, anchors_num) {
    super();
    this._alphabet_power = alphabet_power;
    this._word_length = word_length;
    this._anchors_num = anchors_num;
  }

  init(stage) {
    this._stage = stage;

    // Разделитель
    let delimiter = new createjs.Shape();
    delimiter.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").moveTo(this.width, 0).lineTo(this.width, this._stage.canvas.height / this._stage.scale);
    this._stage.addChild(delimiter);

    // Якори
    let x = MARGIN_SIZE + this.wordWidth * 0.55;
    let anchors_in_row = this._stage.canvas.height / this._stage.scale
    this._anchors = new Anchors(this._stage);
    for(let i=0; i<this._anchors_num; i++) {
      this._anchors.createAnchor(MARGIN_SIZE + this.wordWidth * 0.55 + i * this.wordWidth * 1.1, this._stage.canvas.height / this._stage.scale / 2);
    }
    this.add_listener("anchor", evt => this._anchors.checkAnchors(evt.source));

    return this;
  }

  get width() {
    return MARGIN_SIZE*2 + this._anchors_num*this.wordWidth*1.1;
  }

  get alphabetPower() {
    return this._alphabet_power;
  }

  get wordLength() {
    return this._word_length;
  }

  get wordWidth() {
    return this.wordLength * 11; // TODO: calc text width
  }
}