import {Event} from "./EventDispatcherMixin";

export default class ChainElement {
  constructor(x, y, value, view) {
    let convertWithWidthFill = num => {
      let str = num.toString(view.alphabetPower);
      str = "0".repeat(view.wordLength - str.length) + str;
      return view.textMode === TextModes.DIGIT ? str :
        str.split('').map(val => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(parseInt(val, view.alphabetPower))).join('');
    };

    this._x = x;
    this._y = y;
    this._id = value;
    this._view = view;
    this._text = convertWithWidthFill(value);
    this._width  = view.elementWidth;
    this._height = view.elementHeight;
    this._params = arguments; // Для репликации
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get id() {
    return this._id;
  }

  get text() {
    return this._text;
  }

  get container() {
    return this._container;
  }

  get anchor() {
    return this._anchor;
  }

  set anchor(value) {
    if(this._anchor)
      this._anchor.item = null;
    this._anchor = value;
    if (this._anchor) {
      this._anchor.item = this;
      this._container.x = this._anchor.x - this._width / 2;
      this._container.y = this._anchor.y - this._height / 2;
      this._stage.update();
    }
  }

  set state(value) {
    this._rect_cmd.style = value;
    this._stage.update();
  }

  // Draw
  init(stage) {
    this._stage = stage;
    let rect = new createjs.Shape();
    this._rect_cmd = rect.graphics.beginFill("White").beginStroke("Black").command;
    rect.graphics.rect(0, 0, this._width, this._height);

    let innerText = new createjs.Text(this._text, "1em Courier New", "Black");
    innerText.set({
      textAlign: "center",
      textBaseline: "middle",
      x: this._width / 2,
      y: this._height / 2
    });

    this._container = new createjs.Container();
    this._container.set({
      x: this._x,
      y: this._y
    });
    this._container.addChild(rect, innerText);

    // Перетаскиваем
    this._container.on("pressmove", evt => {
      this.state = States.INDEFINITE;
      if (this._anchor) {
        this._anchor.item = null;
        this._anchor = null;
      }
      evt.currentTarget.x = evt.stageX / stage.scale - this._width / 2;
      evt.currentTarget.y = evt.stageY / stage.scale - this._height / 2;
      stage.setChildIndex(evt.currentTarget, stage.numChildren-1);
      stage.update();
    });

    // Как только начали перетаскивать - на его месте появится другой // TODO: лучше придумать что-нибудь другое
    let listener = this._container.on("pressmove", evt => {
      new ChainElement(...this._params).init(stage);
      evt.currentTarget.off("pressmove", listener);
      // Чтобы можно было удалить
      evt.currentTarget.on("mousedown", evt => {
        if (evt.nativeEvent.button === 1) { // middle button
          this.anchor = null;
          stage.removeChild(evt.currentTarget);
          stage.update();
        }
      })
    });

    // Привязывание к якорям
    this._container.on("pressup", evt => {
      if (this._stage.getChildIndex(evt.currentTarget) !== -1) // Фикс стика при удалении элемента
        this._view.fire(new Event("onmove", this));
    });

    stage.addChild(this._container);
  }
}

// Состояния элемента
export const States = Object.freeze({
  INDEFINITE: "Black",
  OK: "Green",
  BAD: "Red"
});

// Режим отрисовки слова
export const TextModes = Object.freeze({
  LETTER: Symbol("letter"),
  DIGIT: Symbol("digit")
});