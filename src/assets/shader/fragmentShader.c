precision mediump float;
varying highp vec2 v_texture_coord;      
uniform sampler2D u_sampler;
      
void main(void) {
	gl_FragColor = texture2D(u_sampler, v_texture_coord);;
}