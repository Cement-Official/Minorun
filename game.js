var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 321 },
      debug: true,
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
var score = 0;
var scoreText;
var lives = 3;
var worldwidth = 9600;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create() {
  //this.add.image(550, 350, "sky");

  this.add.tileSprite(0, 0, worldwidth, worldHeight, "sky"), setOrigin(0, 0);

  this.physics.world.bounds.width = worldwidth;
  this.physics.world.bounds.height = worldHeight;

  platforms = this.physics.add.staticGroup();

  for (var x = 0; x < worldwidth; x = x + 400) {
    console.log(x)
    platforms.create(x, 1100, "platform").setOrigin(0, 0).refreshBody();
  }

  player = this.physics.add.sprite(100, 450, "dude");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.cameras.main.setBounds(0, 0, worldwidth, window.innerHeight);
  this.physics.world.setBounds(0, 0, worldwidth, window.innerHeight);

  this.cameras.main.startFollow(player);

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
  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  platforms = this.physics.add.staticGroup();

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
