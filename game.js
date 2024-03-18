var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 110 },
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
var worldwidth = config.width * 20;
var worldHeight = 1080;
var yStart = 200;
var life = 5;

//assets
function preload() {
  this.load.image("sky", "assets/sky-.png");
  this.load.image("platform", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
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

  //перешкоди
  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(700, 1100)) {
    console.log(x);
    bush = this.physics.add
      .sprite(x, 1000, "bush")
      .setOrigin(2, 1)
      .setDepth(Phaser.Math.Between(0.5, 2))
      .setScale(Phaser.Math.FloatBetween(0.5, 1));
    this.physics.add.collider(bush, platforms);
  }

  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(1000, 2000)) {
    console.log(x);
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

  //летючі платформи
  for (var x = 0; x < worldwidth; x = x + Phaser.Math.Between(400, 500)) {
    var yStep = Phaser.Math.Between(1, 3);
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
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-3000);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(3000);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
