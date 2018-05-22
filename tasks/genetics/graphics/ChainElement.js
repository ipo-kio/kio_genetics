export default class ChainElement {
  constructor(stage, anchors, x, y, width, height, text) {
    this._stage = stage;
    this._width = width;
    this._height = height;
    this._text = text;

    let rect = new createjs.Shape();
    this._rect_cmd = rect.graphics.beginFill("White").beginStroke("Black").command;
    rect.graphics.rect(0, 0, width, height);

    let innerText = new createjs.Text(text, "1em Courier New", "Black");
    innerText.set({
      textAlign: "center",
      textBaseline: "middle",
      x: width / 2,
      y: height / 2
    });

    let block = new createjs.Container();
    block.x = x;
    block.y = y;
    block.addChild(rect, innerText);

    if (anchors) {
      // Как только начали перетаскивать - на его месте появится другой
      let listener = block.on("pressmove", evt => {
        new ChainElement(stage, anchors, x, y, width, height, text);
        block.off("pressmove", listener);
        // Чтобы можно было удалить
        block.on("mousedown", evt => {
          if (evt.nativeEvent.button === 1) { // middle button
            this.anchor = null;
            stage.removeChild(evt.currentTarget);
            stage.update();
          }
        })
      });

      // Перетаскиваем
      block.on("pressmove", evt => {
        this.state = States.INDEFINITE;
        if (this._anchor) {
          this._anchor.item = null;
          this._anchor = null;
        }
        evt.currentTarget.x = evt.stageX - this._width/2;
        evt.currentTarget.y = evt.stageY - this._height/2;
        stage.setChildIndex(evt.currentTarget, stage.numChildren-1);
        stage.update();
      });
      block.on("pressup", evt => {
        if (stage.getChildIndex(evt.currentTarget) !== -1) // Фикс стика при удалении элемента
          anchors.stick(this)
      });
    }

    stage.addChild(block);
    this._container = block;
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