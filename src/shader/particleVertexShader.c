  attribute float a_lifetime;
  attribute float a_relativeTime;
  attribute vec3 a_startPosition;
  attribute vec3 a_endPosition;

  varying float v_lifetime;

  void main(void) {
    if (a_relativeTime <= a_lifetime) {
      gl_Position.xyz = a_startPosition + (a_relativeTime * a_endPosition);
      gl_Position.w = 1.0;
    } else {
      gl_Position = vec4(-1000, -1000, 0, 0);
    }

    v_lifetime = 1.0 - (a_relativeTime / a_lifetime);
    v_lifetime = clamp(v_lifetime, 0.0, 1.0);
    gl_PointSize = 10.0 - (v_lifetime * v_lifetime) * 10.0;
  }