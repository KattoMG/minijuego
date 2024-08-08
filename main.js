var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var sequence = [];
var playerSequence = [];
var sounds = [];
var currentStep = 0;
var playingSequence = false;
var buttons = [];
var colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];  // Rojo, verde, azul, amarillo

function preload() {
    this.load.audio('sound1', 'https://examples.phaser.io/assets/audio/SoundEffects/key.wav');
    this.load.audio('sound2', 'https://examples.phaser.io/assets/audio/SoundEffects/piano.wav');
    this.load.audio('sound3', 'https://examples.phaser.io/assets/audio/SoundEffects/shotgun.wav');
    this.load.audio('sound4', 'https://examples.phaser.io/assets/audio/SoundEffects/zone.wav');
}

function create() {
    sounds.push(this.sound.add('sound1'));
    sounds.push(this.sound.add('sound2'));
    sounds.push(this.sound.add('sound3'));
    sounds.push(this.sound.add('sound4'));

    this.add.text(400, 50, 'Juego de Memoria Musical', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    
    for (let i = 0; i < 4; i++) {
        let button = this.add.rectangle(200 + i * 150, 300, 100, 100, colors[i]).setInteractive();
        button.sound = sounds[i];
        button.color = colors[i];
        button.on('pointerdown', function () {
            if (!playingSequence) {
                button.sound.play();
                button.setFillStyle(0xffffff);
                this.time.addEvent({
                    delay: 200,
                    callback: () => button.setFillStyle(button.color)
                });
                playerSequence.push(i);
                checkSequence();
            }
        }, this);
        buttons.push(button);
    }

    this.time.addEvent({
        delay: 1000,
        callback: nextRound,
        callbackScope: this,
        loop: true
    });
}

function update() {}

function nextRound() {
    if (!playingSequence) {
        playerSequence = [];
        sequence.push(Phaser.Math.Between(0, 3));
        currentStep = 0;
        playingSequence = true;
        playSequence();
    }
}

function playSequence() {
    if (currentStep < sequence.length) {
        let soundIndex = sequence[currentStep];
        let button = buttons[soundIndex];
        button.sound.play();
        button.setFillStyle(0xffffff);
        this.time.addEvent({
            delay: 200,
            callback: () => button.setFillStyle(button.color)
        });
        currentStep++;
        this.time.addEvent({
            delay: 600,
            callback: playSequence,
            callbackScope: this
        });
    } else {
        playingSequence = false;
    }
}

function checkSequence() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            alert('Juego terminado! Tu puntuación: ' + (sequence.length - 1));
            sequence = [];
            nextRound();
            return;
        }
    }

    if (playerSequence.length === sequence.length) {
        nextRound();
    }
}
