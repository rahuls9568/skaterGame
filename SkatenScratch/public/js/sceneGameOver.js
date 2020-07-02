class SceneGameOver extends Phaser.Scene
{
    constructor()
    {
        super('SceneGameOver');
    }

    preload()
    {
        this.scene.bringToTop();
        this.load.image('GObg','images/introBG.png')
        this.load.image('scratchCard','images/scratch-cover.jpg');
        this.load.image('scratchCardRevealed','images/scratch-cover_revealed.jpg')
        this.load.image('scratchCardGreyed','images/scratch-cover_grey.jpg')
        this.load.image('retryImg','images/retry-button.png');
        this.load.image('goBtn','images/submit.png');
        this.load.image('brushImg','images/brush.png');
        this.load.image('gologoImg','images/logo.png');
        this.load.image('gotextImg','images/Retry screen text.png');
        this.load.image('gocoverimg','images/Intro Screen/assets/intro-title.png')
        this.load.image('visitImg','images/BUTTON.jpg')
        this.load.image('goInsBtn','images/Intro Screen/assets/insturctions-btn.png');
        this.load.image('gohtplayimg','images/How to play.png');
        this.load.image('goEmailbg','images/emailContainer.jpg');
        this.load.image('gowohooImg','images/woohoo.jpg');

        this.load.audio('BtnClickSfx','audio/clickAudio.wav');
        
    }

    create()
    {
        this.bg = this.add.image(0,0,'gamebg').setOrigin(0.5);
        this.agrid = new AlignGrid({scene:this,rows:17,cols:15});
        //this.agrid.showNumbers();
        
        this.agrid.placeAtIndex(112,this.bg);
        Align.scaleToGameH(this.bg,1,this);

        this.formutil = new FormUtil({scene:this,rows:17,cols:15});
        //this.formutil.showNumbers();
        
        if(GAME_OVER_TYPE == "WIN")
        {
            this.goBG = this.add.image(0,0,'GObg').setOrigin(0.5);
            this.agrid.placeAtIndex(112,this.goBG);
            Align.scaleToGameH(this.goBG,1,this);
            this.scratchback = this.add.image(0,0,'scratchCardRevealed').setOrigin(0.5);
            this.agrid.placeAtIndex(112,this.scratchback);
            Align.scaleToGameH(this.scratchback,0.3,this);
            this.logo = this.add.image(config.width/2,config.height,'gologoImg').setOrigin(0.5,1);
            Align.scaleToGameW(this.logo,0.25,this);

            this.emailcon = this.add.image(config.width/2,config.height,'goEmailbg').setOrigin(0.5,1);
            this.emailcon.displayWidth = config.width;
            this.emailcon.displayHeight = config.height*0.15;

            // this.wohooImg = this.add.image(0,0,'gowohooImg').setOrigin(0.5);
            // this.agrid.placeAtIndex(37,this.wohooImg);
            // Align.scaleToGameW(this.wohooImg,0.5,this);
            var wohooText = this.add.text(this.scratchback.x,this.scratchback.y-this.scratchback.displayHeight,"WOOHOO!",{fontFamily:"myFont",fontSize:currentFont.instText*4,fill:"#e4ca07",align:"center"}).setOrigin(0.5);
            var wohooText2 = this.add.text(wohooText.x,wohooText.y+40,"You've earned a reward",{fontFamily:"Roboto",fontSize:currentFont.instText*2,fill:"#FFFFFF",align:"center"}).setOrigin(0.5);
            var pos = this.agrid.getPosByIndex(157);
            var swipeText = this.add.text(pos.x,pos.y,"Swipe back and forth to reveal reward",{fontFamily:"Roboto",fontSize:currentFont.instText,fill:"#FFFFFF",align:"center"}).setOrigin(0.5);
            var graphics = this.make.graphics();

            // graphics.fillStyle(0xffffff);
            graphics.fillRect(this.scratchback.x-this.scratchback.displayWidth/2, this.scratchback.y-this.scratchback.displayHeight/2, this.scratchback.displayWidth, this.scratchback.displayHeight);

            var mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
            //this.Instext.setMask(mask);
            var couponText = this.add.text(this.scratchback.x, this.scratchback.y-this.scratchback.displayHeight*0.4,"This one is for you",{font:currentFont.codeText,fill:"#e4ca07",align:"center",wordWrap:{width:config.width*0.3}}).setOrigin(0.5,0);
            couponText.setMask(mask);
            this.couponCodeText = this.add.text(this.scratchback.x,this.scratchback.y+50,"",{font:currentFont.codeText,fill:"#FFFFFF",align:"center", maxLines:2, wordwrap:{width:config.width*0.3}}).setOrigin(0.5);
            this.couponCodeText.setText("SAMPLE CODE");
            this.couponCodeText.setMask(mask);
            this.couponCodeExp = this.add.text(this.scratchback.x,this.scratchback.y,"",{font:currentFont.codeText/2,fill:"#FFFFFF",align:"center", maxLines:4, wordwrap:{width:config.width*0.3}}).setOrigin(0.5);
            this.couponCodeExp.setText("code exp");
            this.couponCodeExp.setMask(mask);

            this.scratch = this.add.image(0,0,'scratchCardGreyed').setOrigin(0.5)
            this.agrid.placeAtIndex(112,this.scratch);
            Align.scaleToGameH(this.scratch,0.3,this);
            
            this.goBtn = this.add.image(0,0,'goBtn').setOrigin(0.5,0).setInteractive();
            this.agrid.placeAtIndex(237,this.goBtn);
            Align.scaleToGameW(this.goBtn,0.15,this);
            this.goBtn.y+=10;
            this.BtnInitScale = {x:this.goBtn.scaleX,y:this.goBtn.scaleY};
            this.BtnOverScale = {x:this.goBtn.scaleX*0.9,y:this.goBtn.scaleY*0.9};
            this.goBtn.on('pointerover',function(pointer){
                this.goBtn.setScale(this.BtnOverScale.x,this.BtnOverScale.y);
            },this);
            this.goBtn.on('pointerout',function(pointer){
                this.goBtn.setScale(this.BtnInitScale.x,this.BtnInitScale.y);
            },this);
            this.goBtn.on('pointerdown',function(pointer){
                this.SubmitButton();
                this.sound.play('BtnClickSfx');
            },this);

            var texPos = this.agrid.getPosByIndex(231);
            this.emailText = this.add.text(texPos.x,texPos.y,"Enter your email and unlock your reward",{fontFamily:"Roboto",fontSize:currentFont.instText*1.5,align:"center"}).setOrigin(0.5,1);
            
            this.formutil.scaleToGameW("emailText",0.6);
            this.formutil.placeElementAtWithOffset(231,"emailText",10,true,false);
            this.formutil.showElement("emailText");
            var emailX = document.getElementById("emailText").style.left;
            emailX = emailX.replace("px", "");
            emailX = parseInt(emailX);
            var can = document.getElementById("phaser-game").lastElementChild;
            if(can)
            {
                var canX = can.style.marginLeft;
                if(canX)
                {
                    canX = canX.replace("px","");
                    canX = parseInt(canX);
                    emailX = emailX + canX;
                    console.log(canX);
                }
            }
            document.getElementById("emailText").style.left = emailX+"px";
        }
        else
        {
            this.coverImg = this.add.image(0,0,'gocoverimg').setOrigin(0.5);
            this.retryBtn = this.add.image(0,0,'retryImg').setOrigin(0.5).setInteractive();
            this.htp = this.add.image(0,0,'gohtplayimg').setOrigin(0.5,0);
            this.ins = this.add.image(0,0,'goInsBtn').setOrigin(0.5).setInteractive();
            this.text = this.add.image(0,0,'gotextImg').setOrigin(0.5,0);

            this.agrid.placeAtIndex(97,this.coverImg);
            Align.scaleToGameH(this.coverImg,0.5,this);
            //Align.scaleToGameW(this.text,0.5,this);
            currentFont == fontSettings.pc ? Align.scaleToGameW(this.text,0.6,this) : Align.scaleToGameW(this.text,0.8,this);
            this.text.x = this.coverImg.x;
            this.text.y = this.coverImg.y + this.coverImg.displayHeight/2;
            this.agrid.placeAtIndex(185,this.retryBtn);
            Align.scaleToGameW(this.retryBtn,0.3,this);
            this.agrid.placeAtIndex(189,this.ins);
            Align.scaleToGameW(this.ins,0.1,this);
            this.htp.x = this.ins.x;
            this.htp.y = this.ins.y+this.ins.displayHeight/4;
            Align.scaleToGameW(this.htp,0.15,this);

            this.insInitScale = {x:this.ins.scaleX,y:this.ins.scaleY}
            this.insOverScale ={x:this.ins.scaleX*0.9,y:this.ins.scaleY*0.9}
            this.ins.on('pointerover',function(pointer){
                this.ins.setScale(this.insOverScale.x,this.insOverScale.y);
            },this);
            this.ins.on('pointerout',function(pointer){
                this.ins.setScale(this.insInitScale.x,this.insInitScale.y);
            },this);
            this.ins.on('pointerdown',function(pointer){
                this.ins.removeListener('pointerdown');
                this.ins.removeListener('pointerover');
                this.ins.removeListener('pointerout');
                game.scene.start('SceneInstruction');
                this.retryBtn.removeListener('pointerdown');
                this.retryBtn.removeListener('pointerover');
                this.retryBtn.removeListener('pointerout');
                // game.scene.start('SceneGame');
                this.sound.play('BtnClickSfx');
            },this);

            this.BtnInitScale = {x:this.retryBtn.scaleX,y:this.retryBtn.scaleY};
            this.BtnOverScale = {x:this.retryBtn.scaleX*0.9,y:this.retryBtn.scaleY*0.9};
            this.retryBtn.on('pointerover',function(pointer){
                this.retryBtn.setScale(this.BtnOverScale.x,this.BtnOverScale.y);
            },this);
            this.retryBtn.on('pointerout',function(pointer){
                this.retryBtn.setScale(this.BtnInitScale.x,this.BtnInitScale.y);
            },this);
            this.retryBtn.on('pointerdown',function(pointer){
                this.retryBtn.removeListener('pointerdown');
                this.retryBtn.removeListener('pointerover');
                this.retryBtn.removeListener('pointerout');
                this.ins.removeListener('pointerdown');
                this.ins.removeListener('pointerover');
                this.ins.removeListener('pointerout');
                game.scene.start('SceneGame2');
                // game.scene.start('SceneGame');
                this.sound.play('BtnClickSfx');
            },this);
        }

        // this.agrid2 = new AlignGrid({scene:this,rows:17,cols:15});
        // this.agrid2.showNumbers();
    }

    update()
    {

    }

    // SubmitButton()
    // {
    //     var str = this.formutil.getTextAreaValue("emailText");
    //     console.log(str);
        
    //     if(ValidateEmail(str))
    //     {
    //         console.log("Legit EMAiL");
    //         this.goBtn.removeListener('pointerdown');
    //         this.goBtn.removeListener('pointerover');
    //         this.goBtn.removeListener('pointerout');
    //         this.scratch.setTint(0xffffff);
    //         this.ScratchCardGenerate(this.scratch);
    //         this.scratch.setVisible(false);
    //     }
    //     else
    //     {
    //         console.log("InValid")
    //         document.getElementById("emailText").value = "";
    //     }
    // }

    SubmitButton()
    {
        var str = this.formutil.getTextAreaValue("emailText");
        console.log(str);
        //this.GenerateRedirectButton();
        if(ValidateEmail(str))
        {
            var sceneref = this;
            $.ajax({
                type: 'POST',
                // url: 'https://soulfullsavoury.com/php/functions.php?f=registerEmailID&p='+str,
                url: '../php/register-email.php',
                data: {
                    "emailID": str
                },
                
                success: function (data) {

                    console.log("success:\n"+data);
                    
                    if ($.isNumeric(data)) {
                        //Error
                        alert("Uh oh! You already got your reward");
                    } else {
                        data = JSON.parse(data);
                        sceneref.couponCodeExp.setText(data[1]);
                        console.log(sceneref.scratchback.displayWidth);
                        sceneref.couponCodeExp.setWordWrapWidth(sceneref.scratchback.displayWidth);
                        sceneref.couponCodeText.setText(data[0]);
                        sceneref.couponCodeText.setWordWrapWidth(sceneref.scratchback.displayWidth);
                        
                        console.log("Legit EMAiL");
                        sceneref.goBtn.removeListener('pointerdown');
                        sceneref.goBtn.removeListener('pointerover');
                        sceneref.goBtn.removeListener('pointerout');
                        sceneref.formutil.hideElement("emailText");
                        sceneref.goBtn.setVisible(false);
                        sceneref.emailcon.setVisible(false);
                        sceneref.emailText.setVisible(false);
                        sceneref.scratch.setTint(0xffffff);
                        sceneref.GenerateRedirectButton();
                        sceneref.ScratchCardGenerate(sceneref.scratch);
                        sceneref.scratch.setVisible(false);
                    }
                }
            });
            // console.log("Legit EMAiL");
            //             sceneref.goBtn.removeListener('pointerdown');
            //             sceneref.goBtn.removeListener('pointerover');
            //             sceneref.goBtn.removeListener('pointerout');
            //             sceneref.formutil.hideElement("emailText");
            //             sceneref.goBtn.setVisible(false);
            //             sceneref.emailcon.setVisible(false);
            //             sceneref.emailText.setVisible(false);
            //             sceneref.scratch.setTint(0xffffff);
            //             sceneref.GenerateRedirectButton();
            //             sceneref.ScratchCardGenerate(sceneref.scratch);
            //             sceneref.scratch.setVisible(false);
        }
        else
        {
            console.log("InValid");
            document.getElementById("emailText").value = "";
        }
    }

    GenerateRedirectButton()
    {
        this.visitBtn = this.add.image(0,0,'visitImg').setOrigin(0.5,0).setInteractive();
        this.agrid.placeAtIndex(187,this.visitBtn)
        Align.scaleToGameW(this.visitBtn,0.3,this);
        var visitText = this.add.text(this.visitBtn.x,this.visitBtn.y,"Head over to our website and see the entire range",{fontFamily:"Roboto",fontSize:currentFont.instText*1.5,align:"center",wordWrap:{width:config.width*0.9}}).setOrigin(0.5,1);
        this.visBtnInitScale = {x:this.visitBtn.scaleX, y:this.visitBtn.scaleY};
        this.visBtnOverScale = {x:this.visitBtn.scaleX*0.9,y:this.visitBtn.scaleY*0.9};
        this.visitBtn.on('pointerover',function(pointer){
            this.visitBtn.setScale(this.visBtnOverScale.x,this.visBtnOverScale.y);
        },this);
        this.visitBtn.on('pointerout',function(pointer){
            this.visitBtn.setScale(this.visBtnInitScale.x,this.visBtnInitScale.y);
        },this);
        this.visitBtn.on('pointerdown',function(pointer){
            // this.visitBtn.removeListener('pointerdown');
            // this.visitBtn.removeListener('pointerover');
            // this.visitBtn.removeListener('pointerout');
            this.openExternalLink();
            //game.scene.start('SceneGame2');
            // game.scene.start('SceneGame');
            this.sound.play('BtnClickSfx');
        },this);
    }

    ScratchCardGenerate(scratchback)
    {
        var rt = this.add.renderTexture(scratchback.x-scratchback.displayWidth/2, scratchback.y-scratchback.displayHeight/2, scratchback.displayWidth, scratchback.displayHeight);
        rt.draw('scratchCard',0,0);
        var brush = this.make.image({ key: 'brushImg' }, false).setScale(1);
        var offset = {x:brush.displayWidth*currentFont.scratch.offsetMultiplier.x,y:brush.displayHeight*currentFont.scratch.offsetMultiplier.y};

        this.input.on('pointermove', function (pointer) {

            if (pointer.isDown)
            {
                rt.erase(brush, pointer.x - offset.x, pointer.y - offset.y);
            }

        }, this);

        this.input.on('pointerdown', function (pointer) {

            rt.erase(brush, pointer.x - offset.x, pointer.y - offset.y);

        }, this);
    }

    openExternalLink ()
    {
        //var tweet = 'I am testing a button from within a Phaser example';

        var url = 'https://soulfull.co.in';

        var s = window.open(url, '_blank');

        if (s && s.focus)
        {
            s.focus();
        }
        else if (!s)
        {
            window.location.href = url;
        }
    }
}

function ValidateEmail(emailID) 
{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!emailID.match(re)) {
        alert("You have entered an invalid email address!")
        return false;
    }
    return true;
}