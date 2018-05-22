import ChainElement, {States as ElementStates} from "./graphics/ChainElement";
import Anchors from "./graphics/Anchors";

const canvas_width = 900,
  canvas_height = 300,
  element_width = 40,
  element_height = 20;

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
    this.drawGraphics();
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
      $("<canvas>", { "id": "canvas" }).prop({
        width: canvas_width,
        height: canvas_height
      });//.css({ border: "1px solid gray", backgroundColor: "white" });
    $domNode.append($canvas);

    this.drawGraphics();
  };


  drawGraphics() {
    let stage = this._stage = new createjs.Stage("canvas");
    /*createjs.Ticker.addEventListener("tick", () => {
      let canvas = document.getElementById("canvas");
      if (canvas.width !== window.innerWidth) {
        stage.scaleX = stage.scaleY = canvas.width/window.innerWidth;
        canvas.width = window.innerWidth;
        this.drawGraphics();
      }
    });*/

    // Создаем точки для привязывания
    let anchors = new Anchors(stage, () => {
      // Проверка на правильность
      let elements = anchors.getItems();
      let used_elements = new Array(1 << 3).fill(0);
      let empty_anchor = false; // Флаг пустого якоря
      for (const element of elements) {
        if (!element)
          empty_anchor = true;
        else {
          if (empty_anchor) { // Пропущен элемент в цепочке
            element.state = ElementStates.BAD;
            break;
          }
          used_elements[parseInt(element.text, 2)]++;
        }
      }
      infoStr.text = "Правильно!";
      let i;
      for (i = 0; i < used_elements.length; i++) {
        if (used_elements[i] === 0) {
          infoStr.text = "Не все элементы использованы";
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
            infoStr.text = "Элементы расположены неправильно";
          }
        }
      }

      if (infoStr.text === "Правильно!") {
        // Пусть пока так будет
        let elements_count = used_elements.reduce((acc, val) => acc + val);
        this.kioapi.submitResult({
          elements: elements_count,
          average: elements_count / (1<<3)
        });
      }
      stage.update();
    });
    for (let i=0; i < 1<<4; i++)
      anchors.createAnchor(element_width*2 + i*element_width*1.1,
        canvas_height/2);

    // Создаем элементы цепочки
    for (let i = 0; i < 1 << 3; i++)
      new ChainElement(stage,
        anchors,
        canvas_width - element_width * 2,
        (canvas_height - (1 << 3) * element_height * 1.5 + element_height * 0.5) / 2 + i * element_height * 1.5,
        element_width,
        element_height,
        this.intToBin(i));

    // Строка состояния
    let infoStr = new createjs.Text(null, "1em Courier New", "Black");
    infoStr.set({
      textAlign: "center",
      textBaseline: "middle",
      x: canvas_width / 2,
      y: 220
    });
    stage.addChild(infoStr);

    /*// Кнопка ресета (пока так :) )
    let resetButton = new ChainElement(stage, null, 20, 250, 100, 30, "Очистить");
    resetButton.container.on("click", evt => {
      stage.removeAllChildren();
      drawGraphics();
    });*/

    // Рисуем
    stage.update();
  }

  intToBin(num) {
    let bin = num.toString(2);
    return "0".repeat(3-bin.length) + bin;
  }
}