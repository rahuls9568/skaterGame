<!DOCTYPE html>
<html lang="">
<head>
    <meta name="viewport" content="user-scalable=0, initial-scale=1,minimum-scale=1, maximum-scale=1, width=device-width, minimal-ui=1">
    <meta charset="UTF-8">
    <title></title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script src="js/phaser.min.js"></script>
    <script type="text/javascript" src="js/util/UIBlock.js"></script>
	<script type="text/javascript" src="js/util/align.js"></script>
	<script type="text/javascript" src="js/util/alignGrid.js"></script>
	<script type="text/javascript" src="js/util/formUtil.js"></script>
    <script src="js/sceneMain.js"></script>
    <script src="js/sceneGame.js"></script>
    <script src="js/sceneGame2.js"></script>
    <script src="js/sceneInstruction.js"></script>
    <script src="js/sceneGameOver.js"></script>
    <script src="js/main.js"></script>
    <style>
        #phaser-game
        {
            background-color: #46357b;
            color: chartreuse;
            width: 100%;
            height: 100%;
            margin-top: -8px;
            margin-left: -8px;
            padding: 0px;
            border: 0px;
        }
    </style>
    <style media='screen' type='text/css'>
        @font-face {
          font-family: myFont;
          src: url('fonts/Carton_Six.ttf');
          font-weight:400;
          font-weight:normal;
        }
        @font-face {
          font-family: Roboto;
          src: url('fonts/Roboto-Regular.ttf');
          font-weight:400;
          font-weight:normal;
        }
  </style>
</head>
<body>
    <!-- <div style="text-align:center;"> -->
        <div id ="phaser-game">
            <input type="text" name="emailField" id="emailText" style="display: none;" placeholder="Enter your email">
        </div>
    <!-- </div> -->
    <div style="font-family:myFont; position:absolute; left:-1000px; visibility:hidden;">.</div>
    <div style="font-family:Roboto;position:absolute;left:-1000px;visibility:hidden;">.</div>
</body>
</html>
