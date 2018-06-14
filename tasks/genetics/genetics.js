import './genetics.scss'
import MainView from "./graphics/MainView"

export class Genetics {
  constructor(settings) {
    this.settings = settings;
  }

  id() {
    return "genetics";
  }

  initialize(domNode, kioapi, preferred_width) {
    window.kioapi = kioapi; // ONLY FOR TESTS!
    window.genetics = this; // ONLY FOR TESTS!
    console.log('preferred width in problem initialization', preferred_width);

    this.kioapi = kioapi;
    this.domNode = domNode;

    console.log('problem level is', this.settings.level);

    const $domNode = $(this.domNode);
    this.initInterface($domNode);
  }

  parameters() {
    return [
      {
        name: "elements",
        title: "Количество цепочек",
        ordering: 'maximize',
        view: val => val || 0
      }/*, не актуально - задача поменялась
      {
        name: "average",
        title: "Среднее кол-во каждой цепочки",
        ordering: 'minimize',
        view: val => val ? val.toFixed(2) : 0
      }*/
    ];
  }

  solution() {
      return JSON.stringify({
        settings: { pow: this._main_view.elemPow, len: this._main_view.elemLen },
        steps: this._main_view.serialize()
      });
  }

  loadSolution(solution) {
    let {settings: {pow, len}, steps} = JSON.parse(solution);
    if (pow && len && steps)
      this._try_init(null, pow, len, steps);
  }

  initInterface($domNode) {
    this._main_view = new MainView();

    let onchange = () => this._try_init(null, power, len);

    let $notice = $("<p>").text("Поля ввода используются для тестирования и не являются частью интерфейса");
    this.$alphabet = $("<input class='number-input'>").change(onchange); // Alphabet power
    this.$length = $("<input class='number-input'>").change(onchange);   // Word length
    let $holder = $("<div id='kio-genetics-holder'>");
    $domNode.append($notice, this.$alphabet, this.$length, $holder);

    let power = +this.$alphabet.val() || 2;
    let len = +this.$length.val() || 5;

    this._frame = new Frame("kio-genetics-holder");
    this._frame.on("ready", () => {
      OPTIMIZE = true;
      Ticker.update = true;
      this._try_init(this._frame, power, len);
    });
    /*this._frame.on("resize", () => {
      if(this._main_view)
        this._main_view.resize();
      this._frame.stage.update();
    });*/
  }

  _try_init() {
    try {
      this._main_view.init(...Array.from(arguments));
    }
    catch(e) {
      console.trace();
      alert(e);
    }

   /* // Scaling; TODO: resize event
    let $base = $(".kio-base-box");
    let real_width = document.body.clientWidth - parseInt($base.css("marginLeft")) - parseInt($base.css("marginRight"));
    let scale_factor = real_width/this._main_view.width;
    this._stage.scale = scale_factor;
    this._stage.canvas.width = this._main_view.width * scale_factor;
    this._stage.canvas.height = CANVAS_BASE_HEIGHT * scale_factor;

    // Draw
    this._stage.update();*/
  }
  
  // ONLY FOR TESTS!
  // Решение текущей задачи через Эйлеров путь
  /*solve() {
    let power = this._main_view.alphabetPower;
    let length = this._main_view.wordLength;

   let adjacency_matrix = [];
    for (let i=0; i<power; i++)
      adjacency_matrix[i] = Array(power).fill(true);

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
    let general_solution = [];
    for (let i=0; i<eulerian_path.length-1; i++)
      general_solution[i] = eulerian_path[i]*power + eulerian_path[i+1];
    console.log(general_solution);

    // Подгонка в зависимости от длины слова
    let adjust_power = Math.pow(power, length-1);
    for (let i=1; i<general_solution.length; i++)
      general_solution[i] += Math.floor(general_solution[i]/power)*(adjust_power - power);

    // Т.к. наше решение - Эйлеров цикл, мы можем задействовать все остальные слова и получить полное решение
    let solution = general_solution.slice(0);
    adjust_power = Math.pow(power, length-2);
    for (let i=1; i<adjust_power; i++)
      solution = solution.concat(general_solution.map(vertex => vertex+i*power));

    let json = JSON.stringify( [this._main_view.alphabetPower, this._main_view.wordLength, ...solution] );
    //////////////////////////////////////////////////////////////
    console.log(json);
    //////////////////////////////////////////////////////////////
    this.loadSolution(json);
  }*/
}