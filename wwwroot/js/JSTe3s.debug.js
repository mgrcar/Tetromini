//! JSTe3s.debug.js
//

(function() {

Type.registerNamespace('JSTe3s');

////////////////////////////////////////////////////////////////////////////////
// JSTe3s.Key

JSTe3s.Key = function() { 
    /// <field name="none" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="left" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="right" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="rotate" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="drop" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="restart" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="pause" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="showNext" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="speedUp" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="other" type="Number" integer="true" static="true">
    /// </field>
};
JSTe3s.Key.prototype = {
    none: 0, 
    left: 1, 
    right: 2, 
    rotate: 3, 
    drop: 4, 
    restart: 5, 
    pause: 6, 
    showNext: 7, 
    speedUp: 8, 
    other: 9
}
JSTe3s.Key.registerEnum('JSTe3s.Key', false);


////////////////////////////////////////////////////////////////////////////////
// JSTe3s.State

JSTe3s.State = function() { 
    /// <field name="play" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="pause" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="gameOver" type="Number" integer="true" static="true">
    /// </field>
};
JSTe3s.State.prototype = {
    play: 0, 
    pause: 1, 
    gameOver: 2
}
JSTe3s.State.registerEnum('JSTe3s.State', false);


////////////////////////////////////////////////////////////////////////////////
// JSTe3s.Playfield

JSTe3s.Playfield = function JSTe3s_Playfield() {
    /// <field name="mGrid" type="Array" elementType="Array" static="true">
    /// </field>
    /// <field name="mGridBkgr" type="Array" elementType="Array" static="true">
    /// </field>
}
JSTe3s.Playfield.arrayClear = function JSTe3s_Playfield$arrayClear(array) {
    /// <param name="array" type="Array" elementType="Array">
    /// </param>
    for (var i = 0; i < 20; i++) {
        array[i] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    }
}
JSTe3s.Playfield.arrayClear2 = function JSTe3s_Playfield$arrayClear2(array, y) {
    /// <param name="array" type="Array" elementType="Array">
    /// </param>
    /// <param name="y" type="Number" integer="true">
    /// </param>
    array[y] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
}
JSTe3s.Playfield.arrayCopy = function JSTe3s_Playfield$arrayCopy(src, dst) {
    /// <param name="src" type="Array" elementType="Array">
    /// </param>
    /// <param name="dst" type="Array" elementType="Array">
    /// </param>
    for (var i = 0; i < 20; i++) {
        dst[i] = src[i].clone();
    }
}
JSTe3s.Playfield.arrayCopy4 = function JSTe3s_Playfield$arrayCopy4(src, srcY, dst, dstY) {
    /// <param name="src" type="Array" elementType="Array">
    /// </param>
    /// <param name="srcY" type="Number" integer="true">
    /// </param>
    /// <param name="dst" type="Array" elementType="Array">
    /// </param>
    /// <param name="dstY" type="Number" integer="true">
    /// </param>
    dst[dstY] = src[srcY].clone();
}
JSTe3s.Playfield.clear = function JSTe3s_Playfield$clear() {
    JSTe3s.Playfield.arrayClear(JSTe3s.Playfield.mGrid);
    JSTe3s.Playfield.arrayClear(JSTe3s.Playfield.mGridBkgr);
}
JSTe3s.Playfield.updateBkgr = function JSTe3s_Playfield$updateBkgr() {
    JSTe3s.Playfield.arrayCopy(JSTe3s.Playfield.mGrid, JSTe3s.Playfield.mGridBkgr);
}
JSTe3s.Playfield.updateBlock = function JSTe3s_Playfield$updateBlock() {
    JSTe3s.Playfield.arrayCopy(JSTe3s.Playfield.mGridBkgr, JSTe3s.Playfield.mGrid);
    var shape = JSTe3s.Block.mBlock.mShape[JSTe3s.Block.mBlock.mRot];
    for (var blockY = 0, gridY = JSTe3s.Block.mBlock.mPosY; blockY < 4 && gridY < 20; blockY++, gridY++) {
        for (var blockX = 0, gridX = JSTe3s.Block.mBlock.mPosX; blockX < 4 && gridX < 10; blockX++, gridX++) {
            if (shape[blockY].charAt(blockX) === '1') {
                JSTe3s.Playfield.mGrid[gridY][gridX] = JSTe3s.Block.mBlock.mType;
            }
        }
    }
}
JSTe3s.Playfield.collapse = function JSTe3s_Playfield$collapse() {
    /// <returns type="Number" integer="true"></returns>
    var tmp = new Array(20);
    for (var i = 0; i < 20; i++) {
        tmp[i] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    }
    var yTmp = 19;
    var render = false;
    var fullLines = 0;
    for (var y = 19; y >= 0; y--) {
        var fullLine = true;
        for (var x = 0; x < 10; x++) {
            if (!JSTe3s.Playfield.mGrid[y][x]) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            JSTe3s.Playfield.arrayClear2(JSTe3s.Playfield.mGrid, y);
            renderer_RenderRow(y);
            sound_Play('LINE');
            render = true;
            fullLines++;
        }
        else {
            JSTe3s.Playfield.arrayCopy4(JSTe3s.Playfield.mGrid, y, tmp, yTmp);
            yTmp--;
        }
    }
    if (render) {
        JSTe3s.Playfield.arrayCopy(tmp, JSTe3s.Playfield.mGrid);
        renderer_RenderPlayfield();
    }
    return fullLines;
}


////////////////////////////////////////////////////////////////////////////////
// JSTe3s.Block

JSTe3s.Block = function JSTe3s_Block(shape, type) {
    /// <param name="shape" type="Array" elementType="Array">
    /// </param>
    /// <param name="type" type="Number" integer="true">
    /// </param>
    /// <field name="mBlocks" type="Array" elementType="Block" static="true">
    /// </field>
    /// <field name="mBlock" type="JSTe3s.Block" static="true">
    /// </field>
    /// <field name="mNextBlock" type="JSTe3s.Block" static="true">
    /// </field>
    /// <field name="mShape" type="Array" elementType="Array">
    /// </field>
    /// <field name="mType" type="Number" integer="true">
    /// </field>
    /// <field name="mRot" type="Number" integer="true">
    /// </field>
    /// <field name="mPosX" type="Number" integer="true">
    /// </field>
    /// <field name="mPosY" type="Number" integer="true">
    /// </field>
    this.mPosY = -1;
    this.mShape = shape;
    this.mType = type;
}
JSTe3s.Block.newBlock = function JSTe3s_Block$newBlock() {
    /// <returns type="Boolean"></returns>
    if (JSTe3s.Block.mNextBlock == null) {
        JSTe3s.Block.mNextBlock = JSTe3s.Block.mBlocks[Math.round(Math.random() * 6)].clone();
    }
    JSTe3s.Block.mBlock = JSTe3s.Block.mNextBlock;
    JSTe3s.Program.mStats[JSTe3s.Block.mBlock.mType - 1]++;
    if (JSTe3s.Program.mStats[JSTe3s.Block.mBlock.mType - 1] > 1428) {
        JSTe3s.Program.mStats[JSTe3s.Block.mBlock.mType - 1] = 1428;
    }
    renderer_RenderStats();
    JSTe3s.Block.mNextBlock = JSTe3s.Block.mBlocks[Math.round(Math.random() * 6)].clone();
    var success = JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX, JSTe3s.Block.mBlock.mPosY, JSTe3s.Block.mBlock.mRot);
    JSTe3s.Playfield.updateBlock();
    renderer_RenderBlock();
    if (JSTe3s.Program.mShowNext) {
        renderer_RenderNextBlock();
    }
    return success;
}
JSTe3s.Block.check = function JSTe3s_Block$check(posX, posY, rot) {
    /// <param name="posX" type="Number" integer="true">
    /// </param>
    /// <param name="posY" type="Number" integer="true">
    /// </param>
    /// <param name="rot" type="Number" integer="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    var shape = JSTe3s.Block.mBlock.mShape[rot];
    for (var blockY = 0, gridY = posY; blockY < 4; blockY++, gridY++) {
        for (var blockX = 0, gridX = posX; blockX < 4; blockX++, gridX++) {
            if (shape[blockY].charAt(blockX) === '1' && (gridX < 0 || gridY < 0 || gridX >= 10 || gridY >= 20 || !!JSTe3s.Playfield.mGridBkgr[gridY][gridX])) {
                return false;
            }
        }
    }
    return true;
}
JSTe3s.Block.update = function JSTe3s_Block$update() {
    JSTe3s.Playfield.updateBlock();
    renderer_RenderBlock();
}
JSTe3s.Block.moveLeft = function JSTe3s_Block$moveLeft() {
    /// <returns type="Boolean"></returns>
    if (JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX - 1, JSTe3s.Block.mBlock.mPosY, JSTe3s.Block.mBlock.mRot)) {
        JSTe3s.Block.mBlock.mPosX--;
        JSTe3s.Block.update();
        return true;
    }
    return false;
}
JSTe3s.Block.moveRight = function JSTe3s_Block$moveRight() {
    /// <returns type="Boolean"></returns>
    if (JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX + 1, JSTe3s.Block.mBlock.mPosY, JSTe3s.Block.mBlock.mRot)) {
        JSTe3s.Block.mBlock.mPosX++;
        JSTe3s.Block.update();
        return true;
    }
    return false;
}
JSTe3s.Block.moveDown = function JSTe3s_Block$moveDown() {
    /// <returns type="Boolean"></returns>
    if (JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX, JSTe3s.Block.mBlock.mPosY + 1, JSTe3s.Block.mBlock.mRot)) {
        JSTe3s.Block.mBlock.mPosY++;
        JSTe3s.Block.update();
        return true;
    }
    return false;
}
JSTe3s.Block.rotate = function JSTe3s_Block$rotate() {
    /// <returns type="Boolean"></returns>
    var rot = (JSTe3s.Block.mBlock.mRot + 1) % 4;
    if (JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX, JSTe3s.Block.mBlock.mPosY, rot)) {
        JSTe3s.Block.mBlock.mRot = rot;
        JSTe3s.Block.update();
        return true;
    }
    return false;
}
JSTe3s.Block.drop = function JSTe3s_Block$drop() {
    /// <returns type="Boolean"></returns>
    var success = JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX, JSTe3s.Block.mBlock.mPosY + 1, JSTe3s.Block.mBlock.mRot);
    while (JSTe3s.Block.check(JSTe3s.Block.mBlock.mPosX, JSTe3s.Block.mBlock.mPosY + 1, JSTe3s.Block.mBlock.mRot)) {
        JSTe3s.Block.mBlock.mPosY++;
    }
    if (success) {
        JSTe3s.Playfield.updateBlock();
        renderer_RenderPlayfield();
    }
    return success;
}
JSTe3s.Block.prototype = {
    mShape: null,
    mType: 0,
    mRot: 0,
    mPosX: 3,
    
    clone: function JSTe3s_Block$clone() {
        /// <returns type="Object"></returns>
        var block = new JSTe3s.Block(this.mShape, this.mType);
        block.mPosX = this.mPosX;
        block.mPosY = this.mPosY;
        block.mRot = this.mRot;
        return block;
    }
}


////////////////////////////////////////////////////////////////////////////////
// JSTe3s.Program

JSTe3s.Program = function JSTe3s_Program() {
    /// <field name="mLevel" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="mSteps" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="mScore" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="mFullLines" type="Number" integer="true" static="true">
    /// </field>
    /// <field name="mShowNext" type="Boolean" static="true">
    /// </field>
    /// <field name="mStats" type="Array" elementType="Number" elementInteger="true" static="true">
    /// </field>
    /// <field name="mTimer" type="Date" static="true">
    /// </field>
    /// <field name="mState" type="JSTe3s.State" static="true">
    /// </field>
    /// <field name="mTimeLeft" type="Number" integer="true" static="true">
    /// </field>
}
JSTe3s.Program.resetTimer = function JSTe3s_Program$resetTimer() {
    JSTe3s.Program.mTimer = Date.get_now();
}
JSTe3s.Program.timer = function JSTe3s_Program$timer() {
    /// <returns type="Boolean"></returns>
    return Date.get_now() - JSTe3s.Program.mTimer >= (10 - JSTe3s.Program.mLevel) * 50;
}
JSTe3s.Program.resetStats = function JSTe3s_Program$resetStats() {
    JSTe3s.Program.mScore = 0;
    JSTe3s.Program.mLevel = 0;
    JSTe3s.Program.mFullLines = 0;
    JSTe3s.Program.mStats = [ 0, 0, 0, 0, 0, 0, 0 ];
}
JSTe3s.Program.play = function JSTe3s_Program$play() {
    if (!JSTe3s.Program.mState) {
        switch (keyboard_GetKey()) {
            case 1:
                JSTe3s.Block.moveLeft();
                break;
            case 2:
                JSTe3s.Block.moveRight();
                break;
            case 3:
                JSTe3s.Block.rotate();
                break;
            case 4:
                JSTe3s.Block.drop();
                break;
            case 6:
                JSTe3s.Program.mTimeLeft = Date.get_now() - JSTe3s.Program.mTimer;
                renderer_RenderPause();
                JSTe3s.Program.mState = 1;
                return;
            case 7:
                JSTe3s.Program.mShowNext = !JSTe3s.Program.mShowNext;
                if (JSTe3s.Program.mShowNext) {
                    renderer_RenderNextBlock();
                }
                else {
                    renderer_ClearNextBlock();
                }
                break;
            case 8:
                JSTe3s.Program.mLevel++;
                if (JSTe3s.Program.mLevel > 9) {
                    JSTe3s.Program.mLevel = 9;
                }
                renderer_RenderLevel();
                break;
        }
        if (JSTe3s.Program.timer()) {
            if (!JSTe3s.Block.moveDown()) {
                var points = (21 + 3 * (JSTe3s.Program.mLevel + 1)) - JSTe3s.Program.mSteps;
                var tmp = Math.floor(JSTe3s.Program.mScore / 1000);
                JSTe3s.Program.mScore += points;
                if (JSTe3s.Program.mScore > 99999) {
                    JSTe3s.Program.mScore = 99999;
                }
                if (Math.floor(JSTe3s.Program.mScore / 1000) > tmp) {
                    sound_Play('1000');
                }
                renderer_RenderScore();
                JSTe3s.Program.mSteps = 0;
                JSTe3s.Program.mFullLines += JSTe3s.Playfield.collapse();
                if (JSTe3s.Program.mFullLines > 99) {
                    JSTe3s.Program.mFullLines = 99;
                }
                renderer_RenderFullLines();
                JSTe3s.Program.mLevel = Math.max(JSTe3s.Program.mLevel, Math.floor((JSTe3s.Program.mFullLines - 1) / 10));
                renderer_RenderLevel();
                JSTe3s.Playfield.updateBkgr();
                if (!JSTe3s.Block.newBlock()) {
                    sound_Play('GAMEOVER');
                    renderer_RenderGameOver();
                    JSTe3s.Program.mState = 2;
                    return;
                }
            }
            else {
                JSTe3s.Program.mSteps++;
            }
            JSTe3s.Program.resetTimer();
        }
    }
    else if (JSTe3s.Program.mState === 1) {
        var key = keyboard_GetKey();
        if (key === 5 || key === 6) {
            renderer_ClearPause();
            JSTe3s.Program.mTimer = new Date(Date.get_now().getTime() - JSTe3s.Program.mTimeLeft);
            JSTe3s.Program.mState = 0;
        }
    }
    else if (JSTe3s.Program.mState === 2) {
        var key = keyboard_GetKey();
        if (!!key) {
            if (key === 5) {
                JSTe3s.Program.resetStats();
                renderer_Init();
                JSTe3s.Playfield.clear();
                renderer_RenderPlayfield();
                JSTe3s.Block.newBlock();
                JSTe3s.Program.resetTimer();
                JSTe3s.Program.mState = 0;
            }
        }
    }
}
JSTe3s.Program.init = function JSTe3s_Program$init() {
    renderer_Init();
    renderer_RenderPlayfield();
    JSTe3s.Block.newBlock();
    JSTe3s.Program.resetTimer();
}


JSTe3s.Playfield.registerClass('JSTe3s.Playfield');
JSTe3s.Block.registerClass('JSTe3s.Block');
JSTe3s.Program.registerClass('JSTe3s.Program');
JSTe3s.Playfield.mGrid = new Array(20);
JSTe3s.Playfield.mGridBkgr = new Array(20);
(function () {
    for (var i = 0; i < 20; i++) {
        JSTe3s.Playfield.mGrid[i] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        JSTe3s.Playfield.mGridBkgr[i] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    }
})();
JSTe3s.Block.mBlocks = [ new JSTe3s.Block([ '0000,0111,0100,0000'.split(','), '0010,0010,0011,0000'.split(','), '0001,0111,0000,0000'.split(','), '0110,0010,0010,0000'.split(',') ], 1), new JSTe3s.Block([ '0000,1111,0000,0000'.split(','), '0010,0010,0010,0010'.split(','), '0000,1111,0000,0000'.split(','), '0010,0010,0010,0010'.split(',') ], 2), new JSTe3s.Block([ '0000,0111,0010,0000'.split(','), '0010,0011,0010,0000'.split(','), '0010,0111,0000,0000'.split(','), '0010,0110,0010,0000'.split(',') ], 3), new JSTe3s.Block([ '0000,0011,0110,0000'.split(','), '0010,0011,0001,0000'.split(','), '0000,0011,0110,0000'.split(','), '0010,0011,0001,0000'.split(',') ], 4), new JSTe3s.Block([ '0000,0110,0011,0000'.split(','), '0001,0011,0010,0000'.split(','), '0000,0110,0011,0000'.split(','), '0001,0011,0010,0000'.split(',') ], 5), new JSTe3s.Block([ '0000,0110,0110,0000'.split(','), '0000,0110,0110,0000'.split(','), '0000,0110,0110,0000'.split(','), '0000,0110,0110,0000'.split(',') ], 6), new JSTe3s.Block([ '0000,0111,0001,0000'.split(','), '0011,0010,0010,0000'.split(','), '0100,0111,0000,0000'.split(','), '0010,0010,0110,0000'.split(',') ], 7) ];
JSTe3s.Block.mBlock = null;
JSTe3s.Block.mNextBlock = null;
JSTe3s.Program.mLevel = 0;
JSTe3s.Program.mSteps = 0;
JSTe3s.Program.mScore = 0;
JSTe3s.Program.mFullLines = 0;
JSTe3s.Program.mShowNext = false;
JSTe3s.Program.mStats = [ 0, 0, 0, 0, 0, 0, 0 ];
JSTe3s.Program.mTimer = null;
JSTe3s.Program.mState = 0;
JSTe3s.Program.mTimeLeft = 0;
})();

//! This script was generated using Script# v0.7.4.0
