"use strict";
var _1 = require('./');
var Game = (function () {
    function Game() {
        var _this = this;
        this.fps = 8;
        this.context = new _1.Context();
        var doneLoading = this.context.doneListener();
        doneLoading.subscribe(function () {
            _this.start();
        });
        this.context.init();
        this.tileMap = new _1.TileMap(this.context.canvas.width, this.context.canvas.height);
        this.tileMap.create();
    }
    Game.prototype.start = function () {
        this.tileMap.render(this.context);
        //setInterval(this.run(), (1000/this.fps));
    };
    Game.prototype.run = function () {
        var _this = this;
        var loops = 0, skipTicks = 1000 / this.fps, maxFrameSkip = 10, nextGameTick = (new Date).getTime();
        return function () {
            loops = 0;
            while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
                //Todo gamelogic update
                nextGameTick += skipTicks;
                loops++;
            }
            if (loops) {
                _this.tileMap.render(_this.context);
            }
        };
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map