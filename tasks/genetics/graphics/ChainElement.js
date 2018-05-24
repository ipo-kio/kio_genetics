import {Event} from "./EventDispatcherMixin";

export default class ChainElement {
  constructor(x, y, value, layout, digit_mode, height) {
    let convertWithWidthFill = num => {
      let str = num.toString(layout.alphabetPower);
      str = "0".repeat(layout.wordLength - str.length) + str;
      return digit_mode ? str :
        str.split('').map(val => "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(parseInt(val, layout.alphabetPower))).join('');
    };

    this._x = x;
    this._y = y;
    this._layout = layout;
    this._text = convertWithWidthFill(value);
    this._width  = this._layout.wordWidth;
    this._height = height;
    this._params = arguments; // Для репликации
  }

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
      evt.currentTarget.x = evt.stageX - this._width/2;
      evt.currentTarget.y = evt.stageY - this._height/2;
      this._stage.setChildIndex(evt.currentTarget, this._stage.numChildren-1);
      this._stage.update();
    });

    // Как только начали перетаскивать - на его месте появится другой // TODO: лучше придумать что-нибудь другое
    let listener = this._container.on("pressmove", evt => {
      new ChainElement(...this._params).init(this._stage);
      evt.currentTarget.off("pressmove", listener);
      // Чтобы можно было удалить
      evt.currentTarget.on("mousedown", evt => {
        if (evt.nativeEvent.button === 1) { // middle button
          this.anchor = null;
          this._stage.removeChild(evt.currentTarget);
          this._stage.update();
        }
      })
    });

    // Привязывание к якорям
    this._container.on("pressup", evt => {
       if (this._stage.getChildIndex(evt.currentTarget) !== -1) // Фикс стика при удалении элемента
         this._layout.fire(new Event("anchor", this));
    });

    this._stage.addChild(this._container);
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
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
}

// Состояния элемента
export const States = Object.freeze({
  INDEFINITE: "Black",
  OK: "Green",
  BAD: "Red"
});