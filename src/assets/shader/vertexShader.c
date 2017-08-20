attribute vec2 a_position;
attribute vec2 a_texture_coord;

uniform vec2 u_resolution;
uniform vec2 u_camera;

varying mediump vec2 v_texture_coord;

void main() {
  v_texture_coord = a_texture_coord;

  vec2 zeroToOne = (a_position - u_camera) / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
} 