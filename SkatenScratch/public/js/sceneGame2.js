var topRow = 119, botRow = 134;
var BKey;
var baseY;
const OBJ_MOVE_SPEED = 3, BG_MOVE_SPEED = 3;
const GAME_TIME = 60000, SPAWN_TIME = 1000, PUSH_TIME = 1500;
var DIFF = 0;
var JUMP_SPEED = 0, GRAVITY = 0, THRUST_SPEED = 0;
var GAME_OVER_TYPE = "FAILED";
var shapes = null;
var BACK_X = 0;
var oil1dist = 0, oil2dist = 0;
class SceneGame2 extends Phaser.Scene
{
    constructor()
    {
        super("SceneGame2");
    }

    preload()
    {
        console.log("preload");
        this.scene.bringToTop();
        this.load.image('maidaImg','images/assets/Maida.png')
        this.load.image('virusImg','images/assets/Virus.png')
        this.load.image('preservativeImg','images/assets/Preservatives.png')
        this.load.image('maizeImg','images/assets/Maize.png')
        this.load.image('ragiImg','images/assets/Ragi.png')
        this.load.image('crunchaFace','images/Game UI/assets/cruncha-badge.png')
        this.load.image('lifex','images/Game UI/assets/life-x.png')
        this.load.image('num1','images/Game UI/assets/no-01.png')
        this.load.image('num2','images/Game UI/assets/no-02.png')
        this.load.image('num3','images/Game UI/assets/no-03.png')
        this.load.image('num4','images/Game UI/assets/no-04.png')
        this.load.image('star','images/Game UI/assets/cruncha-badge.png')

        this.load.image('oilmessage','images/Game UI/Oil-ahead-text.png');
        this.load.image('bengalgrammessage','images/Game UI/bengal-gram-text.png');
        this.load.image('maizemessage','images/Game UI/maiz-text.png');

        this.load.atlas('forwardAtlas','images/atlases/Forward-0.png','images/atlases/Forward-0.json');
        this.load.atlas('forward2Atlas','images/atlases/Forward-1.png','images/atlases/Forward-1.json');
        this.load.atlas('jumpAtlas','images/atlases/Jump-0.png','images/atlases/Jump-0.json');
        this.load.atlas('landAtlas','images/atlases/Jump-1.png','images/atlases/Jump-1.json');

        this.load.json("physics", "images/assets/skatePhysics3.json");

        this.load.audio('gameHitSfx','audio/wrong.mp3');
        this.load.audio('gameDingSfx','audio/ding.mp3');
    }
    
    create()
    {
        shapes = this.cache.json.get('physics');
        this.isTouchFlag = false;
        this.isGameOver = false;
        this.spawnTimer = 0;
        this.gameTimer = 0;
        this.pushTimer = 0;
        this.Vy = 0;
        this.score = 0;
        this.obstacleHitCount = 0;
        this.IsplayerGrounded = false;
        this.resetFlag = false;
        this.resetTimer = 0;

        this.collectibleGroup = this.add.group();
        this.RagiGroup = this.add.group();
        this.obstacleGroup = this.add.group();
        this.bgGroup = this.add.group();
        this.bgDropGroup = this.add.group();
        this.uiGroup = this.add.group();
        this.bgArray = new Array(0);

        this.cam = this.cameras.main;
        JUMP_SPEED = currentFont.jumpSpeed;
        GRAVITY = currentFont.gravity;
        THRUST_SPEED = currentFont.thrustspeed;
        //console.log(this.cam);
        this.behindBG = this.add.image(0,0,'gamebg').setOrigin(0.0);
        this.bg = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_path});
        this.bg2 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_path});            //,render: { sprite: { xOffset: 100, yOffset: 125 } }
        this.bg3 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_drop}).setActive(true).setVisible(false);
        this.bg4 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_drop}).setActive(true).setVisible(false);
        this.oilmessage1 = this.add.image(0,0,'oilmessage').setOrigin(0.5);
        this.oilmessage2 = this.add.image(0,0,'oilmessage').setOrigin(0.5);
        
        this.agrid = new AlignGrid({scene:this,rows:15,cols:15});
        //this.agrid.showNumbers();

        this.agrid.placeAtIndex(110,this.oilmessage2);
        Align.scaleToGameH(this.oilmessage2,0.2,this);
        
        this.agrid.placeAtIndex(110,this.oilmessage1);
        Align.scaleToGameH(this.oilmessage1,0.2,this);
        ///////////////////.......BACKGROUNDS......\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        // this.bg = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_path});
        //this.agrid.placeAtIndex(112,this.bg);

        Align.scaleToGameH(this.behindBG,1,this);

        Align.scaleToGameH(this.bg,1,this);
        this.bg.setPosition(0 + this.bg.centerOfMass.x, config.height*0.865 + this.bg.centerOfMass.y);
        this.bg.body.gravityScale.x = 0;
        this.bg.body.gravityScale.y = 0;
        //console.log(this.bg);
        // this.bg2 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_path});            //,render: { sprite: { xOffset: 100, yOffset: 125 } }
        // this.agrid.placeAtIndex(90,this.bg2);
        Align.scaleToGameH(this.bg2,1,this);
        this.bg2.setPosition(this.cam.scrollX + this.bg.displayWidth + this.bg2.centerOfMass.x, config.height*0.865+ this.bg2.centerOfMass.y);
        this.bg2.body.gravityScale.x = 0;
        this.bg2.body.gravityScale.y = 0;
        this.oilmessage2.x+=this.bg.displayWidth;
        //BACK_X = this.bg.displayWidth+this.bg2.centerOfMass.x;

        // this.bg3 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_drop}).setActive(true).setVisible(false);
        Align.scaleToGameH(this.bg3,1,this);
        this.bg3.setPosition(-this.bg3.displayWidth*0.107 + this.bg3.centerOfMass.x, config.height*0.9 + this.bg3.centerOfMass.y)
        this.bg3.body.gravityScale.x = 0;
        this.bg3.body.gravityScale.y = 0;
        
        // this.bg4 = this.matter.add.sprite(0,0,'gamebg',null,{shape:shapes.bg_drop}).setActive(true).setVisible(false);
        Align.scaleToGameH(this.bg4,1,this);
        this.bg4.setPosition(this.bg.displayWidth - this.bg4.displayWidth*0.107+ this.bg4.centerOfMass.x, config.height*0.9 + this.bg4.centerOfMass.y)
        this.bg4.body.gravityScale.x = 0;
        this.bg4.body.gravityScale.y = 0;

        this.bg.x += this.bg.displayWidth/2;
        this.bg2.x += this.bg2.displayWidth/2;
        this.bg3.x += this.bg3.displayWidth/2;
        this.bg4.x += this.bg4.displayWidth/2;
        this.bgGroup.add(this.bg);
        this.bgGroup.add(this.bg2);
        this.bgDropGroup.add(this.bg3);
        this.bgDropGroup.add(this.bg4);
        

        //ANIMATIONS
        this.anims.create({
            key: 'forward1Anim',
            repeat: 0,
            frameRate: 8,
            frames: [
                { key: 'forwardAtlas',frame:"Forward_5" },
                { key: 'forwardAtlas',frame:"Forward_4" },
                { key: 'forwardAtlas',frame:"Forward_3" },
            ],
        });
        this.anims.create({
            key: 'forward2Anim',
            repeat: 0,
            frameRate: 8,
            frames: [
                { key: 'forward2Atlas',frame:"Forward_2" },
                { key: 'forward2Atlas',frame:"Forward_1" },
                { key: 'forward2Atlas',frame:"Forward_6" },
            ],
        });
        this.anims.create({
            key: 'jumpAnim',
            repeat: 0,
            frameRate: 8,
            frames: [
                { key: 'jumpAtlas',frame:"Jump_5" },
                { key: 'jumpAtlas',frame:"Jump_6" },
                { key: 'jumpAtlas',frame:"Jump_4" },
                { key: 'jumpAtlas',frame:"Jump_7" },
            ],
        });
        this.anims.create({
            key: 'landAnim',
            repeat: 0,
            frameRate: 8,
            frames: [
                { key: 'landAtlas',frame:"Jump_3" },
                { key: 'landAtlas',frame:"Jump_8" },
                { key: 'landAtlas',frame:"Jump_1" },
                { key: 'landAtlas',frame:"Jump_2" },
                { key: 'landAtlas',frame:"Jump_9" },
            ],
        });
        this.anims.create({
            key: 'idle',
            repeat: -1,
            frameRate: 8,
            frames: [
                { key: 'landAtlas',frame:"Jump_9" },
            ]
        });

        //SETTING PLAYER
        this.player = this.matter.add.sprite(0,0,'forwardAtlas',0).setOrigin(0.5);
        this.player.flipX = true;
        this.player.setBody({
            type: 'circle',
            width: 240,
            height: 300
        });
        this.agrid.placeAtIndex(106,this.player);
        Align.scaleToGameH(this.player,0.15,this);
        this.player.play('idle');

        //SETTING UI ELEMENTS
        this.currentLife = 4;
        var face = this.add.image(0,0,'crunchaFace').setOrigin(0.25);
        this.agrid.placeAtIndex(0,face);
        Align.scaleToGameH(face,0.1,this)
        this.uiGroup.add(face);
        var x = this.add.image(0,0,'lifex').setOrigin(0);
        this.agrid.placeAtIndex(1,x);
        Align.scaleToGameH(x,0.05,this)
        x.x+=10;
        this.uiGroup.add(x);
        this.no_Array = new Array(4);
        this.lifeArray = new Array(4);
        for(var i = 0; i < 4; i++)
        {
            this.no_Array[i] = this.add.image(0,0,"num"+(i+1)).setOrigin(0).setVisible(false);
            this.lifeArray[i] = this.add.image(0,0, 'star').setOrigin(0);
            this.agrid.placeAtIndex(17+i,this.lifeArray[i]);
            this.agrid.placeAtIndex(2,this.no_Array[i]);
            this.lifeArray[i].x+=(i*10)
            Align.scaleToGameH(this.lifeArray[i],0.05,this);
            Align.scaleToGameH(this.no_Array[i],0.05,this);
            this.uiGroup.add(this.lifeArray[i]);
            this.uiGroup.add(this.no_Array[i]);
        }
        this.no_Array[this.currentLife-1].setVisible(true);
        this.scoreText = this.add.text(config.width - 30, 5,"00",{
            font:currentFont.scoreLifeText,
            fill:"#f0ec0e",
            align:"right"
        }).setOrigin(1,0);
        var scoreLabel = this.add.text(config.width-30,40,"SCORE",{
            font:currentFont.scoreLifeText,
            fill:"#FFFFFF",
            align:"right"
        }).setOrigin(1,0);
        this.uiGroup.add(this.scoreText);
        this.uiGroup.add(scoreLabel);

        BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            this.CheckPlayerCollectibleCollision(bodyA.gameObject, bodyB.gameObject);
            this.CheckPlayerObstacleCollision(bodyA.gameObject, bodyB.gameObject);
            this.CheckPlayerGroundCollision(bodyA.gameObject,bodyB.gameObject);
            this.CheckPlayerDropCollision(bodyA.gameObject, bodyB.gameObject);
            this.CheckPlayerRagiCollision(bodyA.gameObject,bodyB.gameObject);
            this.CheckObjectBgCollision(bodyA.gameObject,bodyB.gameObject);
        }, this);
        this.matter.world.on('collisionend',function(event, bodyA,bodyB){
            this.CheckPlayerBgEndCollision(bodyA.gameObject,bodyB.gameObject);
        },this)
        this.matter.world.on('collisionactive',function(event,bodyA,bodyB){
            //this.CheckObjectBgCollision(bodyA.gameObject,bodyB.gameObject);
        },this)

        
        this.player.body.gravityScale.x = 0;
        this.player.body.gravityScale.y = 0;
        this.IsplayerGrounded = false;
        this.isTouchFlag = true;
        this.Vy = 0;
        this.player.play('landAnim');

        console.log(this.bg.x + "\t"+ this.oilmessage1.x)
        console.log(this.bg.x-this.oilmessage1.x)
        oil1dist = this.bg.x-this.oilmessage1.x;
        oil2dist = this.bg2.x-this.oilmessage2.x;
    }

    update()
    {
        if(this.isGameOver === false)
        {
            if(this.resetFlag)
            {
                this.player.body.gravityScale.x = 0;
                this.player.body.gravityScale.y = 0;
                this.resetTimer+=game.loop.delta;
                if(this.resetTimer>=750)
                {
                    this.resetTimer = 0;
                    this.resetFlag = false;
                    this.player.y = this.agrid.getPosByIndex(62).y;
                    this.player.body.gravityScale.x = 0;
                    this.player.body.gravityScale.y = 0;
                    this.IsplayerGrounded = false;
                    this.isTouchFlag = true;
                    this.Vy = JUMP_SPEED/2;
                }
                return;
            }
            this.Spawner();
            this.Move();
            this.CheckInput();
            this.CheckGameTime();
            this.PushSkateBoard();
        }
        else if(this.isGameOver === true)
        {
            if(GAME_OVER_TYPE == "WIN")
            {
                var text = this.add.text(this.cam.scrollX + config.width/2,config.height/2,"SUCCESS",{fontFamily:"myFont",fontSize:40,fill:"#d9d900",align:"center"}).setOrigin(0.5)
                this.time.delayedCall(1250,this.destroyObject,[[text]],this);
            }
            this.MovePLayer();
            this.time.delayedCall(2000,()=>{
                game.scene.start('SceneGameOver');
            },this);
            //game.scene.start('SceneGameOver');
            this.player.play('idle');
            this.isGameOver = null;
        }
        else
        {
            if(this.player.x > this.cam.scrollX + this.cam.width + 75)
                return;
            if(GAME_OVER_TYPE == "WIN")
            {
                if(this.isTouchFlag)
                {
                    this.player.y += game.loop.delta * this.Vy;
                    this.Vy += game.loop.delta * GRAVITY;
                    if(this.Vy > 0 && this.player.anims.currentAnim.key == "jumpAnim")
                    {
                        //console.log("LAND");
                        this.player.play('landAnim');
                    }
                }
                this.MovePLayer();
            }
            else
            {
                this.player.setVelocity(0);
                this.player.setAngularVelocity(0);
                this.player.setAngle(0);
            }
        }
    }

    PushSkateBoard()
    {
        if(this.player.anims.currentAnim.key =="idle")
        {
            this.pushTimer+=game.loop.delta;
            if(this.pushTimer > PUSH_TIME)
            {
                this.player.play('forward1Anim');
                this.player.once('animationcomplete',()=>{
                    this.player.play('idle');
                    this.pushTimer = 0;
                },this);
                this.pushTimer = 0;

            }
        }
    }

    CheckGameTime()
    {
        this.gameTimer += game.loop.delta;
        if(this.gameTimer > GAME_TIME)
        {
            GAME_OVER_TYPE = "WIN";
            this.isGameOver=true;
            this.collectibleGroup.clear(true,true);
            this.RagiGroup.clear(true,true);
            this.obstacleGroup.clear(true,true);
        }
    }

    CheckInput()
    {
        if (this.IsplayerGrounded && this.isTouchFlag == false && (this.input.pointer1.isDown || BKey.isDown))
        {
            //console.log("JUMP!");
            this.player.body.gravityScale.x = 0;
            this.player.body.gravityScale.y = 0;
            this.IsplayerGrounded = false;
            this.isTouchFlag = true;
            this.Vy = JUMP_SPEED;
            this.player.play('jumpAnim');
            //this.player.once("animationcomplete",()=>{this.player.play("landAnim")},this)
        }
        if(this.isTouchFlag == true)
        {
            //console.log(this.Vy + "\n" + this.player.anims.currentAnim.key)
            this.player.y += game.loop.delta * this.Vy;
            this.Vy += game.loop.delta * GRAVITY;
            if(this.Vy > 0 && this.player.anims.currentAnim.key == "jumpAnim")
            {
                //console.log("LAND");
                this.player.play('landAnim');
            }
            // if(this.player.y > baseY && this.player.anims.currentAnim.key == "landAnim")
            // {
            //     //console.log("GROUNDED");
            //     this.player.y = baseY;
            //     this.player.play('idle');
            //     this.Vy = 0;
            //     this.isTouchFlag = false;
            // }
        }
        // if(this.IsplayerGrounded)
        // {
        //     GRAVITY = currentFont.idleGravity;
        //     this.player.y += game.loop.delta * GRAVITY
        //     console.log("here\n" + GRAVITY + "    " + this.player.y);
        // }
    }

    MovePLayer()
    {
        this.player.setVelocity(0);
        this.player.setAngularVelocity(0);
        this.player.setAngle(0);
        this.player.thrust(THRUST_SPEED);
    }

    Move()
    {
        var prevPos = this.cam.scrollX;
        this.MovePLayer();
        //this.player.x += 7;
        if(!this.resetFlag)
            this.cam.scrollX = this.player.x - 50;
        
        this.bgGroup.children.each(function (b){
            if(b!= null)
            {
                //b.x -= BG_MOVE_SPEED;
                if(b.x + b.displayWidth < this.cam.scrollX)
                {
                    b.x = this.cam.scrollX -(4*Math.abs(this.cam.scrollX-prevPos)) + b.centerOfMass.x + b.displayWidth;
                    this.oilmessage1.x = this.bg.x - oil1dist;
                    this.oilmessage2.x = this.bg2.x - oil2dist;
                }
            }
        }.bind(this))

        this.bgDropGroup.children.each(function (b){
            if(b!= null)
            {
                //b.x -= BG_MOVE_SPEED;
                if(b.x + b.displayWidth < this.cam.scrollX)
                {
                    b.x = this.cam.scrollX + b.centerOfMass.x + b.displayWidth;
                }
            }
        }.bind(this))

        // if(this.bg.x+this.bg.displayWidth < this.cam.scrollX)
        // {
        //     this.bg.x = this.bg.centerOfMass.x + this.bg2.x+this.bg2.displayWidth;
        //     this.bg3.x = this.bg.x -this.bg3.displayWidth*0.107 + this.bg3.centerOfMass.x
        // }
        // if(this.bg2.x+this.bg2.displayWidth < this.cam.scrollX)
        // {
        //     this.bg2.x = this.bg2.centerOfMass.x + this.bg.x+this.bg.displayWidth;
        //     this.bg4.x = this.bg2.x - this.bg4.displayWidth*0.107+ this.bg4.centerOfMass.x
        // }

        this.collectibleGroup.children.each(function (b) {
            if(b != null)
            {
                if (b.active) {
                    if ( b.x + b.displayWidth/2 < this.cam.scrollX) {
                        // console.log("bullet out of bounds");
                        //b.x-= OBJ_MOVE_SPEED;
                        b.active = false;
                        this.collectibleGroup.remove(b,true,true);
                    }
                    else
                    {

                    }
                }
            }
            else
            {
                this.collectibleGroup.remove(b,true,true);
            }
        }.bind(this));

        this.RagiGroup.children.each(function (b) {
            if(b != null)
            {
                if (b.active) {
                    if ( b.x + b.displayWidth/2 < this.cam.scrollX) {
                        // console.log("bullet out of bounds");
                        //b.x-= OBJ_MOVE_SPEED;
                        b.active = false;
                        this.collectibleGroup.remove(b,true,true);
                    }
                    else
                    {

                    }
                }
            }
            else
            {
                this.RagiGroup.remove(b,true,true);
            }
        }.bind(this));

        this.obstacleGroup.children.each(function (b) {
            if(b != null)
            {
                if (b.active) {
                    if ( b.x + b.displayWidth/2 < this.cam.scrollX) {
                        // b.x-=OBJ_MOVE_SPEED;
                        b.active = false;
                        this.obstacleGroup.remove(b,true,true);
                    }
                    else
                    {
                    }
                }
            }
            else
            {
                this.obstacleGroup.remove(b,true,true);
            }
        }.bind(this));
        
        
        this.uiGroup.children.each(function (b)
        {
            if(b != null)
            {
                if(!this.resetFlag)
                    b.x += Math.abs(prevPos - this.cam.scrollX) > currentFont.UICamDiff? Math.abs(prevPos - this.cam.scrollX): 0;
            }
        }.bind(this));
    }

    Spawner()
    {
        this.spawnTimer += game.loop.delta;
        if(this.spawnTimer >= SPAWN_TIME)
        {
            this.spawnTimer = 0;
            if(Math.random()*100 < 70)
            {
                //Spawn Collectible
                var rng = Math.floor(Math.random()*2);
                var obj;
                var rnd = Math.random()*100;
                
                switch(rng)
                {
                    case 0:
                        obj = this.matter.add.image(0,0,'maizeImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 120,
                            height: 120
                        });
                        Align.scaleToGameH(obj,0.15,this);
                        this.collectibleGroup.add(obj);
                        
                        break;
                    case 1:
                        obj = this.matter.add.image(0,0,'ragiImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 640,
                            height: 640
                        });
                        Align.scaleToGameH(obj,0.18,this);
                        this.RagiGroup.add(obj);
                        break;
                    // case 2:
                    //     obj = this.matter.add.image(0,0,'tomatoImg').setOrigin(0.5);
                    //     obj.setBody({
                    //         type: 'rectangle',
                    //         width: 240,
                    //         height: 240
                    //     });
                    //     break;
                }
                obj.setCollisionGroup(0);
                obj.setSensor(true);
                this.agrid.placeAtIndex(rnd<50?topRow:botRow,obj);
                obj.x = this.cam.scrollX + this.cam.width + 50;
                obj.body.gravityScale.x = 0;
                obj.body.gravityScale.y = 0;
            }
            else
            {
                
                //Spawn Obstacle
                var rng = Math.floor(Math.random()*3);
                var obj;
                
                switch(rng)
                {
                    case 0:
                        obj = this.matter.add.image(0,0,'maidaImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 240,
                            height: 300
                        });
                        Align.scaleToGameH(obj,0.15,this);
                        break;
                    case 1:
                        obj = this.matter.add.image(0,0,'virusImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 240,
                            height: 240
                        });
                        Align.scaleToGameH(obj,0.15,this);
                        break;
                    case 2:
                        //console.log("spawnPres")
                        obj = this.matter.add.image(0,0,'preservativeImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 160,
                            height: 160
                        });
                        Align.scaleToGameH(obj,0.15,this);
                        break;
                }
                obj.setCollisionGroup(0);
                obj.setSensor(true);
                this.agrid.placeAtIndex(botRow,obj);
                this.obstacleGroup.add(obj);
                obj.x = this.cam.scrollX + this.cam.width + 50;
                obj.body.gravityScale.x = 0;
                obj.body.gravityScale.y = 0;
            }
        }
    }

    CheckPlayerBgEndCollision(bodyA, bodyB)
    {
        if(bodyA == null || bodyB == null)
            return;
        if((bodyA == this.player && this.bgGroup.contains(bodyB)) || (bodyB == this.player && this.bgGroup.contains(bodyA)))
        {
            if(this.isGameOver == false)
            {

                if(!this.isTouchFlag)
                {
                    //console.log('player falls');
                    this.player.body.gravityScale.x = 0;
                    this.player.body.gravityScale.y = 10;
                }
            }
            else
            {
                this.player.body.gravityScale.x = 0;
                this.player.body.gravityScale.y = 5;
            }
        }
    }
    
    CheckObjectBgCollision(bodyA,bodyB)
    {
        if(bodyA == null || bodyB == null)
            return;
        var obj;
        if((this.bgGroup.contains(bodyA) && (this.collectibleGroup.contains(bodyB)||this.obstacleGroup.contains(bodyB))))
        {
            obj = bodyB;
        }
        if((this.bgGroup.contains(bodyB) && (this.collectibleGroup.contains(bodyA)||this.obstacleGroup.contains(bodyA))))
        {
            obj = bodyA;
        }
        if(obj)
        {
            //obj.y-=2;
            obj.setActive(false);
            obj.setVisible(false);
            obj.destroy();
            obj = null;
        }
    }

    CheckPlayerGroundCollision(bodyA,bodyB)
    {
        if(bodyA == null || bodyB == null)
            return;
        if((bodyA == this.player && this.bgGroup.contains(bodyB)) || (bodyB == this.player && this.bgGroup.contains(bodyA)))
        {
            if(this.IsplayerGrounded == true)
                return;
            //console.log('player grounded');
            this.player.play('idle');
            this.player.body.gravityScale.x = 1;
            this.player.body.gravityScale.y = 5;
            this.Vy = 0;
            this.isTouchFlag = false;
            this.IsplayerGrounded = true;
        }   
    }

    CheckPlayerDropCollision(bodyA,bodyB)
    {
        if(this.isGameOver == false)
        {
            if(bodyA == null || bodyB == null)
                return;
            if((bodyA == this.player && this.bgDropGroup.contains(bodyB)) || (bodyB == this.player && this.bgDropGroup.contains(bodyA)))
            {
                if(!this.resetFlag)
                {
                    this.player.setVelocity(0);
                    this.player.setAngularVelocity(0);
                    this.player.setAngle(0);
                    this.player.body.gravityScale.x = 0;
                    this.player.body.gravityScale.y = 0;
                    //console.log('player reset');
                    this.player.play('idle');
                    this.UpdateLife();
                    this.resetFlag = true;
                    
                    this.sound.play('gameHitSfx');
                    
                    // this.isGameOver=true;
                    // GAME_OVER_TYPE = "WIN"
                }
            }
        }
    }

    CheckPlayerCollectibleCollision(bodyA, bodyB) {
        if(this.isGameOver != false)
            return;
        if(bodyA == null || bodyB == null)
            return;
        var collectible;
        if (bodyA.active && bodyA.visible && bodyB.active && bodyB.visible) {
            if (this.collectibleGroup.contains(bodyA) && bodyB == this.player) {
                collectible = bodyA;
            } else if (this.player == bodyA && this.collectibleGroup.contains(bodyB)) {
                collectible = bodyB;
            }

            if(collectible)
            {
                var text = this.add.text(collectible.x, collectible.y-20,"+10",{ font: 'bold 35px myFont', color: '#f0ec0e', wordWrap: { width: 200 } }).setOrigin(0.5);
                var notice = this.add.image(collectible.x+30,collectible.y-50, 'maizemessage');
                Align.scaleToGameH(notice,0.2,this);
                this.tweens.add({
                    targets: text,
                    duration: 900,
                    y:this.cam.scrollY,
                });
                this.tweens.add({
                    targets : text,
                    duration: 900,
                    x: this.cam.scrollX+this.cam.width,
                });
                this.time.delayedCall(1000,this.destroyObject,[[text,notice]],this);
                this.time.delayedCall(1000,this.scoreObject,[[10]],this);

                collectible.setActive(false);
                collectible.setVisible(false);
                collectible.destroy();
                collectible = null;
                
                this.sound.play('gameDingSfx');
            }
        }
    }

    CheckPlayerRagiCollision(bodyA, bodyB) {
        if(this.isGameOver != false)
            return;
        if(bodyA == null || bodyB == null)
            return;
        var collectible;
        if (bodyA.active && bodyA.visible && bodyB.active && bodyB.visible) {
            if (this.RagiGroup.contains(bodyA) && bodyB == this.player) {
                collectible = bodyA;
            } else if (this.player == bodyA && this.RagiGroup.contains(bodyB)) {
                collectible = bodyB;
            }

            if(collectible)
            {
                var text = this.add.text(collectible.x, collectible.y-20,"+10",{ font: 'bold 35px myFont', color: '#f0ec0e', wordWrap: { width: 200 } }).setOrigin(0.5);
                var notice = this.add.image(collectible.x+30,collectible.y-50, 'bengalgrammessage');
                Align.scaleToGameH(notice,0.2,this);
                this.tweens.add({
                    targets: text,
                    duration: 900,
                    y:this.cam.scrollY,
                });
                this.tweens.add({
                    targets : text,
                    duration: 900,
                    x: this.cam.scrollX+this.cam.width,
                });
                this.time.delayedCall(1000,this.destroyObject,[[text,notice]],this);
                this.time.delayedCall(1000,this.scoreObject,[[10]],this);

                collectible.setActive(false);
                collectible.setVisible(false);
                collectible.destroy();
                collectible = null;
                
                this.sound.play('gameDingSfx');
            }
        }
    }

    CheckPlayerObstacleCollision(bodyA, bodyB) {
        if(this.isGameOver != false)
            return;
        if(bodyA == null || bodyB == null)
            return;
        var collectible;
        if (bodyA.active && bodyA.visible && bodyB.active && bodyB.visible) {
            if (this.obstacleGroup.contains(bodyA) && bodyB == this.player) {
                collectible = bodyA;
            } else if (this.player == bodyA && this.obstacleGroup.contains(bodyB)) {
                collectible = bodyB;
            }

            if(collectible)
            {
                this.obstacleHitCount++;
                collectible.setActive(false);
                collectible.setVisible(false);
                // var halo = this.obstacleGroup.getFirst(true,false,collectible.x,collectible.y);
                // halo.setActive(false);
                // halo.setVisible(false);
                // halo.destroy();
                // halo = null;
                collectible.destroy();
                collectible = null;
                this.UpdateLife();
                
                this.sound.play('gameHitSfx');
                
            }
        }
    }

    UpdateLife() {
        this.lifeArray.pop().setVisible(false);
        this.no_Array[this.currentLife-1].setVisible(false);
        this.currentLife--;
        if(this.lifeArray.length == 0)
        {
            this.isGameOver = true;
            
            // GAME_OVER_TYPE = "WIN";
            GAME_OVER_TYPE = "FAILED";
            return;
        }
        this.no_Array[this.currentLife-1].setVisible(true);
    }

    scoreObject(array)
    {
        for(var i = 0; i < array.length; i++)
        {
            this.SetText(array[i]);
        }
    }

    destroyObject(objArray)
    {
        for(var i = 0; i < objArray.length; i++)
        {
            //console.log("destroy  " + objArray[i]);
            objArray[i].destroy();
        }
    }

    SetText(scoreInc)
    {
        this.score += scoreInc;
        this.scoreText.setText("" + this.score);
    }
}