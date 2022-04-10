// const { link } = require("fs");

game = class{
  layers = {
    ground: [
      [219,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,195],
    ],

    // ground: ocnova(this.layers.ground2)
  }

  // размер карты
  grid = {
    width:  0,
    height: 0,
  };

  // размер тайла
  tile = {
    width:  16,
    height: 16,
  };

  // инициализация и запуск игры
  constructor() {
    console.log('start: conatructor')

    this.layers.ground = ocnova()

    console.log({labirint: this.layers.ground})

    const width = 5; // Math.floor(window.innerWidth / this.tile.width);
    const height = 5; // Math.floor(window.innerHeight / this.tile.height);

    this.grid = {
      width: width,
      height: height,
    }

    // задаём размер и цвет фона
    Crafty.init(width * this.tile.width, height * this.tile.height);
    Crafty.background("rgb(0, 0, 0)");

    this.screenLoad();
    Crafty.scene("main", this.screenMain.bind(this));
  }

  positionX(x) {
    return this.tile.width * x;
  }

  positionY(y) {
    return this.tile.height * y;
  }

  // сцена загрузки игры
  screenLoad() {
    const width = this.grid.width * this.tile.width;
    const height = this.grid.height * this.tile.height;

    // инициализируем спрайты
    const assets = {
      sprites: {
        "img/grass_tiles.png": {
          tile: 16,
          tileh: 16,
          map: {
            grass:    [0,  0],
            grass1:   [1,  0],
            grass2:   [2,  0],
            flower1:  [1,  1],
            flower2:  [2,  1],
            flower3:  [1,  2],
            flower4:  [2,  2],
            flower5:  [1,  3],
            flower6:  [2,  3],
            block1:   [11, 7],
            block2:   [6,  16],
            water_tl: [0,  7],
            water_t:  [1,  4],
            water_tr: [1,  7],
            water_l:  [0,  5],
            water_r:  [2,  5],
            water_bl: [0,  8],
            water_b:  [1,  6],
            water_br: [1,  8],
            home:     [3, 18]
          },
        },
        "img/character.png": {
          tile: 16,
          tileh: 16,
          map: {
            player: [0, 0],
          },
        },
      }
    };

    for (var y = 0; y < 21; y++) {
      for (var x = 0; x < 12; x++) {
        assets["sprites"]["img/grass_tiles.png"]["map"]["sprite" + (x + (y * 12) + 1)] = [x, y]
      }
    }

    // console.log(assets);

    Crafty.scene("loading", function() {
      // когда загрузка спрайтов завершится, запускаем главную сцену игры
      Crafty.load(assets, function() {
        Crafty.scene("main");
      });

      // рисуем чёрный фон и текст в центре
      Crafty.background("#000");
      Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: (width - 100) / 2, y: (height - 20) / 2})
        .text("Загрузка")
        .css({"text-align": "center"});
    });

    // сразу запустим сцену загрузки
    Crafty.scene("loading");
  }

  // генерируем новый мир
  generateWorld() {
    for (var x = 0; x < this.grid.width; x++) {
      for (var y = 0; y < this.grid.height; y++) {
        if (this.layers.ground[y][x] == -219 || this.layers.ground[y][x] == -195) {
          this.layers.ground[y][x] = Math.abs(this.layers.ground[y][x])
        }
        const tile = "sprite" + this.layers.ground[y][x];
        Crafty.e("2D, Canvas, " + tile).attr({x: this.positionX(x), y: this.positionY(y), z: 0});
      }
    }
  }

  // главный экран игры
  screenMain() {
    this.generateWorld();  
    }
  }

  function ocnova() {
    alert('Start ocnova?')
    console.log('start: ocnova')
    var labirint = [
      [-219, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 62, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, -195]
    ]
    console.log({labirint: labirint})
    
    var y, x

    for (var i = 0; i < labirint.length; i++) {
      for (var j = 0; j <labirint[i].length; j++) {
        if (labirint[i][j] == -195) {
          y = i
          x = j
        }
      }
    }

    console.log({y: y, x: x})

    var solve = false

    while (!solve) {
      for (var i = 0; i < labirint.length; i++) {
        for (var j = 0; j < labirint[i].length; j++) {
          var ran = Math.random()
          var forran = 0.3
          var res = 1

          if (labirint[i][j] == -219) {
            res = -219
          }
          if (labirint[i][j] == -195) {
            res = -195
          }
          if (labirint[i][j] == 1) {
            if (ran < forran) {
              res = -62
            }
          }

          labirint[i][j] = res
        }
      }
    
      while (labirint[y][x] == -195) {
        console.log('start: while (labirint[i][j] = -195)')
        var found = false
        var iscomoe = 0
        for (var i = 0; i < labirint.length; i++) {
          for (var j = 0; i < labirint[i].length; j++) {
            iscomoe++
            if (labirint[i][j] == iscomoe) {
              if (i > 0 && (labirint[i - 1][j] == iscomoe || labirint[i - 1][j] == -195)) {
                labirint[i - 1][j] = iscomoe + 1
                found = true
              }
              if (i < labirint.length - 1 && (labirint[i + 1][j] == iscomoe || labirint[i + 1][j] == -195)) {
                labirint[i + 1][j] = iscomoe + 1
                found = true
              }
              if (j > 0 && (labirint[i][j - 1] == iscomoe || labirint[i][j - 1] == -195)) {
                labirint[i][j - 1] = iscomoe + 1
                found = true
              }
              if (j < labirint[i].length - 1 && (labirint[i][j + 1] == iscomoe || labirint[i][j + 1] == -195)) {
                labirint[i][j + 1] = iscomoe + 1
                found = true
              }
            }

            if (iscomoe > 1000) {
              labirint[y][x] = -194
              console.log('iscomoe > 1000')
              break
            }
          }
        }

      }
      solve = true

    for (var i = 0; i < labirint.length; i++) {
      for (var j = 0; j < labirint[i].length; j++) {
        labirint[i][j] = Math.abs(labirint[i][j])
      }
    }
    return(labirint)
  }
}