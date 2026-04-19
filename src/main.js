import { Menu } from './scenes/Menu.js';
import { DialogScene } from './scenes/DialogScene.js';
import {DesktopScene} from './scenes/DesktopScene.js'
import { CircuitScene } from './scenes/CircuitScene.js';
import { ModuleProgression } from './scenes/ModuleProgression.js';


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
        Menu,
        DesktopScene,
        DialogScene,
        CircuitScene,
        ModuleProgression,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            