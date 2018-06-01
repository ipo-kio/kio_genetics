import './genetics.scss'
import MainView from "./graphics/MainView"
import {TextModes} from "./graphics/ChainElement";

const CANVAS_BASE_HEIGHT = 300;
const CANVAS_BASE_WIDTH = 1600;

export class Genetics {

  constructor(settings) {
    this.settings = settings;
  }

  id() {
    return "genetics";
  };

  initialize(domNode, kioapi, preferred_width) {
    console.log('preferred width in problem initialization', preferred_width);

    this.kioapi = kioapi;
    window.kioapi = kioapi;
    this.domNode = domNode;

    console.log('problem level is', this.settings.level);

    const $domNode = $(this.domNode);
    this.initInterface($domNode);
  };

  parameters() {
    return [
      {
        name: "elements",
        title: "Количество цепочек",
        ordering: 'minimize',
        view: val => val || 0
      },
      {
        name: "average",
        title: "Среднее кол-во каждой цепочки",
        ordering: 'minimize',
        view: val => val ? val.toFixed(2) : 0
      }
    ];
  };

  solution() {
    /*const x = this.process == null ? 0 : this.process.x;
    return {x: x};*/
    return 0;
  };

  loadSolution(solution) {
    // Пока нет сериализации
    this._redraw();
    /*if (!solution || !solution.x)
      return;
    let x = solution.x;

    //проверка, что если при загрузке решения возникает ошибка, то kioapi пересоздаст задачу
    if (x === "error")
      x = x.error.error; //must produce exception

    if (x <= 0 || x >= 1000)
      return;
    this.$input.val('' + x).change();*/
  };

  initInterface($domNode) {
    let evt_handler = () => this._redraw();
    this.$alphabet = $("<input class='number-input' size='3'>").change(evt_handler); // Alphabet power
    this.$length = $("<input class='number-input' size='3'>").change(evt_handler);   // Word length
    this.$anchors = $("<input class='number-input' size='3'>").change(evt_handler);  // Minimum anchors num ('ll be rounded to row ceiling)

    var $canvas = $("<canvas>", { "id": "kio-genetics-canvas" }).css({ border: "1px solid gray", backgroundColor: "white" });
    $domNode.append(this.$alphabet, this.$length, this.$anchors, $canvas);

    this._stage = new createjs.Stage("kio-genetics-canvas");
    this._main_view = new MainView(this.kioapi, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT, TextModes.LETTER);
    this._redraw();
  };


  _redraw(json) {
    this._stage.removeAllChildren();

    let alphabet_power = +this.$alphabet.val() || 2;
    let word_length = +this.$length.val() || 5;
    let anchors_min = +this.$anchors.val() || Math.pow(alphabet_power, word_length);

    //try {
      if(json)
        this._main_view.init(this._stage, ...JSON.parse(json));
      else
        this._main_view.init(this._stage, alphabet_power, word_length, anchors_min);
   // }
    //catch(e) {
    //  alert(e);
    //}

    // Scaling; TODO: resize event
    let real_width = document.body.clientWidth - 6*2; // kio margin (temp)
    let scale_factor = 1;
    if(real_width < this._main_view.width)
      scale_factor = real_width/this._main_view.width;
    this._stage.scale = scale_factor;
    this._stage.canvas.width = this._main_view.width * scale_factor;
    this._stage.canvas.height = CANVAS_BASE_HEIGHT * scale_factor;

    // Draw
    this._stage.update();
  }
}