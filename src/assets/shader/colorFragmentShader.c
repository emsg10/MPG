precision mediump float;
uniform sampler2D u_sampler;
      
varying highp vec2 v_texture_coord;      
varying vec4 v_color;

void main(void) {
	vec4 texColor = texture2D(u_sampler, v_texture_coord);
	gl_FragColor = texColor * v_color;
}