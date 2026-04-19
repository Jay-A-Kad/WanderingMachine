import { Puzzle1 } from '../Data/Puzzle1Circuit.js'


const GREEN  = { fontSize: '20px', color: '#55ff88', fontFamily: 'monospace' };
const DIM    = { fontSize: '14px', color: '#336644', fontFamily: 'monospace' };



export class CircuitScene extends Phaser.Scene {
    constructor() { super('CircuitScene'); }

    create() {
        this.nodes = [];
        this.wires = [];
        this.components = [];
        this.dragWire = null;
        this.completedPuzzles = new Set();
        this.wireGraphics = this.add.graphics();
        this.dragGraphics = this.add.graphics();
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup',   this.onPointerUp,   this);
        this.loadPuzzle(0);

         this.time.delayedCall(400, () => {
            this.game.events.emit('dialogue:show', {
                lines: [
                    "Whoah!, what is this! this looks so old and rusty",
                    "I think I have to start from scratch start with basic foundation building for logic",
                    "Then train the machine for Recognition, Decision Making, Memory, Planning and Adaptability",
                    "This is gonna be make me numb...",
                    "Maybe I can use the mach.exe model to restore the corrupted FinalMsg.txt left by Dr. Mosby",
                    "First, I need to finish all the modules, Now lets start with Module 1",

                ],
            });
        });
    }



    //load puzzle

    loadPuzzle(index){
        this.clearPuzzle();
        this.puzzleIndex = index;
        const puzzle = Puzzle1[index];

        this.uiObjects = [ 
            this.add.text( 640 , 36 , puzzle.title , GREEN).setOrigin( 0.5 , 0),
            this.add.text(640 , 68 , puzzle.hint , DIM).setOrigin( 0.5 , 0),
            this.add.text( 640 , 700, `Modules : ${index + 1} / ${Puzzle1.length}` , DIM ).setOrigin( 0.5 , 1),
        ];

        puzzle.switches.forEach( s => this.makeSwitch(s) );
        puzzle.gates.forEach( g => this.makeGate(g) );
        puzzle.bulbs.forEach( b => this.makeBulb(b) );
        this.evaluate();
    }
    //clear puzzle
    clearPuzzle(){
        this.components.forEach(c => c.objects?.forEach(o => o.destroy()));
        this.nodes.forEach(n => { n.graphics.destroy(); n.zone.destroy(); });
        this.uiObjects?.forEach(o => o.destroy());
        this.wires      = [];
        this.nodes      = [];
        this.components = [];
        this.wireGraphics.clear();
        this.dragGraphics.clear();
    }



    //make logic switch
    makeSwitch({ id, x, y, StartOn= false }){
        //output node
        const outputNode = this.makeNode( x + 70, y, 'output', id );
        //switch body
        const body = this.add.graphics();
        ///label
        const label = this.add.text( x, y + 30 ,'SWITCH', DIM).setOrigin( 0.5 );
        //zone
        const zone = this.add.zone( x, y, 90, 44 ).setInteractive();

        const comp = { id, type: 'switch', value: StartOn, outputNode, objects:[body, label, zone]};
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
        this.components.push( { id, type: 'gate' , gateType: type , inputNodes , outputNode , objects: [  body, label  ]} );
    }

    //make the bulb
    makeBulb({id, x, y}){
        const inputNode = this.makeNode( x - 50 , y , 'input' , id);
        const body = this.add.graphics();
        const label = this.add.text( x, y + 44 , 'OUTPUT' , DIM).setOrigin( 0.5 );
        const comp = { id, type: 'bulb' , value: false , inputNode , x , y , body , objects: [body, label]};
        this.components.push(comp);
        this.drawBulb(comp , false);

    }

    //draw the bulb
    drawBulb(comp, isOn){
        comp.body.clear()
            .fillStyle(isOn ? 0xffee00 : 0x222200).fillCircle(comp.x, comp.y, 28)
            .lineStyle(2, isOn ? 0xffff88 : 0x444422).strokeCircle(comp.x, comp.y, 28);
    }

    

    //make the op node
    makeNode(x, y, type, ownerId){
        const graphics = this.add.graphics();
        const zone = this.add.zone( x ,y , 28, 28 ).setInteractive();
        const node = { x , y , type , value : false , graphics , zone , ownerId };
        this.drawNode(node);
        if(type === 'output') zone.on('pointerdown' , () => this.startWire( node ));
        zone.on('pointerover', () => { if (this.dragWire && type === 'input') this.drawNode(node, true); });
        zone.on('pointerout',  () => this.drawNode(node));
        zone.on('pointerup',   () => { if (this.dragWire && type === 'input') this.endWire(node); });

        this.nodes.push(node);
        return node;
    }

    //draw the op node
    drawNode( node , highlight = false){
        node.graphics.clear();
        node.graphics
            .fillStyle(node.value ? 0x00ff77 : 0x0f2e18).fillCircle(node.x, node.y, 8)
            .lineStyle(2, node.value ? 0x88ffcc : 0x1a4422).strokeCircle(node.x, node.y, 8);
    }

    //start wiring
    startWire(node) { this.dragWire = { from: node }; }
    //cancel wiring
    cancelWire() { this.dragWire = null; this.dragGraphics.clear(); }

    //pointer funcs
    onPointerMove(pointer ) {
        if (!this.dragWire) return;
        this.dragGraphics.clear();
        this.dragGraphics.lineStyle(2, 0x336644, 0.6);
        this.drawBezier(this.dragGraphics, this.dragWire.from.x, this.dragWire.from.y, pointer.x, pointer.y);
    }

    onPointerUp(pointer){
        if (!this.dragWire) return;
        const target = this.nodes.find(n =>
            n.type === 'input' && Phaser.Math.Distance.Between(n.x, n.y, pointer.x, pointer.y) < 22
        );
        target ? this.endWire(target) : this.cancelWire();
    }

    endWire(toNode) {
        this.wires = this.wires.filter(w => w.to !== toNode);
        if (this.dragWire.from !== toNode) this.wires.push({ from: this.dragWire.from, to: toNode });
        this.cancelWire();
        this.evaluate();
    }

    //check if switch can connect to op
    evaluate(){
        const gates = this.components.filter(c => c.type === 'gate');
        const bulbs = this.components.filter(c => c.type === 'bulb');
        this.components.filter(c => c.type === 'switch').forEach(s => { s.outputNode.value = s.value; });

        for (let pass = 0; pass < 6; pass++) {
            this.wires.forEach(w => { w.to.value = w.from.value; });
            gates.forEach(g => {
                g.outputNode.value =
                    g.gateType === 'AND' ?  g.inputNodes[0].value && g.inputNodes[1].value :
                    g.gateType === 'OR'  ?  g.inputNodes[0].value || g.inputNodes[1].value :
                                           !g.inputNodes[0].value;
            });
        }
        bulbs.forEach(b => { b.value = b.inputNode.value; this.drawBulb(b, b.value); });
        this.nodes.forEach(n => this.drawNode(n));

        this.wireGraphics.clear();
        this.wires.forEach(w => {
            this.wireGraphics.lineStyle(2, w.from.value ? 0x00ff77 : 0x1a4422);
            this.drawBezier(this.wireGraphics, w.from.x, w.from.y, w.to.x, w.to.y);
        });

        if (bulbs.every(b => b.value)) this.onWin();
    }
    
    //wire bezeir curve
    drawBezier(graphics , x1, y1, x2 , y2) {
        const midX = (x1 + x2) / 2;
        new Phaser.Curves.CubicBezier(
            new Phaser.Math.Vector2(x1,y1),
            new Phaser.Math.Vector2(midX, y1),
            new Phaser.Math.Vector2(midX, y2),
            new Phaser.Math.Vector2(x2,   y2),
        ).draw(graphics,40);
    }

    //clear round
    onWin() {
        this.completedPuzzles.add(this.puzzleIndex);
        this.game.events.emit('progress:update', {
            module: 0,
            value:  (this.puzzleIndex + 1) / Puzzle1.length,
        });
        this.time.delayedCall(400, () => {
            const isLast   = this.puzzleIndex >= Puzzle1.length - 1;
            const overlay  = this.add.rectangle(640, 360, 420, 140, 0x000000, 0.9).setStrokeStyle(1, 0x00ff77).setDepth(10);
            const title    = this.add.text(640, 330, isLast ? 'ALL DONE' : 'SOLVED', GREEN).setOrigin(0.5).setDepth(11);
            const sub      = this.add.text(640, 358, isLast ? 'MACH-0 is fully wired' : 'MACH-0 absorbed the lesson', DIM).setOrigin(0.5).setDepth(11);
            const all      = [overlay, title, sub];

            if (!isLast) {
                const btn = this.add.text(640, 390, '[ NEXT ]', GREEN).setOrigin(0.5).setInteractive().setDepth(11);
                btn.on('pointerover', () => btn.setColor('#ffffff'));
                btn.on('pointerout',  () => btn.setColor('#55ff88'));
                btn.on('pointerdown', () => { [...all, btn].forEach(o => o.destroy()); this.loadPuzzle(this.puzzleIndex + 1); });
                all.push(btn);
            }
        });
    }
        
    }