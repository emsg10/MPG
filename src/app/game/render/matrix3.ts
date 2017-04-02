export class Matrix3 {

    public createIdentityMatrix() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }

    public static createProjectionMatrix(width: number, height: number) {
		return [
			2 / width, 0, 0,
			0, -2 / height, 0,
			-1, 1, 1
		];
	}

	public static createTranslationMatrix(tx: number, ty: number) {
		return [
			1, 0, 0,
			0, 1, 0,
			tx, ty, 1
		];
	}

	public static createRotationMatrix(angleInRadians: number) {
		let c = Math.cos(angleInRadians);
		let s = Math.sin(angleInRadians);
		return [
			c, -s, 0,
			s, c, 0,
			0, 0, 1
		];
	}

	public static createScaleMatrix(sx: number, sy: number) {
		return [
			sx, 0, 0,
			0, sy, 0,
			0, 0, 1
		];
	}

	public static multiply(a: number[], b: number[]) {
		var a00 = a[0 * 3 + 0];
		var a01 = a[0 * 3 + 1];
		var a02 = a[0 * 3 + 2];
		var a10 = a[1 * 3 + 0];
		var a11 = a[1 * 3 + 1];
		var a12 = a[1 * 3 + 2];
		var a20 = a[2 * 3 + 0];
		var a21 = a[2 * 3 + 1];
		var a22 = a[2 * 3 + 2];
		var b00 = b[0 * 3 + 0];
		var b01 = b[0 * 3 + 1];
		var b02 = b[0 * 3 + 2];
		var b10 = b[1 * 3 + 0];
		var b11 = b[1 * 3 + 1];
		var b12 = b[1 * 3 + 2];
		var b20 = b[2 * 3 + 0];
		var b21 = b[2 * 3 + 1];
		var b22 = b[2 * 3 + 2];
		return [a00 * b00 + a01 * b10 + a02 * b20,
		a00 * b01 + a01 * b11 + a02 * b21,
		a00 * b02 + a01 * b12 + a02 * b22,
		a10 * b00 + a11 * b10 + a12 * b20,
		a10 * b01 + a11 * b11 + a12 * b21,
		a10 * b02 + a11 * b12 + a12 * b22,
		a20 * b00 + a21 * b10 + a22 * b20,
		a20 * b01 + a21 * b11 + a22 * b21,
		a20 * b02 + a21 * b12 + a22 * b22];
	}

    public static positionConvertion(x: number, y: number, matrix: number[]) {
        x = x * matrix[0] + y * matrix[3] + 1 * matrix[6];
        y = x * matrix[1] + y * matrix[4] + 1 * matrix[7];

        return [x, y];
    }
}