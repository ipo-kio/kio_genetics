import Layout from "./Layout";
import ElementsStock from "./ElementsStock";
import {States as ElementStates} from "./ChainElement"
import {EventDispatcherInterface} from "./EventDispatcherMixin";

export default class MainView extends EventDispatcherInterface {
  constructor(kio_api, alphabet_power, word_length, anchors_num, view_width, view_height, digit_mode, margin_size = 25, element_height = 20) {
    super();

    this._kio_api = kio_api;
    this._alphabet_power = alphabet_power;
    this._word_length = word_length;
    this._view_width = view_width;
    this._view_height = view_height;
    this._digit_mode = digit_mode;
    this._margin_size = margin_size;
    this._element_height = element_height;

    this._numbers_amount = Math.pow(this._alphabet_power, this._word_length);

    this._elements_stock = new ElementsStock(this);
    this._layout = new Layout(this, view_width - this._elements_stock.width, anchors_num);

    this.add_listener("onmove", evt => this._layout.checkAnchors(evt.source));
    this.add_listener("onanchor", evt => this.checkSolution(evt.source));
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

  get digitMode() {
    return this._digit_mode;
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

  checkSolution() {
    let result = 'Правильно!';
    let elements = this._layout.getItems();
    let used_elements = new Array(this._numbers_amount).fill(0);
    let empty_anchor = false; // Флаг пустого якоря
    for (const element of elements) {
      if (!element)
        empty_anchor = true;
      else {
        if (empty_anchor) {
          element.state = ElementStates.BAD;
          break;
        }
        used_elements[parseInt(element.text, this._alphabet_power)]++;
      }
    }

    let i;
    for (i = 0; i < used_elements.length; i++) {
      if (used_elements[i] === 0) {
        result = "Не все элементы использованы";
        break;
      }
    }
    if (elements[0]) {
      elements[0].state = ElementStates.OK;
      for (let i = 0; i < elements.length - 1 && elements[i + 1]; i++) {
        if (elements[i].text[2] === elements[i + 1].text[0])
          elements[i + 1].state = ElementStates.OK;
        else {
          elements[i + 1].state = ElementStates.BAD;
          result = "Элементы расположены неправильно";
        }
      }
    }

    if (result === "Правильно!") {
      // Пусть пока так будет
      let elements_count = used_elements.reduce((acc, val) => acc + val);
      this._kio_api.submitResult({
        elements: elements_count,
        average: elements_count / (1<<3)
      });
    }

    this._stage.update();
  }

  // Draw
  init(stage) {
    this._stage = stage;
    
    let delimiter = new createjs.Shape();
    delimiter.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)").moveTo(this._layout.width, 0).lineTo(this._layout.width, this._view_height);
    stage.addChild(delimiter);

    this._layout.init(stage);
    this._elements_stock.init(stage, this._layout.width);

    return this;
  }
}