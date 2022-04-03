Game = class{
  // размер карты
  grid = {
    width:  40,
    height: 30,
  };

  // размер тайла
  tile = {
    width:  16,
    height: 16,
  };

  // игрок
  player;

  // инициализация и запуск игры
  constructor() {
    const width = Math.floor(window.innerWidth / this.tile.width);
    const height = Math.floor(window.innerHeight / this.tile.height);

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
    let x, y;

    for (x = 0; x < this.grid.width; x++) {
      for (y = 0; y < this.grid.height; y++) {
        Crafty.e("2D, Canvas, grass").attr({x: this.positionX(x), y: this.positionY(y), z: 0});

        // рисуем разные элементы (только внутри границы)
        if (x > 0 && x < this.grid.width - 1 && y > 0 && y < this.grid.height - 1) {
          // вероятность 1/10 нарисовать траву
          if (Crafty.math.randomInt(0, 10) > 9) {
            const grassType = Crafty.math.randomInt(1, 2);
            Crafty.e("2D, Canvas, grass" + grassType).attr({x: this.positionX(x), y: this.positionY(y), z: 0});
          }
          // вероятность 1/20 нарисовать цветок
          if (Crafty.math.randomInt(0, 20) > 19) {
            const flowerType = Crafty.math.randomInt(1, 6);
            Crafty.e("2D, Canvas, flower" + flowerType).attr({x: this.positionX(x), y: this.positionY(y), z: 0});
          }

          // вероятность 1/50 нарисовать дерево
          if (Crafty.math.randomInt(0, 50) > 49) {
            const blockType = Crafty.math.randomInt(1, 2);
            Crafty.e("2D, DOM, solid, block" + blockType).attr({x: this.positionX(x), y: this.positionY(y), z: 2});
          }
        }
      }
    }

    // рисуем границы карты водой
    for (x = 1; x < this.grid.width - 1; x++) {
      Crafty.e("2D, Canvas, water_b, solid").attr({x: this.positionX(x), y: 0, z: 0});
      Crafty.e("2D, Canvas, water_t, solid").attr({x: this.positionX(x), y: this.positionY(this.grid.height - 1), z: 0});
    }
    for (y = 1; y < this.grid.height - 1; y++) {
      Crafty.e("2D, Canvas, water_r, solid").attr({x: 0, y: this.positionY(y), z: 0});
      Crafty.e("2D, Canvas, water_l, solid").attr({x: this.positionX(this.grid.width - 1), y: this.positionY(y), z: 0});
    }
    Crafty.e("2D, Canvas, water_tl, solid").attr({x: 0, y: 0, z: 0});
    Crafty.e("2D, Canvas, water_tr, solid").attr({x: this.positionX(this.grid.width - 1), y: 0, z: 0});
    Crafty.e("2D, Canvas, water_bl, solid").attr({x: 0, y: this.positionY(this.grid.height - 1), z: 0});
    Crafty.e("2D, Canvas, water_br, solid").attr({x: this.positionX(this.grid.width - 1), y: this.positionY(this.grid.height - 1), z: 0});
  }

  // главный экран игры
  screenMain() {
    this.generateWorld();

    // создаём игрока
    this.player = Crafty.e("2D, DOM, player, Fourway, SpriteAnimation, Collision")
      .attr({x: this.positionX(5), y: this.positionY(5), z: 1})
      .fourway(100, {normalize: true})
      // настраиваем анимации
      .reel("walk_down",  500, [[0, 0], [1, 0], [2, 0], [3, 0]])
      .reel("walk_up",    500, [[0, 1], [1, 1], [2, 1], [3, 1]])
      .reel("walk_right", 500, [[0, 2], [1, 2], [2, 2], [3, 2]])
      .reel("walk_left",  500, [[0, 3], [1, 3], [2, 3], [3, 3]])
      .bind("NewDirection", function (direction) {
        // меняем направление, когда получим событие "смена направления"
        if (direction.x < 0) {
          if (!this.isPlaying("walk_left"))
            this.animate("walk_left", -1);
        }
        if (direction.x > 0) {
          if (!this.isPlaying("walk_right"))
            this.animate("walk_right", -1);
        }
        if (direction.y < 0) {
          if (!this.isPlaying("walk_up"))
            this.animate("walk_up", -1);
        }
        if (direction.y > 0) {
          if (!this.isPlaying("walk_down"))
            this.animate("walk_down", -1);
        }
        if (!direction.x && !direction.y) {
          this.pauseAnimation();
        }
      })
      .bind("Move", function(evt) {
        // не даём пройти через препятствия
        if (this.hit('solid')) {
          this.x = evt._x;
          this.y = evt._y;
        }
      });
  }
};
