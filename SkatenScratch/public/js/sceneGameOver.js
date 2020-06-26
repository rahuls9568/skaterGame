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
        this.load.image('retryImg','images/retry-button.png');
        this.load.image('goBtn','images/submit.png');
        this.load.image('brushImg','images/tomato.png');

        this.load.audio('BtnClickSfx','audio/clickAudio.wav');
        
    }

    create()
    {
        this.bg = this.add.image(0,0,'gamebg').setOrigin(0.5);
        this.agrid = new AlignGrid({scene:this,rows:15,cols:15});
        //this.agrid.showNumbers();
        
        this.agrid.placeAtIndex(112,this.bg);
        Align.scaleToGameH(this.bg,1,this);

        this.formutil = new FormUtil({scene:this,rows:15,cols:15});
        //this.formutil.showNumbers();
        
        if(GAME_OVER_TYPE == "WIN")
        {
            this.goBG = this.add.image(0,0,'GObg').setOrigin(0.5);
            this.agrid.placeAtIndex(112,this.goBG);
            Align.scaleToGameH(this.goBG,1,this);
            this.scratchback = this.add.image(0,0,'scratchCard').setOrigin(0.5).setTint(0x000000);
            this.agrid.placeAtIndex(112,this.scratchback);
            Align.scaleToGameH(this.scratchback,0.3,this);
            
            var graphics = this.make.graphics();

            // graphics.fillStyle(0xffffff);
            graphics.fillRect(this.scratchback.x-this.scratchback.displayWidth/2, this.scratchback.y-this.scratchback.displayHeight/2, this.scratchback.displayWidth, this.scratchback.displayHeight);

            var mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
            //this.Instext.setMask(mask);
            
            this.couponCodeText = this.add.text(this.scratchback.x,this.scratchback.y-45,"",{font:currentFont.codeText,fill:"#FFFFFF",align:"center", maxLines:2, wordwrap:{width:config.width*0.3}}).setOrigin(0.5);
            this.couponCodeText.setText("SAMPLE CODE");
            this.couponCodeText.setMask(mask);
            this.couponCodeExp = this.add.text(this.scratchback.x,this.scratchback.y+50,"",{font:currentFont.codeText/2,fill:"#FFFFFF",align:"center", maxLines:4, wordwrap:{width:config.width*0.3}}).setOrigin(0.5);
            this.couponCodeExp.setText("code exp");
            this.couponCodeExp.setMask(mask);
            this.scratch = this.add.image(0,0,'scratchCard').setOrigin(0.5).setTint(0x94948e);
            this.agrid.placeAtIndex(112,this.scratch);
            Align.scaleToGameH(this.scratch,0.3,this);
            
            this.goBtn = this.add.image(0,0,'goBtn').setOrigin(0.5).setInteractive();
            this.agrid.placeAtIndex(202,this.goBtn);
            Align.scaleToGameW(this.goBtn,0.15,this);
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
            
            this.formutil.scaleToGameW("emailText",0.6);
            this.formutil.placeElementAt(187,"emailText");
            this.formutil.showElement("emailText");
        }
        else
        {
            this.retryBtn = this.add.image(0,0,'retryImg').setOrigin(0.5).setInteractive();
            this.agrid.placeAtIndex(112,this.retryBtn);
            Align.scaleToGameW(this.retryBtn,0.3,this);
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
                game.scene.start('SceneGame2');
                // game.scene.start('SceneGame');
                this.sound.play('BtnClickSfx');
            },this);
        }
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
                        sceneref.scratch.setTint(0xffffff);
                        sceneref.ScratchCardGenerate(sceneref.scratch);
                        sceneref.scratch.setVisible(false);
                    }
                }
            });
        }
        else
        {
            console.log("InValid");
            document.getElementById("emailText").value = "";
        }
    }

    ScratchCardGenerate(scratchback)
    {
        var rt = this.add.renderTexture(scratchback.x-scratchback.displayWidth/2, scratchback.y-scratchback.displayHeight/2, scratchback.displayWidth, scratchback.displayHeight);
        rt.draw('scratchCard',0,0);
        var brush = this.make.image({ key: 'brushImg' }, false).setScale(0.4);
        var offset = {x:brush.displayWidth*1.5,y:brush.displayHeight*1.5};

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
