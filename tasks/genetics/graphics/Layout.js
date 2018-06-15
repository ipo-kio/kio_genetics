import * as Settings from "./../settings";
import Chain from "./Chain"

export default class Layout {

  _view;
  _frame;
  _viewer_width;
  _viewer_height;
  _mask;
  _container;

  constructor(view, width, height) {
    this._view = view;
    this._frame = view.frame;
    this._viewer_width = this._layout_width = width - Settings.MARGIN;
    this._viewer_height = height;

    this._mask = new Rectangle(this._viewer_width, this._viewer_height)
      .pos(Settings.MARGIN, Settings.OPTIONS_HEIGHT + Settings.MARGIN, this._frame.stage);

    this._container = new Container()
      .pos(this._mask.x, this._mask.y, this._frame.stage)
      .setMask(this._mask);

    this._back = new Rectangle(this._layout_width, this._viewer_height, this._frame.lighter)
      .addTo(this._container);

    this._desiredX = this._container.x;
    let damp = new Damp(this._desiredX, .2);
    Ticker.add(() => {
      this._container.x = damp.convert(this._desiredX);
    }, this._frame.stage);

    this._chain = new Chain(view);
    this._chain.container.center(this._container);
    this._chain.container.pos(Settings.MARGIN);
    this.chainDrag = true;

    document.onwheel = e => {
      if (!this._scrollbar)
        return;
      this._scrollbar.currentValue += e.deltaY > 0 ? 40 : -40;
      this._doScroll();
    };
  }

  get container() {
    return this._container;
  }

  set chainDrag(val) {
    if(val)
      this._chain.container.drag({currentTarget: true, localBounds: true});
    else
      this._chain.container.noDrag();
  }

  get width() {
    return this._viewer_width + Settings.MARGIN*2;
  }

  get desiredX() {
    return this._desiredX;
  }

  hitTest(obj) {
    return obj.x > Settings.MARGIN && obj.x < Settings.MARGIN + this._viewer_width &&
      obj.y > Settings.MARGIN && obj.y < Settings.MARGIN + this._viewer_height;
  };

  stick(elem) {
    this._chain.stick(elem);
  }

  rearrangeScroll(width) {
    if(width <= this._layout_width)
      return;

    this._layout_width = width + Settings.MARGIN;
    this._back.widthOnly = this._layout_width;

    // Удаляем старый
    if (this._scrollbar) {
      this._scrollbar.removeFrom(this._frame.stage);
      this._scrollbar.dispose();
      this._scrollbar = null;
    }

    // Не нужен
    if (this._layout_width <= this._viewer_width)
      return;

    // Ресайзим кнопку
    if (!this._button)
      this._button = new Button({
        width: this._viewer_width / this._layout_width * this._viewer_width,
        height: Settings.SCROLL_HEIGHT,
        label: "",
        color: this._frame.tin,
        rollColor: this._frame.grey,
        corner: Settings.SCROLL_HEIGHT * .5
      }).expand();
    else
      this._button.width = this._viewer_width / this._layout_width * this._viewer_width;

    // Создаем новый
    this._scrollbar = new Slider({
      min: 0,
      max: this._layout_width - this._viewer_width,
      step: 0,
      button: this._button,
      barLength: this._viewer_width,
      barWidth: Settings.SCROLL_HEIGHT,
      barColor: this._frame.silver,
      vertical: false,
      inside: true
    })
      .addTo(this._frame.stage)
      .pos(Settings.MARGIN, Settings.MARGIN + this._viewer_height);

    this._scrollbar.on("change", () => this._doScroll());
    this._scrollbar.currentValue = this._scrollbar.max;
    this._doScroll();
  }

  _doScroll() {
    this._desiredX = this._mask.x - this._scrollbar.currentValue;
  }

  serialize() {
    return this._chain.serialize();
  }

  deserialize(json) {
    this._chain.deserialize(json);
  }
}