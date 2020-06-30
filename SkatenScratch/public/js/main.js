var config;
var game;
var fontSettings = {
    mobile16x9:{
        name:"16x9",
        instText:8,
        scoreLifeText:"bold 20px Arial",
        codeText:"bold 20px Arial",
        UICamDiff:1,
        thrustspeed: 0.0475,
        jumpSpeed:-0.875,
        gravity:0.002,
    },
    mobile19x9:{
        name:"19x9",
        instText:8,
        scoreLifeText:"bold 22px Arial",
        codeText:"bold 20px Arial",
        UICamDiff:1,
        thrustspeed: 0.085,
        jumpSpeed:-0.9,
        gravity:0.002,
    },
    mobile4x3:{
        name:"4x3",
        instText:10,
        scoreLifeText:"bold 40px Arial",
        codeText:"bold 20px Arial",
        UICamDiff:1,
        thrustspeed: 0.0475,
        jumpSpeed:-1,
        gravity:0.002,
    },
    pc:{
        name:"pc",
        instText:12,
        scoreLifeText:"bold 30px Arial",
        codeText:"bold 20px Arial",
        UICamDiff:1,
        thrustspeed: 0.0475,
        jumpSpeed:-0.85,
        gravity:0.002,
    } 
}
var currentFont;
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
    }
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
    if(aspect < 0.48)
    {
        //18:9 and 19.5:9 and 18:10
        setting = fontSettings.mobile19x9;
    }
    console.log(setting);
    return setting;
}
