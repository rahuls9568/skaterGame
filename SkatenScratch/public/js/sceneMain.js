class SceneMain extends Phaser.Scene 
{
    constructor() 
    {
        super('SceneMain');
    }
    preload()
    {
        this.scene.bringToTop();
        
        this.load.image('gamebg','images/assets/BG7.jpg');

        this.load.image('introBg','images/home-bg.jpg')
        //this.load.image('introBg','images/Intro Screen/assets/background.jpg')
        this.load.image('introCover','images/Intro Screen/assets/intro-title.png');
        this.load.image('introLogo','images/logo.png');
        this.load.image('introBtn','images/Intro Screen/assets/play-btn.png');
        this.load.image('introInsBtn','images/Intro Screen/assets/insturctions-btn.png');
        this.load.image('htplayImg','images/How to play.png');
        this.load.image('introtextimg','images/Retry screen text.png')

        this.load.audio('introClickSfx','audio/clickAudio.wav');
    }
    create() 
    {
        this.bg = this.add.image(0,0,'introBg').setOrigin(0.5,1);
        this.cover = this.add.image(0,0,'introCover').setOrigin(0.5);
        this.logo = this.add.image(0,0,'introLogo').setOrigin(0.5).setVisible(false);
        this.btn = this.add.image(0,0,'introBtn').setOrigin(0.5).setInteractive();
        this.insBtn = this.add.image(0,0,'introInsBtn').setOrigin(0.5).setInteractive();
        this.htp = this.add.image(0,0,'htplayImg').setOrigin(0.5,0);
        this.intrText = this.add.image(0,0,'introtextimg').setOrigin(0.5,0);
        //this.text = this.add.text(0,0,"CLICK TO START",{font:"bold 30px Arial",fill:"#FF0000",align:"center"}).setOrigin(0.5);
        this.isTouchFlag = false;
        
        this.agrid = new AlignGrid({scene:this,rows:11,cols:11});
        //this.agrid.showNumbers();

        //this.agrid.placeAtIndex(60,this.bg);
        this.bg.setPosition(config.width/2,config.height);
        if(currentFont == fontSettings.pc)
            Align.scaleToGameW(this.bg,1,this);
        else 
            Align.scaleToGameH(this.bg,1,this);
        this.agrid.placeAtIndex(92,this.btn);
        Align.scaleToGameW(this.btn,0.3,this);
        this.agrid.placeAtIndex(95,this.insBtn);
        Align.scaleToGameW(this.insBtn,0.1,this);
        //this.agrid.placeAtIndex(95,this.htp);
        this.htp.x = this.insBtn.x;
        this.htp.y = this.insBtn.y+this.insBtn.displayHeight/4;
        Align.scaleToGameW(this.htp,0.15,this);
        this.agrid.placeAtIndex(49,this.cover);
        Align.scaleToGameH(this.cover,0.4,this);
        if(currentFont == fontSettings.pc)
        {
            this.logo.setVisible(true);
            this.agrid.placeAtIndex(5,this.logo);
            Align.scaleToGameW(this.logo,0.3,this);
        }
        this.agrid.placeAtIndex(71,this.intrText)
        currentFont == fontSettings.pc ? Align.scaleToGameW(this.intrText,0.6,this) : Align.scaleToGameW(this.intrText,0.8,this); 
        
        this.btnInitScale = {x:this.btn.scaleX,y:this.btn.scaleY};
        this.btnOverScale = {x:this.btn.scaleX*0.9,y:this.btn.scaleY*0.9};
        this.insbtnInitScale = {x:this.insBtn.scaleX,y:this.insBtn.scaleY};
        this.insbtnOverScale = {x:this.insBtn.scaleX*0.9,y:this.insBtn.scaleY*0.9};
        
        

        //this.agrid.placeAtIndex(27,this.text);
        this.btn.on('pointerdown', function (pointer) {
            this.btn.removeListener('pointerdown');
            this.btn.removeListener('pointerover');
            this.btn.removeListener('pointerout');
            this.insBtn.removeListener('pointerdown');
            this.insBtn.removeListener('pointerover');
            this.insBtn.removeListener('pointerout');
            this.sound.play('introClickSfx');
            game.scene.start('SceneGame2');
            // game.scene.start('SceneGame');
        },this)
        this.btn.on('pointerover',function(pointer){
            this.btn.setScale(this.btnOverScale.x,this.btnOverScale.y);
        },this)
        this.btn.on('pointerout',function(pointer){
            this.btn.setScale(this.btnInitScale.x,this.btnInitScale.y);
        },this)
        
        this.insBtn.on('pointerdown', function (pointer) {
            this.btn.removeListener('pointerdown');
            this.btn.removeListener('pointerover');
            this.btn.removeListener('pointerout');
            this.insBtn.removeListener('pointerdown');
            this.insBtn.removeListener('pointerover');
            this.insBtn.removeListener('pointerout');
            this.sound.play('introClickSfx');
            game.scene.start('SceneInstruction');
        },this)
        this.insBtn.on('pointerover',function(pointer){
            this.insBtn.setScale(this.insbtnOverScale.x,this.insbtnOverScale.y);
        },this)
        this.insBtn.on('pointerout',function(pointer){
            this.insBtn.setScale(this.insbtnInitScale.x,this.insbtnInitScale.y);
        },this)
        
        
        
    }
    update() 
    {
        
    }
}