  uniform vec3 uCenterPosition;

  attribute float aLifetime;
  attribute float aRelativeTime;
  attribute vec3 aStartPosition;
  attribute vec3 aEndPosition;

  varying float vLifetime;


  void main(void) {
    if (aRelativeTime <= aLifetime) {
      gl_Position.xyz = aStartPosition + (aRelativeTime * aEndPosition);
      gl_Position.w = 1.0;
    } else {
      gl_Position = vec4(-1000, -1000, 0, 0);
    }

    vLifetime = 1.0 - (aRelativeTime / aLifetime);
    vLifetime = clamp(vLifetime, 0.0, 1.0);
    gl_PointSize = 10.0 - (vLifetime * vLifetime) * 10.0;
  }