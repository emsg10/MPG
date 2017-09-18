attribute vec2 a_position;
attribute vec2 a_texture_coord;
attribute vec4 a_color;

uniform vec2 u_resolution;
uniform vec2 u_camera;

varying mediump vec2 v_texture_coord;
varying vec4 v_color;

void main() {
  v_color = a_color;
  v_texture_coord = a_texture_coord;

  vec2 zeroToOne = (a_position - u_camera) / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
} 