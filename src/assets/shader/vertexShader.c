attribute vec2 a_position;
attribute vec2 a_texture_coord;
attribute vec4 a_color;

uniform vec2 u_resolution;
uniform vec2 u_rotation;

varying highp vec2 v_texture_coord;
varying vec4 v_color;

void main() {

  v_color = a_color;
  vec2 rotatedPosition = vec2(
     a_position.x * u_rotation.y + a_position.y * u_rotation.x,
     a_position.y * u_rotation.y - a_position.x * u_rotation.x);
  vec2 zeroToOne = rotatedPosition / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_texture_coord = a_texture_coord;
} 