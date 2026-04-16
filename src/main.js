import { CircuitScene } from './scenes/CircuitScene.js';

const config = {
    type: Phaser.AUTO,
    title: 'DrMobysWanderingMachine',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    scene: [
        CircuitScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            