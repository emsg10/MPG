attribute vec2 a_position;
attribute vec2 a_texture_coord;
attribute mat3 a_matrix;

varying mediump vec2 v_texture_coord;

void main() {
  v_texture_coord = a_texture_coord;

  gl_Position = vec4((a_matrix * vec3(a_position, 1)).xy, 0, 1);
} 