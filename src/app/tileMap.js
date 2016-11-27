"use strict";
var model_1 = require('../model');
var TileMap = (function () {
    function TileMap(width, height) {
        this.tiles = [];
        this.width = width;
        this.height = height;
    }
    TileMap.prototype.create = function () {
        var tileWidth = 20;
        var tileHeight = 20;
        var columnNumber = this.width / tileWidth;
        var rowNumber = this.height / tileHeight;
        for (var i = 0; i < columnNumber; i++) {
            this.tiles[i] = [];
            for (var j = 0; j < rowNumber; j++) {
                this.tiles[i][j] = new model_1.Tile(tileWidth * i, tileHeight * j, tileWidth, tileHeight);
            }
        }
    };
    TileMap.prototype.render = function (context) {
        var positionLocation = context.gl.getAttribLocation(context.shaderProgram, "a_position");
        var resolutionLocation = context.gl.getUniformLocation(context.shaderProgram, "u_resolution");
        var colorLocation = context.gl.getUniformLocation(context.shaderProgram, "u_color");
        var textureCoordAttribute = context.gl.getAttribLocation(context.shaderProgram, "a_texture_coord");
        var indicesbuffer = context.gl.createBuffer();
        var buffer = context.gl.createBuffer();
        var textureCoordBuffer = context.gl.createBuffer();
        context.gl.bindTexture(context.gl.TEXTURE_2D, context.texture);
        context.gl.bindBuffer(context.gl.ARRAY_BUFFER, buffer);
        context.gl.bufferData(context.gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 20, 20, 0, 20, 20]), context.gl.STATIC_DRAW);
        context.gl.enableVertexAttribArray(positionLocation);
        context.gl.vertexAttribPointer(positionLocation, 2, context.gl.FLOAT, false, 0, 0);
        context.gl.bindBuffer(context.gl.ARRAY_BUFFER, textureCoordBuffer);
        context.gl.bufferData(context.gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 20, 20, 0, 20, 20]), context.gl.STATIC_DRAW);
        context.gl.enableVertexAttribArray(textureCoordAttribute);
        context.gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        context.gl.uniform2f(resolutionLocation, this.width, this.height);
        context.gl.vertexAttribPointer(positionLocation, 2, context.gl.FLOAT, false, 0, 0);
        context.gl.enableVertexAttribArray(textureCoordAttribute);
        context.gl.drawElements(context.gl.TRIANGLES, 12, context.gl.UNSIGNED_SHORT, 0);
        for (var i = 0; i < this.tiles.length; i++) {
            for (var j = 0; j < this.tiles[i].length; j++) {
            }
        }
    };
    TileMap.prototype.setRectangle = function (x, y, width, height, gl, textureCoordAttribute) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        var textureCoordinates = [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        //gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    };
    TileMap.prototype.randomInt = function (range) {
        return Math.floor(Math.random() * range);
    };
    return TileMap;
}());
exports.TileMap = TileMap;
//# sourceMappingURL=tileMap.js.map