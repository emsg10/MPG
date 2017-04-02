import { Context } from '../context';
import { TextureType, Vector } from '../model';
import { Matrix3, DynamicRenderCall } from './';

export class DynamicRenderer {

    private context: Context;
    private gl: WebGLRenderingContext;
    private shaderProgram: WebGLShader;

    private vertexBuffer: WebGLBuffer;
    private textureCoordBuffer: WebGLBuffer;
    private indeciesBuffer: WebGLBuffer;
    private matricesBuffer: WebGLBuffer;

    private matrixAttributeLocation: number;
    private positionLocation: number;
    private textureCoordAttribute: number;

    private projectionMatrix: number[];

    constructor(context: Context) {
        this.context = context;
        this.gl = this.context.gl;
        this.shaderProgram = this.context.dynamicVertecyProgram;
        this.gl.useProgram(this.shaderProgram);

        this.gl.bindAttribLocation(this.shaderProgram, 0, "a_position");
        this.gl.bindAttribLocation(this.shaderProgram, 1, "a_texture_coord");
        this.gl.bindAttribLocation(this.shaderProgram, 2, "a_matrix");

        this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
        this.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_texture_coord");
        this.matrixAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_matrix");

        this.vertexBuffer = this.gl.createBuffer();
        this.textureCoordBuffer = this.gl.createBuffer();
        this.indeciesBuffer = this.gl.createBuffer();
        this.matricesBuffer = this.gl.createBuffer();
    }

    public render(renderCalls: DynamicRenderCall[]) {
        this.gl.useProgram(this.shaderProgram);
        for (let renderCall of renderCalls) {
            if (renderCall.vertecies.length > 0) {

                let copyMat = renderCall.matrices.slice(0, 9);
                let testMat: number[] = [];
                for(let i = 0; i < renderCall.indecies.length; i++) {
                    testMat.push(...copyMat);
                }

                this.gl.enableVertexAttribArray(this.positionLocation);
                this.gl.enableVertexAttribArray(this.textureCoordAttribute);
                this.gl.enableVertexAttribArray(this.matrixAttributeLocation);
                this.gl.enableVertexAttribArray(this.matrixAttributeLocation + 1);
                this.gl.enableVertexAttribArray(this.matrixAttributeLocation + 2);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.textureCoords), this.gl.STATIC_DRAW);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.matricesBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.matrices), this.gl.STATIC_DRAW);

                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
                this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indecies), this.gl.STATIC_DRAW);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
                this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
                this.gl.vertexAttribPointer(this.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.matricesBuffer);
                for (var i = 0; i< 3; i++) {
                    this.gl.vertexAttribPointer(this.matrixAttributeLocation + i, 3, this.gl.FLOAT, false, 36, i * 12);
                }

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.glTexture);

                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
                this.gl.drawElements(this.gl.TRIANGLES, renderCall.indecies.length, this.gl.UNSIGNED_SHORT, 0)

                this.gl.disableVertexAttribArray(this.positionLocation);
                this.gl.disableVertexAttribArray(this.textureCoordAttribute);
                this.gl.disableVertexAttribArray(this.matrixAttributeLocation);
                this.gl.disableVertexAttribArray(this.matrixAttributeLocation + 1);
                this.gl.disableVertexAttribArray(this.matrixAttributeLocation + 2);
            }
        }
    }


}