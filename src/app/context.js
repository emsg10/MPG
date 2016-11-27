"use strict";
var $ = require('jquery');
var rxjs_1 = require('rxjs');
var model_1 = require('../model');
var Context = (function () {
    function Context() {
    }
    Context.prototype.doneListener = function () {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            _this.observer = observer;
        });
    };
    Context.prototype.init = function () {
        this.initContext();
        this.initShaders();
    };
    Context.prototype.initContext = function () {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1200;
        this.canvas.height = 800;
        document.body.appendChild(this.canvas);
        this.gl = this.canvas.getContext("experimental-webgl");
        console.log("Context initialized...");
    };
    Context.prototype.initShaders = function () {
        var _this = this;
        $.when(this.loadShader(model_1.ShaderType.Vertex), this.loadShader(model_1.ShaderType.Fragment)).then(function (vertexData, fragmentData) {
            var vertexShader = _this.compileShader(vertexData[0], model_1.ShaderType.Vertex);
            var fragmentShader = _this.compileShader(fragmentData[0], model_1.ShaderType.Fragment);
            _this.shaderProgram = _this.gl.createProgram();
            _this.gl.attachShader(_this.shaderProgram, vertexShader);
            _this.gl.attachShader(_this.shaderProgram, fragmentShader);
            _this.gl.linkProgram(_this.shaderProgram);
            if (!_this.gl.getProgramParameter(_this.shaderProgram, _this.gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program: " + _this.gl.getProgramInfoLog(_this.shaderProgram));
            }
            _this.gl.useProgram(_this.shaderProgram);
            _this.initTextures(_this.gl);
        });
    };
    Context.prototype.initTextures = function (gl) {
        var _this = this;
        this.texture = gl.createTexture();
        var textureImage = new Image();
        textureImage.onload = function () {
            _this.handleTextureLoaded(textureImage, _this.texture, gl);
        };
        textureImage.src = "/src/texture/grayWallTexture.jpg";
    };
    Context.prototype.handleTextureLoaded = function (image, texture, gl) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.observer.next(null);
    };
    Context.prototype.compileShader = function (source, shaderType) {
        var shader;
        if (shaderType == model_1.ShaderType.Fragment) {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        else if (shaderType == model_1.ShaderType.Vertex) {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    };
    Context.prototype.loadShader = function (shaderType) {
        var shaderSource = "";
        if (shaderType == model_1.ShaderType.Fragment) {
            shaderSource = "src/shader/fragmentShader.c";
        }
        else if (shaderType == model_1.ShaderType.Vertex) {
            shaderSource = "src/shader/vertexShader.c";
        }
        var promise = $.ajax({ url: shaderSource });
        return promise;
    };
    return Context;
}());
exports.Context = Context;
//# sourceMappingURL=context.js.map