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
    this._stage.removeAllChildren();
    this.draw();
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
    var $canvas =
      $("<canvas>", { "id": "kio-genetics-canvas" }).css({ border: "1px solid gray", backgroundColor: "white" });
    $domNode.append($canvas);

    this._stage = new createjs.Stage("kio-genetics-canvas");
    this.draw();
  };


  draw() {

    let main_view;
    try {
      main_view = new MainView(this.kioapi, 2, 3, 2<<4, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT, TextModes.LETTER).init(this._stage);
    }
    catch(e) {
      alert(e);
    }

    // Scaling; TODO: resize event
    let real_width = document.body.clientWidth - 6*2; // kio margin (temp)
    let scale_factor = 1;
    if(real_width < main_view.width)
      scale_factor = real_width/main_view.width;
    this._stage.scale = scale_factor;
    this._stage.canvas.width = main_view.width * scale_factor;
    this._stage.canvas.height = CANVAS_BASE_HEIGHT * scale_factor;

    // Draw
    this._stage.update();
  }
}