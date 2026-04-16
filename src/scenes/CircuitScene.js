import {Puzzel1} from '../Data/Puzzle1Circuit.js'

//machine progression levels
// const Stages = [
//     {name: 'Basic Signal', description: 'Power on', puzzleIdx: 0},
//     {name: 'Basic Signal', description: 'Power on', puzzleIdx: 2},
//     {name: 'Basic Signal', description: 'Power on', puzzleIdx: 3},
//     {name: 'Basic Signal', description: 'Power on', puzzleIdx: null},
//     {name: 'Basic Signal', description: 'Power on', puzzleIdx: null},

// ];
//add const text styles for Ui
// const TEXT = {
//     title:      { fontSize: '28px', color: '#55ff88', fontFamily: 'monospace', fontStyle: 'bold' },
//     hint:       { fontSize: '18px', color: '#336644', fontFamily: 'monospace' },
//     dot:        { fontSize: '20px', fontFamily: 'monospace' },
//     gate:       { fontSize: '22px', color: '#33dd66', fontFamily: 'monospace', fontStyle: 'bold' },
//     sub:        { fontSize: '13px', color: '#225533', fontFamily: 'monospace' },
//     label:      { fontSize: '14px', color: '#335533', fontFamily: 'monospace' },
//     banner:     { fontSize: '28px', color: '#00ff77', fontFamily: 'monospace', fontStyle: 'bold' },
//     next:       { fontSize: '20px', color: '#88ffaa', fontFamily: 'monospace' },
//     panelTitle: { fontSize: '11px', color: '#55ff88', fontFamily: 'monospace', fontStyle: 'bold' },
//     panelSub:   { fontSize: '9px',  color: '#336644', fontFamily: 'monospace' },
//     stageName:  { fontSize: '10px', fontFamily: 'monospace', fontStyle: 'bold' },
//     stageDesc:  { fontSize: '9px',  color: '#224422', fontFamily: 'monospace' },
//     stageBadge: { fontSize: '9px',  fontFamily: 'monospace' },
// };

const GREEN  = { fontSize: '20px', color: '#55ff88', fontFamily: 'monospace' };
const DIM    = { fontSize: '14px', color: '#336644', fontFamily: 'monospace' };



export class CircuitScene extends Phaser.Scene {
    constructor() {
        super('CircuitScene');
    }

    create() {
        this.nodes            = [];
        this.wires            = [];
        this.components       = [];
        this.dragWire         = null;
        this.completedPuzzles = new Set();
        this.wireGraphics = this.add.graphics();
        this.dragGraphics = this.add.graphics();
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup',   this.onPointerUp,   this);
        this.loadPuzzle(0);
    }



    //load puzzle

    loadPuzzle(){

    }
    //clear puzzle
    clearPuzzle(){

    }



    //make logic switch
    makeSwitch({ id, x, y, StartOn= false }){
        //output node
        const outputNode = this.makeNode( x + 70, y, 'output', id );
        //switch body
        this.body = this.add.graphics();
        ///label
        this.label = this.add.text( x, y + 30 ,'Switch', DIM).setOrigin( 0.5 );
        //zone
        this.zone = this.add.zone ( x, y, 90, 44 ).setInteractive();

        const comp = { id, type : 'switch', value : StartOn, outputNode, objects : [ body, label, zone ] };
        this.components.push(comp);
        this.drawSwitch( body, x, y, comp.value );

        zone.on( 'pointerdown' , () => {
            comp.value =! comp.value;
            this.drawSwitch( body, x, y, comp.value );
            this.evaluate();
        });
    }
    //drawing the loguc swtich
    drawSwitch(g, x, y, isOn){
        const trackColor = isOn ? 0x1a4422 : 0x221111;
        const thumbColor = isOn ? 0x00ff66 : 0x553333;
        const thumbX     = isOn ? x + 18 : x - 18;
        g.clear()
            .fillStyle( trackColor ).fillRoundedRect( x - 38, y - 18, 76, 36, 18 )
            .fillStyle( thumbColor ).fillCircle( thumbX, y, 16 );
    }

//logic gate for the challenge
    makeGate({ id, type, x, y }){
        const inputNodes = type == 'NOT' 
            ? [ this.makeNode( x - 55 , y, 'input', id )] 
            : [ this.makeNode( x - 55 , y - 28 , 'input' , id), this.makeNode( x - 55, y + 28 , 'input', id) ];
        const outputNode = this.makeNode( x + 55 , y , 'output' , id );

        const body = this.add.graphics()
            .fillStyle(0x0a2010).fillRoundedRect(x - 48, y - 38, 96, 76, 8)
            .lineStyle(1, 0x1a6633).strokeRoundedRect(x - 48, y - 38, 96, 76, 8)
            
        const label = this.add.text( x, y , type, { ...GREEN, fontSize: '18px' }).setOrigin( 0.5 );
        this.components.push( { id, type : 'gate' , gateType : type , inputNodes , outputNodes , objects : [  body, label  ]} );
    }

    //make the bulb
    makeBulb({id, x, y}){
        const inputNode

    }

    //draw the bulb
    drawBulb({comp, isOn}){

    }

    

    //make the op node
    makeNode(x, y, tyope, ownerId){

    }

    //draw the op node
    drawNode(){

    }
}