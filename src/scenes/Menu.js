

export class Menu extends Phaser.Scene{
    constructor() { 
        super('Menu'); 
    }
    
//load bg and buttons
    preload(){
        this.load.image('menuImg', '/assets/Menu.png');
    }
//draw bg & buttons
    create(){
        const bg = this.add.image(0, 0, 'menuImg').setOrigin(0,0);
        bg.setDisplaySize(this.scale.width,this.scale.height);

        //buttons 
        this.ButtonTemp();
        if (!this.scene.isActive('DialogScene')) {
            this.scene.launch('DialogScene');
        }
        if (!this.scene.isActive('ModuleProgression')) {
            this.scene.launch('ModuleProgression');
        }
    }

    //buttons template
    ButtonTemp(){
        this.makeButton(this.scale.width/4, this.scale.height/2, 'PLAY();', () => this.goToDesktop());
        this.makeButton(this.scale.width/4, this.scale.height/1.6, 'Exit();', () => this.goToExit());
    }

    makeButton( x, y, label , funCall){
        const btn = this.add.text(x, y, label, { fontSize: '46px', fill: '#55ff88' , fontFamily: 'monospace'})
            .setOrigin(0.5)
            .setInteractive();

        btn.on('pointerover',  () => btn.setColor('#55ff88'));
        btn.on('pointerout',   () => btn.setColor('#A5000'));
        btn.on('pointerdown',  funCall);
        return btn;
    }

    goToDesktop() {
        
            this.cameras.main.fadeOut(350, 0, 8, 2);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('DesktopScene');
            });
            
        

    }

    goToExit() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.add.text(this.scale.width/4, this.scale.height/2, 'shutting down...',
                { fontSize: '13px', color: '#336644', fontFamily: MONO }
            ).setOrigin(0.5);
        });
    }
}