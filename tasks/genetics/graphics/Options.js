import * as Settings from "./../settings";
import {TextModes} from "./ChainElement";

export default class Options {

  _container;
  _len;
  _pow;

  constructor(view, width, combs) {
    this._container = new Container(width, Settings.OPTIONS_HEIGHT).pos(Settings.MARGIN, Settings.MARGIN/2, view.frame.stage);
    let pow_container = new Container().pos(0, 0, this._container);
    let len_container = new Container().pos(Settings.OPTIONS_STEPPERS_SHIFT, 0, this._container);

    let pow_onchange = () => {
      if(pow_stepper.currentValue === this._pow)
        return;
      this._pow = pow_stepper.currentValue;

      len_stepper.max = 2 + combs[pow_stepper.selectedIndex];
      if (len_stepper.currentValue > len_stepper.max)
        this._len = len_stepper.currentValue = len_stepper.max;
      else
        len_stepper.currentValue = len_stepper.currentValue; // fixes shadow bug

      view.init(null, this._pow, this._len);
    };

    let len_onchange = () => {
      if(len_stepper.currentValue === this._len)
        return;
      this._len = len_stepper.currentValue;
      view.init(null, this._pow, this._len);
    };

    let pow_stepper = new Stepper({
      stepperType: "number",
      min: 2,
      max: combs.length,
      keyEnabled: false,
      keyArrows: false
    });
    pow_stepper.on("change", pow_onchange);
    this._pow = pow_stepper.currentValue = view.elemPow;

    let len_stepper = new Stepper({
      stepperType: "number",
      min: 2,
      max: 2 + combs[pow_stepper.selectedIndex],
      keyEnabled: false,
      keyArrows: false
    });
    len_stepper.on("change", len_onchange);
    this._len = len_stepper.currentValue = view.elemLen;

    let pow_label = new Label({
      text: "Кол-во оснований",
      size:14,
      font:"Arial",
      color:"black"
    });

    let len_label = new Label({
      text: "Длина элементов",
      size:14,
      font:"Arial",
      color:"black"
    });

    pow_label.center(pow_container);
    len_label.center(len_container);
    pow_stepper.scaleTo(this._container, 100, 50).center(pow_container).mov(0, Settings.OPTIONS_HEIGHT/2);
    len_stepper.scaleTo(this._container, 100, 50).center(len_container).mov(0, Settings.OPTIONS_HEIGHT/2);
  }

  get container() {
    return this._container;
  }
}
