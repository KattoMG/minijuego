var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var guitars;
var score = 0;
var scoreText;

function preload() {
    this.load.image('sky', 'https://examples.phaser.io/assets/skies/space3.png');
    this.load.image('ground', 'https://examples.phaser.io/assets/sprites/platform.png');
    this.load.image('guitar', 'https://examples.phaser.io/assets/sprites/carrot.png');
    this.load.image('goal', 'https://examples.phaser.io/assets/sprites/star.png');
    this.load.spritesheet('cat', 'https://examples.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    // Fondo
    this.add.image(400, 300, 'sky');

    // Plataformas
    var platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Jugador
    player = this.physics.add.sprite(100, 450, 'cat');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animaciones del jugador
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'cat', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('cat', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    // Guitarras
    guitars = this.physics.add.group({
        key: 'guitar',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    guitars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(guitars, platforms);
    this.physics.add.overlap(player, guitars, collectGuitar, null, this);

    // Meta
    var goal = this.physics.add.sprite(750, 100, 'goal');
    this.physics.add.collider(goal, platforms);
    this.physics.add.overlap(player, goal, reachGoal, null, this);

    // Puntuación
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Controles
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectGuitar(player, guitar) {
    guitar.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function reachGoal(player, goal) {
    this.physics.pause();
    player.setTint(0x00ff00);
    player.anims.play('turn');
    scoreText.setText('¡Has ganado! Puntuación final: ' + score);
}
