


class SceneGame extends Phaser.Scene
{
    constructor()
    {
        super('SceneGame');
    }

    preload()
    {
        console.log(currentFont);
        this.scene.bringToTop();
        //this.load.image('gamebg','images/assets/BG.jpg');
        // this.load.image('cheeseImg','images/cheese.png');
        // this.load.image('chilliImg','images/chilli.png');
        // this.load.image('flourImg','images/flour.png');
        // this.load.image('oilImg','images/oil.png');
        // this.load.image('tomatoImg','images/tomato.png');
        this.load.image('maidaImg','images/assets/Maida.png')
        this.load.image('virusImg','images/assets/Virus.png')
        this.load.image('preservativeImg','images/assets/Preservatives.png')
        this.load.image('maizeImg','images/assets/Maize.png')
        this.load.image('ragiImg','images/assets/Ragi.png')

        // this.load.image('healthUnitImg','images/health_unit.png')
        // this.load.image('redHalo','images/redhalo.png')
        // this.load.image('yellowHalo','images/yellowHalo.png')

        this.load.atlas('forwardAtlas','images/atlases/Forward-0.png','images/atlases/Forward-0.json');
        this.load.atlas('forward2Atlas','images/atlases/Forward-1.png','images/atlases/Forward-1.json');
        this.load.atlas('jumpAtlas','images/atlases/Jump-0.png','images/atlases/Jump-0.json');
        this.load.atlas('landAtlas','images/atlases/Jump-1.png','images/atlases/Jump-1.json');
        JUMP_SPEED = currentFont.jumpSpeed;
        GRAVITY = currentFont.gravity;
    }

    create()
    {
        this.isTouchFlag = false;
        this.isGameOver = false;
        this.spawnTimer = 0;
        this.gameTimer = 0;
        this.pushTimer = 0;
        this.Vy = 0;
        this.score = 0;
        this.obstacleHitCount = 0;

        this.collectibleGroup = this.add.group();
        this.obstacleGroup = this.add.group();
        this.bgGroup = this.add.group();
        
        this.bg = this.add.image(0,0,'gamebg').setOrigin(0.5);
        this.bg2 = this.add.image(0,0,'gamebg').setOrigin(0.5);
        this.bg2.flipX = true;
        this.player = this.matter.add.sprite(0,0,'forwardAtlas',0).setOrigin(0.5);
        this.player.flipX = true;
        this.player.setBody({
            type: 'rectangle',
            width: 240,
            height: 300
        });
        this.player.body.gravityScale.x = 0;
        this.player.body.gravityScale.y = 0;

        var frameNames = this.textures.get('landAtlas').getFrameNames();
        //console.log(frameNames);
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
        this.player.play('idle');

        
        this.agrid = new AlignGrid({scene:this,rows:15,cols:15});
        //this.agrid.showNumbers();
        
        this.agrid.placeAtIndex(112,this.bg);
        Align.scaleToGameH(this.bg,1,this);
        this.agrid.placeAtIndex(112,this.bg2);
        Align.scaleToGameH(this.bg2,1,this);
        this.bg2.x += this.bg2.displayWidth;
        this.bgGroup.add(this.bg);
        this.bgGroup.add(this.bg2);
        
        this.agrid.placeAtIndex(197,this.player);
        Align.scaleToGameW(this.player,0.2,this);
        baseY = this.player.y;

        this.scoreText = this.add.text(config.width-10,10,"SCORE : 0",{
            font:currentFont.scoreLifeText,
            fill:"#f0ec0e"
        }).setOrigin(1,0);
        
        var lifeText = this.add.text(10,10, 'LIFE :', {
            font: currentFont.scoreLifeText,
            fill: '#000000'
        }).setOrigin(0);
        
        this.lifeArray = new Array(4);
        for (var i = 0; i < this.lifeArray.length; i++) {
            this.lifeArray[i] = this.add.image(this.agrid.getPosByIndex(2+i).x+(i*10), this.agrid.getPosByIndex(2+i).y, 'healthUnitImg').setOrigin(0,0.5);
            //this.agrid.placeAt(2+(i*1),this.lifeArray[i]);
            Align.scaleToGameW(this.lifeArray[i],0.1,this);
        }

        BKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
            this.CheckPlayerCollectibleCollision(bodyA.gameObject, bodyB.gameObject);
            this.CheckPlayerObstacleCollision(bodyA.gameObject, bodyB.gameObject);
        }, this);
    }

    update()
    {
        if(this.isGameOver === false)
        {
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
                var text = this.add.text(config.width/2,config.height/2,"SUCCESS",{font:"bold 40px Arial",fill:"#d9d900",align:"center"}).setOrigin(0.5)
                this.time.delayedCall(750,this.destroyObject,[[text]],this);
            }
            this.time.delayedCall(1000,()=>{
                game.scene.start('SceneGameOver');
            },this);
            //game.scene.start('SceneGameOver');
            this.player.play('idle');
            this.isGameOver = null;
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

    SetText(scoreInc)
    {
        this.score += scoreInc;
        this.scoreText.setText("SCORE : " + this.score);
    }

    CheckGameTime()
    {
        this.gameTimer += game.loop.delta;
        if(this.gameTimer > GAME_TIME)
        {
            GAME_OVER_TYPE = "WIN";
            this.isGameOver=true;
        }
    }

    CheckInput()
    {
        if (this.isTouchFlag == false && (this.input.pointer1.isDown || BKey.isDown))
        {
            //console.log("JUMP!");
            this.isTouchFlag = true;
            this.Vy = JUMP_SPEED;
            this.player.play('jumpAnim');
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
            if(this.player.y > baseY && this.player.anims.currentAnim.key == "landAnim")
            {
                //console.log("GROUNDED");
                this.player.y = baseY;
                this.player.play('idle');
                this.Vy = 0;
                this.isTouchFlag = false;
            }
        }
    }

    Move()
    {
        this.bgGroup.children.each(function (b){
            if(b!= null)
            {
                b.x -= BG_MOVE_SPEED;
                if(b.x + b.displayWidth/2 < 0)
                {
                    b.x = config.width + b.displayWidth/2;
                }
            }
        })

        this.collectibleGroup.children.each(function (b) {
            if(b != null)
            {
                if (b.active) {
                    if ( b.x + b.displayWidth/2 > 0) {
                        // console.log("bullet out of bounds");
                        b.x-= OBJ_MOVE_SPEED;
                    }
                    else
                    {
                        b.active = false;
                        this.collectibleGroup.remove(b,true,true);
                    }
                }
            }
            else
            {
                this.collectibleGroup.remove(b,true,true);
            }
        }.bind(this));

        this.obstacleGroup.children.each(function (b) {
            if(b != null)
            {
                if (b.active) {
                    if ( b.x + b.displayWidth/2 > 0) {
                        b.x-=OBJ_MOVE_SPEED;
                    }
                    else
                    {
                        b.active = false;
                        this.obstacleGroup.remove(b,true,true);
                    }
                }
            }
            else
            {
                this.obstacleGroup.remove(b,true,true);
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
                var halo = this.add.image(0,0,'yellowHalo').setOrigin(0.5);
                this.agrid.placeAtIndex(rnd < 50 ? topRow:botRow,halo);
                Align.scaleToGameW(halo,0.1,this);
                this.collectibleGroup.add(halo);
                switch(rng)
                {
                    case 0:
                        obj = this.matter.add.image(0,0,'maizeImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 120,
                            height: 120
                        });
                        break;
                    case 1:
                        obj = this.matter.add.image(0,0,'ragiImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 640,
                            height: 640
                        });
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
                obj.setCollisionGroup(-1);
                obj.setSensor(true);
                obj.body.gravityScale.x = 0;
                obj.body.gravityScale.y = 0;
                this.agrid.placeAtIndex(rnd<50?topRow:botRow,obj);
                Align.scaleToGameW(obj,0.075,this);
                this.collectibleGroup.add(obj);
                obj.x += 50;
                halo.x += 50;
            }
            else
            {
                //Spawn Obstacle
                var rng = Math.floor(Math.random()*2);
                var obj;
                var halo = this.add.image(0,0,'redHalo').setOrigin(0.5);
                this.agrid.placeAtIndex(botRow,halo);
                Align.scaleToGameW(halo,0.15,this);
                this.obstacleGroup.add(halo);
                switch(rng)
                {
                    case 0:
                        obj = this.matter.add.image(0,0,'maidaImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 240,
                            height: 300
                        });
                        break;
                    case 1:
                        obj = this.matter.add.image(0,0,'virusImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 240,
                            height: 300
                        });
                        break;
                    case 2:
                        obj = this.matter.add.image(0,0,'preservativesImg').setOrigin(0.5);
                        obj.setBody({
                            type: 'rectangle',
                            width: 240,
                            height: 300
                        });
                        break;
                }
                obj.setCollisionGroup(-1);
                obj.setSensor(true);
                obj.body.gravityScale.x = 0;
                obj.body.gravityScale.y = 0;
                this.agrid.placeAtIndex(botRow,obj);
                Align.scaleToGameW(obj,0.09,this);
                this.obstacleGroup.add(obj);
                obj.x += 50;
                halo.x += 50;
            }
        }
    }

    CheckPlayerCollectibleCollision(bodyA, bodyB) {
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
                var text = this.add.text(collectible.x, collectible.y-20,"+5",{ font: 'bold 35px Arial', color: '#f0ec0e', wordWrap: { width: 200 } }).setOrigin(0.5);
                this.tweens.add({
                    targets: text,
                    duration: 1000,
                    y:this.scoreText.y,
                });
                this.tweens.add({
                    targets : text,
                    duration: 900,
                    x: this.scoreText.x,
                });
                this.time.delayedCall(1000,this.destroyObject,[[text]],this);
                this.time.delayedCall(1000,this.scoreObject,[[5]],this);

                
                //this.SetText(5);
                collectible.setActive(false);
                collectible.setVisible(false);
                var halo = this.collectibleGroup.getFirst(true,false,collectible.x,collectible.y);
                halo.setActive(false);
                halo.setVisible(false);
                halo.destroy();
                halo = null;
                collectible.destroy();
                collectible = null;
            }
        }
    }

    CheckPlayerObstacleCollision(bodyA, bodyB) {
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
                var halo = this.obstacleGroup.getFirst(true,false,collectible.x,collectible.y);
                halo.setActive(false);
                halo.setVisible(false);
                halo.destroy();
                halo = null;
                collectible.destroy();
                collectible = null;
                this.UpdateLife();
                
            }
        }
    }

    UpdateLife() {
        this.lifeArray.pop().setVisible(false);
        if(this.lifeArray.length == 0)
        {
            this.isGameOver = true;
            // GAME_OVER_TYPE = "WIN";
            GAME_OVER_TYPE = "FAILED";
        }
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
            console.log("destroy  " + objArray[i]);
            objArray[i].destroy();
        }
    }
}