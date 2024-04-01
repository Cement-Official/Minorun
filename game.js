var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1400 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var platforms;
var player;
var screenCount = 10;
var worldwidth = config.width * screenCount;
var enemyCount = screenCount;
var worldHeight = 1080;
var yStart = 200;
var life = 5;
var score = 0;
var scoreText;

//assets
function preload() {
  this.load.image("sky", "assets/sky-.png");
  this.load.image("platform", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.image("heart", "assets/heart.png");
  this.load.image("tree", "assets/Tree.png");
  this.load.image("stone", "assets/Stone.png");
  this.load.image("bush", "assets/Bush.png");
  this.load.image("platform1", "assets/13.png");
  this.load.image("platform2", "assets/14.png");
  this.load.image("platform3", "assets/15.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet("enemy", "assets/Minotaur.png", {
    frameWidth: 53,
    frameHeight: 41,
  });
}

function create() {
  this.add.tileSprite(0, 0, worldwidth, worldHeight, "sky").setOrigin(0, 0);

  //this.physics.world.bounds.width = worldwidth;
  //this.physics.world.bounds.height = worldHeight;

  platforms = this.physics.add.staticGroup();

  for (var x = 0; x < worldwidth; x = x + 500) {
    //console.log(x);
    platforms.create(x, 1000, "platform").setOrigin(0, 0).refreshBody();
  }

  //dude
  player = this.physics.add.sprite(400, 600, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  this.cameras.main.setBounds(0, 0, worldwidth, window.innerHeight);
  this.physics.world.setBounds(0, 0, worldwidth, window.innerHeight);

  this.cameras.main.startFollow(player);

  //dude_movements
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //lifes

  //перешкоди
  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(700, 1100)) {
    // console.log(x);
    bush = this.physics.add
      .sprite(x, 1000, "bush")
      .setOrigin(2, 1)
      .setDepth(Phaser.Math.Between(0.5, 2))
      .setScale(Phaser.Math.FloatBetween(0.5, 1));
    this.physics.add.collider(bush, platforms);
  }

  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(1000, 2000)) {
    // console.log(x);
    tree = this.physics.add
      .sprite(x, 1000, "tree")
      .setOrigin(-1, 1)
      .setDepth(Phaser.Math.Between(0.5, 2))
      .setScale(Phaser.Math.FloatBetween(1, 1.6));
    this.physics.add.collider(tree, platforms);
  }

  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(900, 1400)) {
    console.log(x);
    stone = this.physics.add
      .sprite(x, 1000, "stone")
      .setOrigin(0, 1)
      .setDepth(Phaser.Math.Between(0.5, 2))
      .setScale(Phaser.Math.FloatBetween(0.5, 1));
    this.physics.add.collider(stone, platforms);
  }
  //hearts
    for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(1500, 2000)) {
    console.log(x);
    heart = this.physics.add
      .sprite(x, 1000, "heart")
      .setOrigin(0, 1)
      .setDepth(2)
      .setScale(0.08);
      this.physics.add.collider(heart, platforms);
      this.physics.add.overlap(player, heart, collectheart, null, this);

      function collectheart(player, heart) {
        heart.disableBody(true, true);
        lifeText.setText(showTextSymbols('❤️', life = life + 1))
     }
  }

  //летючі платформи
  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(300, 500)) {
    var yStep = Phaser.Math.Between(1, 4);
    var y = yStart * yStep;

    platforms.create(x, y, "platform1");

    var i;
    for (i = 1; i < Phaser.Math.Between(0, 5); i++) {
      platforms.create(x + 128 * i, y, "platform2");
    }

    platforms.create(x + 128 * i, y, "platform3");
  }

  cursors = this.input.keyboard.createCursorKeys();
  stone = this.physics.add.staticGroup();

  //додає ворогів

  enemy = this.physics.add.group({
    key: "enemy",
    repeat: enemyCount,
    setXY: {
      x: 1500,
      y: 930,
      stepX: Phaser.Math.FloatBetween(-600, 1000),
    },
  });

  enemy.children.iterate(function (child) {
    child
      .setCollideWorldBounds(true)
      .setVelocityX(Phaser.Math.FloatBetween(-600, 2000));
  });

  //колізія ворогів та платформ
  this.physics.add.collider(enemy, platforms);

  //колізія ворогів та гравця
  this.physics.add.collider(player, enemy, (enemy) => {
    player.x = player.x + Phaser.Math.FloatBetween(-50, 30);
    player.y = player.y - Phaser.Math.FloatBetween(200, 400);
    lifeText.setText(showTextSymbols('❤️', life = life - 1))
  }, null, this);

  //enemy animations
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "enemy", frame: 8 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("enemy", { start: 9, end: 17 }),
    frameRate: 10,
    repeat: -1,
  });

  //зірки
  stars = this.physics.add.group({
    key: "star",
    repeat: 30,
    setXY: { x: 20, y: 0, stepX: 1100 },
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0, 0.1));
  });
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  function collectStar(player, star) {
    star.disableBody(true, true);
  }
  scoreText = this.add
    .text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#000",
    })
    .setScrollFactor(0);

  function showTextSymbols(symbol, count) {
    var symbolLine = "";

    for (var i = 0; i < count; i++) {
      symbolLine = symbolLine + symbol;
    }

    return symbolLine;
  }

  lifeText = this.add
    .text(1100, 15, showTextSymbols("❤️", life), {
      fontSize: "40px",
      fill: "#FFF",
    })
    .setOrigin(0, 0)
    .setScrollFactor(0);
  //рахунок
  function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
      });

      var x =
        player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
    }
  }
}
//function update
function update() {
  //агро радіус
  if (Math.abs(player.x - enemy.x) < 600) {
    enemy.moveTo(player,player.x,player.y, 300,1)
  }

  if (life === 0) {
    console.log('game over')
    restartGame();
  }


  if (cursors.left.isDown) {
    player.setVelocityX(-1000);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(1000);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-1200);
  }
  enemy.children.iterate((child) => {
    if (Math.random() < 0.01) {
      child.setVelocityX(Phaser.Math.FloatBetween(-500,500))
    }
  })

  function restartGame() {
    location.reload();
  }
}
