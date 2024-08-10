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
var notes;
var score = 0;
var scoreText;

function preload() {
    this.load.image('park', 'park.png'); // Fondo del parque
    this.load.image('ground', 'platform.png'); // Plataformas
    this.load.image('note', 'diamond.png'); // Notas musicales
    this.load.spritesheet('lily', 'dude.png', { frameWidth: 32, frameHeight: 48 }); // Sprite de Lily
}

function create() {
    this.cameras.main.setBackgroundColor('#87CEEB'); // Azul cielo para el fondo

    // El resto de tu código...
}

    // Plataformas
    var platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // Jugador
    player = this.physics.add.sprite(100, 450, 'lily');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // Animaciones del jugador
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('lily', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'lily', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('lily', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    // Notas musicales
    notes = this.physics.add.group({
        key: 'note',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    notes.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(notes, platforms);
    this.physics.add.overlap(player, notes, collectNote, null, this);

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

function collectNote(player, note) {
    note.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}
