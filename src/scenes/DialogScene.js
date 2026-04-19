const MONO = 'monospace';
const W = 1280, H = 720;

const BOX_X = 80;
const BOX_Y = 510;
const BOX_W = 1120;
const BOX_H = 180;
const PAD   = 24;

export class DialogScene extends Phaser.Scene {
    constructor() { super('DialogScene'); }

    create() {
        this.lines      = [];
        this.idx        = 0;
        this.onComplete = null;
        this.visible    = false;
        this.typing     = false;
        this.typingTimer = null;

        this.buildUI();

        // Space bar advances dialogue
        this.input.keyboard.on('keydown-SPACE', () => this.advance());

        // dialogue trigger
        this.game.events.on('dialogue:show', ({ lines, onComplete }) => {
            this.show(lines, onComplete);
        });

        this.setVisible(false);
    }
    //public 
    show(lines, onComplete = null) {
        this.lines      = lines;
        this.idx        = 0;
        this.onComplete = onComplete;
        this.setVisible(true);
        this.displayLine(0);
    }

  
    buildUI() {
        // Backdrop
        const boxBg = this.add.rectangle(
            BOX_X + BOX_W / 2, BOX_Y + BOX_H / 2,
            BOX_W, BOX_H, 0x0000ff, 0.96
        );

    
       //dialgue text
        this.dialogueTxt = this.add.text(
            BOX_X + PAD, BOX_Y + PAD + 14, '',
            {
                fontSize: '16px',
                color: '#aaffcc',
                fontFamily: MONO,
                wordWrap: { width: BOX_W - PAD * 2 },
                lineSpacing: 8,
            }
        );

        // indicator closing adn continue the progress
        this.indicator = this.add.text(
            BOX_X + BOX_W - PAD, BOX_Y + BOX_H - 16,
            '[ SPACE to continue ]',
            { fontSize: '18px', color: '#ffff00', fontFamily: MONO }
        ).setOrigin(1, 1);

        // Blink the indicator when idle
        this.time.addEvent({ delay: 550, repeat: -1, callback: () => {
            if (this.visible && !this.typing)
                this.indicator.setVisible(!this.indicator.visible);
        }});

        this.ui = [boxBg, this.dialogueTxt, this.indicator];
    }

    displayLine(idx) {
        const text   = this.lines[idx];
        const isLast = idx >= this.lines.length - 1;

        this.indicator.setVisible(false);
        this.dialogueTxt.setText('');
        this.typing = true;

        let i = 0;
        if (this.typingTimer) this.typingTimer.destroy();

        this.typingTimer = this.time.addEvent({
            delay: 22,
            repeat: text.length,
            callback: () => {
                i++;
                this.dialogueTxt.setText(text.slice(0, i));
                if (i >= text.length) {
                    this.typing     = false;
                    this.typingTimer = null;
                    this.indicator.setText(isLast ? 'SPACE to close  ▼' : 'SPACE to continue  ▼');
                    this.indicator.setVisible(true);
                }
            },
        });
    }

    //advance dialog
    advance() {
        if (!this.visible) return;


        if (this.typing) {
            if (this.typingTimer) { this.typingTimer.destroy(); this.typingTimer = null; }
            this.typing = false;
            const text   = this.lines[this._idx];
            const isLast = this.idx >= this.lines.length - 1;
            this.dialogueTxt.setText(text);
            this.indicator.setText(isLast ? '[ SPACE to close ]' : '[ SPACE to continue ]');
            this.indicator.setVisible(true);
            return;
        }

        // Advance to next 
        this.idx++;
        if (this.idx >= this.lines.length) {
            this.close();
        } else {
            this.displayLine(this.idx);
        }
    }



    close() {
        this.setVisible(false);
        const cb = this.onComplete;
        this.onComplete = null;
        if (cb) cb();
    }

    setVisible(v) {
        this.visible = v;
        if (!v && this.typingTimer) {
            this.typingTimer.destroy();
            this.typingTimer = null;
        }
        this.ui?.forEach(o => o.setVisible(v));
    }
}
