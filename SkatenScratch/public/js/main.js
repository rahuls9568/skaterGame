var config;
var game;
var fontSettings = {
    mobile16x9:{
        name:"16x9",
        instText:10,
        scoreLifeText:"bold 20px Arial",
        codeText:"bold 20px Arial",
        UICamDiff:1,
        thrustspeed: 0.05,
        jumpSpeed:-0.875,
        gravity:0.002,
        scratch:{
            offsetMultiplier:{x:1,y:4}
        }
    },
    mobile19x9:{
        name:"19x9",
        instText:12,
        scoreLifeText:"bold 22px Roboto",
        codeText:"bold 20px Roboto",
        UICamDiff:1,
        thrustspeed: 0.085,
        jumpSpeed:-0.9,
        gravity:0.002,
        scratch:{
            offsetMultiplier:{x:1,y:5}
        }
    },
    mobile4x3:{
        name:"4x3",
        instText:10,
        scoreLifeText:"bold 40px Roboto",
        codeText:"bold 20px Roboto",
        UICamDiff:1,
        thrustspeed: 0.0475,
        jumpSpeed:-1,
        gravity:0.002,
        scratch:{
            offsetMultiplier:{x:3,y:4}
        }
    },
    pc:{
        name:"pc",
        instText:12,
        scoreLifeText:"bold 30px Roboto",
        codeText:"bold 20px Roboto",
        UICamDiff:1,
        thrustspeed: 0.05,
        jumpSpeed:-0.85,
        gravity:0.002,
        scratch:{
            offsetMultiplier:{x:3,y:4}
        }
    } 
}
var currentFont;
var isCenterable = true;
window.onload = function() {
    
}

var isMobile = navigator.userAgent.indexOf("Mobile");
if (isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
}
var w = 640;
var h = 640;
currentFont = fontSettings.pc;
if (isMobile != -1) {
    w = window.innerWidth;
    h = window.innerHeight;
    isCenterable = false;
    currentFont = GetSettings(w,h);
}
var config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'phaser-game',
    scene: [SceneMain,SceneGame2,SceneGameOver,SceneInstruction],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: {
                x: 0,
                y: 1
            }
        }
    },
    // scale: {
    //     parent: 'phaser-game',
    //     autoCenter: isCenterable?Phaser.Scale.CENTER_BOTH:Phaser.Scale.NO_CENTER,
    //     width: w,
    //     height: h
    // },
};
game = new Phaser.Game(config);

function GetSettings(width,height)
{
    setting = fontSettings.pc;
    var aspect = width/height;
    console.log(aspect);
    if(aspect < 0.8)
    {
        //4:3 resolution
        setting = fontSettings.mobile4x3;
    }
    if(aspect < 0.7)
    {
        //16:10 and 16:9
        setting = fontSettings.mobile16x9;
    }
    if(aspect < 0.5625)
    {
        //18:9 and 19.5:9 and 18:10
        setting = fontSettings.mobile19x9;
    }
    console.log(setting);
    return setting;
}