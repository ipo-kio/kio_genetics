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
    window.genetics = this; // ONLY FOR TESTS!
    console.log('preferred width in problem initialization', preferred_width);

    this.kioapi = kioapi;
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
    return this._main_view.serialize();
  };

  loadSolution(solution) {
    this._redraw(solution);
  };

  initInterface($domNode) {
    let $notice = $("<p>").text("Поля ввода используются для тестирования и не являются частью интерфейса");

    let evt_handler = () => this._redraw();
    this.$alphabet = $("<input class='number-input'>").change(evt_handler); // Alphabet power
    this.$length = $("<input class='number-input'>").change(evt_handler);   // Word length
    this.$anchors = $("<input class='number-input'>").change(evt_handler);  // Minimum anchors num ('ll be rounded to row ceiling)

    let $canvas = $("<canvas>", { "id": "kio-genetics-canvas" }).css({ border: "1px solid gray", backgroundColor: "white" });
    $domNode.append($notice, this.$alphabet, this.$length, this.$anchors, $canvas);

    this._stage = new createjs.Stage("kio-genetics-canvas");
    this._main_view = new MainView(this.kioapi, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT, TextModes.LETTER);
    this._redraw();
  };


  _redraw(solution) {
    this._stage.removeAllChildren();

    let alphabet_power = +this.$alphabet.val() || 2;
    let word_length = +this.$length.val() || 5;
    let anchors_min = +this.$anchors.val() || Math.pow(alphabet_power, word_length);

    try {
      if(solution)
        this._main_view.init(this._stage, ...JSON.parse(solution));
      else
        this._main_view.init(this._stage, alphabet_power, word_length, anchors_min);
    }
    catch(e) {
      alert(e);
    }

    // Scaling; TODO: resize event
    let $base = $(".kio-base-box");
    let real_width = document.body.clientWidth - parseInt($base.css("marginLeft")) - parseInt($base.css("marginRight"));
    //if(real_width < this._main_view.width) // Только в меньшую сторону
    let scale_factor = real_width/this._main_view.width;
    this._stage.scale = scale_factor;
    this._stage.canvas.width = this._main_view.width * scale_factor;
    this._stage.canvas.height = CANVAS_BASE_HEIGHT * scale_factor;

    // Draw
    this._stage.update();
  }
  
  // ONLY FOR TESTS!
  // Решение текущей задачи через эйлеров путь
  solve() {
   let adjacency_matrix = [];
    for (let i=0; i<this._main_view.alphabetPower; i++)
      adjacency_matrix[i] = Array(this._main_view.alphabetPower).fill(true);

    let eulerian_path = [];
    (function find_path(vertex) {
      for (let i=0; i<adjacency_matrix.length; i++) {
        if (adjacency_matrix[vertex][i]) {
          adjacency_matrix[vertex][i] = false;
          find_path(i);
        }
      }
      eulerian_path.push(vertex);
    })(0);

    //////////////////////////////////////////////////////////////
    console.log(eulerian_path);
    //////////////////////////////////////////////////////////////
    
    // Решение для длины=2
    let solution = [];
    for (let i=0; i<eulerian_path.length-1; i++)
      solution[i] = eulerian_path[i]*this._main_view.alphabetPower + eulerian_path[i+1];
    console.log(solution);
    
    
    //// TODO: Вот тут что-то намутить надо. Преобразовать первичные + сделать concat в цикле N раз
    ////for (let i=1; i<solution.length; i++)
    ////  if (solution[i]%Math.pow(this._main_view.alphabetPower, this._main_view.wordLength-1)>=this._main_view.alphabetPower)
    ////    solution[i] += this._main_view.alphabetPower*parseInt(eulerian_path[i]/Math.pow(this._main_view.alphabetPower, this._main_view.wordLength-1));
    
    let json = JSON.stringify( [this._main_view.alphabetPower, this._main_view.wordLength, this._main_view.anchorsNum, ...solution] );
    //////////////////////////////////////////////////////////////
    console.log(json);
    //////////////////////////////////////////////////////////////
    this.loadSolution(json);
  }
}