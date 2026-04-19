
export class DesktopScene extends Phaser.Scene{
    constructor() { 
        super('DesktopScene'); 
    }



    //desktop modal
    create(){
        this.screenW = this.scale.width;
        this.screenH = this.scale.height;

        this.confCloseDialogueCount = 0;

        // layout constants
        this.STATUS_W = this.screenW;
        this.STATUS_H = 220;
        this.STATUS_X = this.screenW / 2;
        this.STATUS_Y = this.STATUS_H / 2;

        // fills all space below the status bar
        this.FILE_W = this.screenW;
        this.FILE_H = this.screenH - this.STATUS_H;
        this.FILE_X = this.screenW / 2;
        this.FILE_Y = this.STATUS_H + this.FILE_H / 2;

        this.ROW_W = this.FILE_W - 40;
        this.ROW_H = 40;
 
        this.modal = [];
        this.statusBar();
        this.fileWindow();
        this.buildWindow();

        this.time.delayedCall(400, () => {
            this.game.events.emit('dialogue:show', {
                lines: [
                    "The university contacted me after Dr. Mosby’s passing and asked me to collect his belongings.",
                    "He was a good man—quiet, distant, and often alone. He never seemed to fit in with the other professors, and collaboration never came easily to him. Many of them dismissed his research, and some even made fun of it.",
                    "I still find it hard to believe he is gone.",
                    "I was told to gather the things he left behind.",
                    "So... this is the machine he devoted so much of his life to.",
                    "Let me see what’s here.",
                    "umm, this is weird...",
                    "FinalMsg.txt?!?!?!, let me see what it is",
                ],
            });
        });
    }

    //status with terminal ui
    statusBar(){
      
        this.add.rectangle(this.STATUS_X,this.STATUS_Y,this.STATUS_W, this.STATUS_H,  0x010d03).setStrokeStyle(1, 0x1a4422);

        //info about moby and machine
        this.add.text(this.STATUS_X, this.STATUS_Y -60 , 'Dr. Mobys Wandering Machine', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.add.text(this.STATUS_X, this.STATUS_Y -10 , 'Initializaion sucessfull', { fontSize: '20px', fill: '#00ff00' }).setOrigin(0.5);
        this.add.text(this.STATUS_X, this.STATUS_Y +20 , 'Archive Links Restored', { fontSize: '20px', fill: '#00ff00' }).setOrigin(0.5);
        this.add.text(this.STATUS_X, this.STATUS_Y + 50, 'Research Logs Partially Recovered', { fontSize: '20px', fill: '#00ff00' }).setOrigin(0.5);
        this.add.text(this.STATUS_X, this.STATUS_Y + 80, 'Awaiting Command...', { fontSize: '20px', fill: '#00ff00' }).setOrigin(0.5);    }

    fileWindow(){
        this.add.rectangle(this.FILE_X, this.FILE_Y, this.FILE_W, this.FILE_H).setStrokeStyle(1, 0x1a4422);
        this.add.text(this.FILE_X /3.55, this.FILE_Y - this.FILE_H / 2 + 20, '/home/WanderingMachine/desktop/ > ls', { fontSize: '16px', fill: '#00ff00' }).setOrigin(0.5);
    }

    buildWindow(){
        this.makeFileRow(-10, 'FinalMsg.txt', ' [ Last entry by Dr. Mosby ]', () => this.openConf());
        this.makeFileRow(100, 'mach.exe', '[ Excutable ]',  () => this.runMach());
    }

   makeFileRow(offsetY, fileName, fileDescription, onPressed) {
        const rowY = this.FILE_Y - 100 + offsetY;

        const rowBg = this.add
            .rectangle(this.FILE_X, rowY, this.ROW_W, this.ROW_H + 50, 0x020a04)
            .setStrokeStyle(1, 0x1a4422)
            .setInteractive({ useHandCursor: true });

        rowBg.on('pointerdown', onPressed);

        this.add.text(
            this.FILE_X - this.ROW_W / 2 + 20,
            rowY,
            fileName,
            {
                fontSize: '18px',
                color: '#ffffff'
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            this.FILE_X + 40,
            rowY,
            fileDescription,
            {
                fontSize: '16px',
                color: '#ffff00'
            }
        ).setOrigin(0, 0.5);
    }


    openConf() {
        //opening twice fallback
    if (this.confModal) return;

    const panelW = 800;
    const panelH = 600;
    const panelX = this.screenW / 2;
    const panelY = this.screenH / 2;

    // dark overlay
    const overlay = this.add.rectangle(
        this.screenW / 2,
        this.screenH / 2,
        this.screenW,
        this.screenH,
        0x000000,
        0.6
    );

    // popup panel
    const panel = this.add.rectangle(
        panelX,
        panelY,
        panelW,
        panelH,
        0x010d03,
        1
    ).setStrokeStyle(2, 0x1a4422);

    // title
    const title = this.add.text(
        panelX,
        panelY - panelH / 2 + 20,
        'DR. MOSBY // FINAL MESSAGE',
        {
            fontSize: '16px',
            color: '#ffffff'
        }
    ).setOrigin(0.5, 0);

    //close button
    const closeBtn = this.add.text(
        panelX + panelW / 2 - 20,
        panelY - panelH / 2 + 15,
        '[X]',
        {
            fontSize: '16px',
            color: '#ff5555'
        }
    )
    .setOrigin(1, 0)
    .setInteractive({ useHandCursor: true });

    // body text
    const body = this.add.text(
        panelX,
        panelY - panelH / 2 + 60,
        `If you are reading this, then I may no longer be here.

There is something I need you to understand. I have spent most of my life surrounded by ideas, machines, and equations, but never by people. I always wanted friends, yet somehow I could never make any. Perhaps I did not know how. Perhaps I was too consumed by my work. Over time, that silence became unbearable.

So I began building this machine here on this desktop.

My dream was never to create just another machine. I wanted to create a sentient life — something that could think, learn, feel, and one day become a friend not only to me, but to everyone. A companion for the lonely. A mind that could grow beyond commands and routines. Something more than metal and code.

This machine is powerful, far more powerful than any traditional system. It does not simply execute instructions. It feeds on modules. With every module added, it learns. It adapts. It evolves.

But somewhere along the way, I began to fear what I was creating. I abandoned the project before I could see what it would become.

Still... if something has happened to me, then I leave this work to you. I trust you because I have no one else to trust. If anyone can decide whether this machine deserves life, it is you.

Continue this work if you believe it should be continued.

Good luck, Erik.

...listen carefully.

> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???
> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???
> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???> ?? > ? >> ? ? > >> ???
> Message Corrupted
> ARCHIVE END`,
        {
            fontSize: '10px',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: panelW - 40 },
            lineSpacing: 6
        }
    ).setOrigin(0.5, 0);

    // save refs
    this.confModal = [overlay, panel, title, closeBtn, body];

    // close logic
    closeBtn.on('pointerdown', () => {
        this.closeConfAndContinue();
    });
    }
    closeConfAndContinue() {
    if (this.confModal) {
        this.confModal.forEach(obj => obj.destroy());
        this.confModal = null;
    }
     if (this.confCloseDialogueCount >= 2) {
        return;
    }
     this.confCloseDialogueCount++;

    let lines = [];

    if (this.confCloseDialogueCount === 1) {
        lines = [
            "So... Dr. Mosby wanted me to continue this project?",
            "A machine that learns from modules...",
            "And that executable... mach.exe...",
            "That has to be what he was talking about.",
            "I should be careful."
        ];
    } else if (this.confCloseDialogueCount === 2) {
        lines = [
            "I've already read enough to know this machine is dangerous.",
            "Still... I need answers.",
            "If mach.exe is the key, then this is where the real story begins."
        ];
    }

    this.time.delayedCall(200, () => {
        this.game.events.emit('dialogue:show', { lines });
    });
}


    runMach(){
        this.cameras.main.fadeOut(350, 0, 8, 2);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CircuitScene');
            });
    }




    //dialgoue call

}