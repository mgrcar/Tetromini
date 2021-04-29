/*==========================================================================;
 *
 *  File:    dostetris.js
 *  Desc:    Look & feel of the original DOS tetris (requires JSTe3s)
 *  Created: Oct-2013
 *
 *  Author:  Miha Grcar
 *
 ***************************************************************************/

var loaders = [];
var images = {};
var sounds = {};
var ctx;
var tmpCanvas = $("<canvas width=\"16\" height=\"16\"></canvas>")[0];
var tmpCtx = tmpCanvas.getContext("2d");
var colors = ["#ffff55", "#aa00aa", "#aa0000", "#aa5500", "#00aa00", "#00aaaa", "#0000aa", "#aaaaaa", "#000000"];

var imgInfo = [
    ["BG", "img/background.png"],
    ["DOT", "img/dot.png"],
    ["GAMEOVER", "img/gameover.png"],
    ["PAUSED", "img/paused.png"],
    ["STAR", "img/star.png"],
    ["RESTART", "img/restart.png"],
    ["RESUME", "img/resume.png"],
    ["DROP", "img/drop.png"]
];

var sndInfo = [
    ["LINE", "snd/line"],
    ["1000", "snd/1000"],
    ["GAMEOVER", "snd/gameover"]
];

var cmdQueue = [];
var keyBuffer = [];

var sndFx = false;

// Renderer

function renderer_Init() {
    drawImage("BG", 0, 0);
}

function renderer_RenderPlayfield() {
    for (var row = 0; row < 20; row++) {
        renderer_RenderRow(row);
    } 
}

function renderer_RenderRow(row) {
    for (var col = 0; col < 10; col++) {
        var type = JSTe3s.Playfield.mGrid[row][col];
        var img = type != 0 ? ("B" + type) : (col % 2 != 0 ? "DOT" : "B8");
        drawImage(img, col + 15, row + 1);
    }
}

function renderer_RenderBlock() {
    for (var row = JSTe3s.Block.mBlock.mPosY - 1; row < JSTe3s.Block.mBlock.mPosY + 4; row++) {
        if (row >= 0 && row < 20) {
            renderer_RenderRow(row);
        }
    }
}

function renderer_RenderGameOver() {
    drawImage("GAMEOVER", 14, 9);
    drawImage("RESTART", 1, 16);
}

function renderer_RenderPause() {
    drawImage("PAUSED", 14, 9);
    drawImage("RESUME", 1, 16);
}

function renderer_ClearPause() {
    for (var i = 8; i < 13; i++) {
        renderer_RenderRow(i);
        drawImage("STAR", 14, i + 1);
        drawImage("STAR", 25, i + 1);
    }
    drawImage("DROP", 1, 16);
}

function renderer_RenderScore() {
    writeNumber(4, 11, JSTe3s.Program.mScore, 0);    
}

function renderer_RenderNextBlock() {
    var shape = JSTe3s.Block.mNextBlock.mShape[0];
    var color = JSTe3s.Block.mNextBlock.mType;
    for (var blockY = 0; blockY < 4; blockY++) {
        for (var blockX = 0; blockX < 4; blockX++) {
            if (shape[blockY][blockX] == "1") {
                drawImage("B" + color, blockX + 3, blockY + 20);
            } else {
                drawImage("B8", blockX + 3, blockY + 20);
            }
        }
    }
}

function renderer_ClearNextBlock() {
    for (var blockY = 0; blockY < 4; blockY++) {
        for (var blockX = 0; blockX < 4; blockX++) {
            drawImage("B8", blockX + 3, blockY + 20);
        }
    }
}

function renderer_RenderFullLines() {
    writeNumber(2, 12, JSTe3s.Program.mFullLines, 7);
}

function renderer_RenderLevel() {
    writeNumber(1, 12, JSTe3s.Program.mLevel, 7);
}

function renderer_RenderStats() {
    var all = 0;
    for (var i = 0; i < 7; i++) {
        writeNumber(i * 2 + 5, 39, JSTe3s.Program.mStats[i], i + 1);
        all += JSTe3s.Program.mStats[i];
    }
    writeNumber(20, 39, all, 7);
}

// Keyboard

function keyboard_GetKey() {
    if (keyBuffer.length == 0) { return JSTe3s.Key.none; }
    var keyCode = keyBuffer.shift();
    switch (keyCode) {
        case 37:
        case 103:
        case 55:
            return JSTe3s.Key.left;
        case 39:
        case 105:
        case 57:
            return JSTe3s.Key.right; 
        case 38:
        case 104:
        case 56:
            return JSTe3s.Key.rotate;        
        case 32:
        case 100:
        case 52:
        case 40:
            return JSTe3s.Key.drop;
        case 82:
            return JSTe3s.Key.restart;
        case 80:
        case 19:
            return JSTe3s.Key.pause;
        case 97:
        case 49:
            return JSTe3s.Key.showNext;
        case 102:
        case 54:
            return JSTe3s.Key.speedUp;
    }
    return JSTe3s.Key.other;
}

// Sound

function sound_Play(name) {
    cmdQueue.push(function () {
        sndFx = true;
        sounds[name].play();
    });
}

// Utils

function drawImage(imgName, x, y) {
    cmdQueue.push(function () {
        ctx.drawImage(getImage(imgName), x * 16, y * 16);
    });
}

function writeNumber(row, col, num, color) {
    if (num == 0) {
        drawImage("0" + color, col, row);
    } else {
        while (num > 0) {
            var digit = num % 10;
            num = Math.floor(num / 10);
            drawImage(digit + "" + color, col, row);
            col--;
        }
    }
}

function loadImage(name, src) {
    var deferred = $.Deferred();
    var img = new Image();
    images[name] = img;
    img.onload = function () {
        deferred.resolve();
    };
    img.src = src;
    return deferred.promise();
}

function loadSound(name, file) {
    var deferred = $.Deferred();
    sounds[name] = new Howl({
        src: [file + ".ogg", file + ".mp3", file + ".wav"],
        onload: function () { deferred.resolve(); },
        onend: function() { sndFx = false; } 
    });
    return deferred.promise();
}

function getImage(name) {
    if (images[name]) { return images[name]; }
    var color;
    if (name[0] == "B") {
        color = parseInt(name[1]);
        tmpCtx.fillStyle = colors[color];
        tmpCtx.fillRect(0, 0, 16, 16);
        return tmpCanvas;
    } else if (name[0] >= "0" && name[0] <= "9") {
        color = parseInt(name[1]);
        tmpCtx.fillStyle = colors[color];
        tmpCtx.fillRect(0, 0, 16, 16);
        tmpCtx.drawImage(images[name[0]], 0, 0);
        return tmpCanvas;
    }
    return null;
}

// Main

function gameLoop() {
    JSTe3s.Program.play();
    if (cmdQueue.length == 0 && !sndFx) {
        setTimeout(gameLoop, 0);
    } else {
        setTimeout(animLoop, 0);
    }
}

function animLoop() {
    while (cmdQueue.length > 0 && !sndFx) {
        cmdQueue[0]();
        cmdQueue.shift();
    }
    if (cmdQueue.length > 0 || sndFx) {
        setTimeout(animLoop, 0);
    } else {
        setTimeout(gameLoop, 0);
    }
}

$(function () { // wait for document to load
    // keyboard handler
    $(document).on("keydown", function (e) {
        if ($.inArray(e.which, [37, 103, 55, 39, 105, 57, 38, 104, 56, 32, 100, 52, 40, 82, 97, 49, 102, 54, 80, 19]) >= 0) {
            keyBuffer.push(e.which);
            e.preventDefault();
        }
    });
    // initialize loaders
    // images
    for (var i = 0; i < imgInfo.length; i++) {
        loaders.push(loadImage(imgInfo[i][0], imgInfo[i][1]));
    }
    for (i = 0; i <= 9; i++) {
        loaders.push(loadImage(i, "img/" + i + ".png"));
    }
    // sounds
    for (i = 0; i < sndInfo.length; i++) {
        loaders.push(loadSound(sndInfo[i][0], sndInfo[i][1]));
    }
    // warn on unload
    $(window).on("beforeunload", function () {
        return "If you navigate away, your current game progress will be lost.";
    });
    // pause on blur
    $(window).blur(function () {
        if (JSTe3s.Program.mState != JSTe3s.State.pause) {
            keyBuffer.push(80); // push pause key
        }
    });
    // run main loop
    $.when.apply(null, loaders).done(function () { // wait for images and sounds to load
        ctx = $("#screen")[0].getContext("2d");
        JSTe3s.Program.init();
        setTimeout(animLoop, 0);
    });
});