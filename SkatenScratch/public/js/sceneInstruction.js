class SceneInstruction extends Phaser.Scene
{
    constructor()
    {
        super("SceneInstruction")
    }

    preload()
    {
        this.scene.bringToTop();
        this.load.image('insBg','images/Intro Screen/assets/background.jpg')
        this.load.image('insCover','images/Intro Screen/assets/intro-title.png');
        this.load.image('insLogo','images/logo.png');
        this.load.image('insBtn','images/Intro Screen/assets/play-btn.png');
        this.load.image('insInsBtn','images/Intro Screen/assets/insturctions-btn.png');
        this.load.image('insPopup','images/instructions (1).png')
        // this.load.image('insPopup','images/Instructions Popup/instructionsPanel.png')

        this.load.audio('insClickSfx','audio/clickAudio.wav');
    }

    create()
    {
        this.bg = this.add.image(0,0,'insBg').setOrigin(0.5,1).setTint(0x555555);
        this.cover = this.add.image(0,0,'insCover').setOrigin(0.5).setTint(0x555555);
        this.logo = this.add.image(0,0,'insLogo').setOrigin(0.5).setTint(0x555555);
        this.popup = this.add.image(0,0,'insPopup').setOrigin(0.5);
        this.btn = this.add.image(0,0,'insBtn').setOrigin(0.5,0).setInteractive();
        //this.text = this.add.text(0,0,"CLICK TO START",{font:"bold 30px Arial",fill:"#FF0000",align:"center"}).setOrigin(0.5);
        this.isTouchFlag = false;
        
        this.agrid = new AlignGrid({scene:this,rows:11,cols:11});
        //this.agrid.showNumbers();

        //this.agrid.placeAtIndex(60,this.bg);
        this.bg.setPosition(config.width/2,config.height);
        Align.scaleToGameH(this.bg,1,this);
        if(currentFont == fontSettings.pc)
            Align.scaleToGameW(this.bg,1,this);
        this.agrid.placeAtIndex(49,this.cover);
        Align.scaleToGameW(this.cover,0.5,this);
        this.agrid.placeAtIndex(5,this.logo);
        Align.scaleToGameW(this.logo,0.3,this);
        if(currentFont == fontSettings.pc)
        {
            this.agrid.placeAtIndex(60,this.popup);
            Align.scaleToGameW(this.popup,0.75,this);
        }
        else
        {
            this.agrid.placeAtIndex(60,this.popup);
            //Align.scaleToGameH(this.popup,0.75,this);
            this.popup.displayWidth = config.width*1;
            this.popup.displayHeight = config.height*1;
        }
        //this.agrid.placeAtIndex(82,this.btn);
        Align.scaleToGameW(this.btn,0.3,this);
        this.btn.x=this.popup.x;
        this.btn.y = this.popup.y + this.popup.displayHeight/4;
        
        // var str = [
        //     "Power up Cruncha Muncha by collecting the goodies along the way.",
        //     "",
        //     "Avoid the nasty obstacles that come your way. Like you, we too dislike oil, maida, and chemicals."
        // ]
        
        // var graphics = this.make.graphics();
	    // // graphics.fillStyle(0xffffff);
	    // graphics.fillRect(this.popup.x-this.popup.displayWidth/2, this.popup.y-this.popup.displayHeight/2, this.popup.displayWidth, this.popup.displayHeight);
	    // var mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
        
	    // var insText= this.add.text(this.popup.x, this.popup.y+this.popup.displayHeight*0.03, str, { fontFamily:"myFont", fontSize:currentFont.instText, color: '#000000', align:"center", wordWrap: { width: this.popup.displayWidth*0.8 } }).setOrigin(0.5,0);
	    // insText.setMask(mask);

        
        this.btnInitScale = {x:this.btn.scaleX,y:this.btn.scaleY};
        this.btnOverScale = {x:this.btn.scaleX*0.9,y:this.btn.scaleY*0.9};
        

        //this.agrid.placeAtIndex(27,this.text);
        this.btn.on('pointerdown', function (pointer) {
            this.btn.removeListener('pointerdown');
            this.btn.removeListener('pointerover');
            this.btn.removeListener('pointerout');
            this.sound.play('insClickSfx');
            game.scene.start('SceneGame2');
            // game.scene.start('SceneGame');
        },this)
        this.btn.on('pointerover',function(pointer){
            this.btn.setScale(this.btnOverScale.x,this.btnOverScale.y);
        },this)
        this.btn.on('pointerout',function(pointer){
            this.btn.setScale(this.btnInitScale.x,this.btnInitScale.y);
        },this)
    }
}