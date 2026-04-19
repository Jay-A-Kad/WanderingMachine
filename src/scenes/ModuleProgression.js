const W = window.width;
const NUM_OF_MODULES = 6;
const SEG_W = W / NUM_OF_MODULES;


export class ModuleProgression extends Phaser.Scene {
    constructor() { super('ModuleProgression'); 
    }

    //TODO share progress btw scenes , event for scene emit for progression
    create(){
        if(!this.registry.has('moduleProgress')){
            this.registry.set('moduleProgress' , new Array(NUM_OF_MODULES ).fill(0));
        }
        
        
        


        this.screenW = this.scale.width;
        this.screenH = this.scale.height;
        this.progressBarW = this.screenW;
        this.progressBarH = 50;
        this.progressBarX = this.progressBarW / 2;
        this.progressBarY = this.screenH * .99;
        
        this.buildProgBar();
        //access to bar
        // this.game.events.on('progess:update', ({module,value}))
    }

    buildProgBar(){
        // const depth = 100;
        //bar bg
        this.add.rectangle(
            this.progressBarX,
            this.progressBarY,
            this.progressBarW,
            this.progressBarH,
            0x80bf40
        );

        //make seg for modules on the bar
        for(let i=0;i<NUM_OF_MODULES;i++){
            const sx =  Math.floor(i * SEG_W);
            const sw = Math.floor((i+1) * SEG_W) -sx;

            if(i > 0){
                 this.add.text(sx + sw / 2, this.progressBarY,
                `MOD ${String(i + 1).padStart(2, '0')}`,
                { fontSize: '9px', color: '#0d2a0d' }
            ).setOrigin(0.5);
            }
        }
    }
}
