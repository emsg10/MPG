precision mediump float;
uniform sampler2D u_sampler;
      
varying mediump vec2 v_texture_coord;      

void main(void) {
	gl_FragColor = texture2D(u_sampler, v_texture_coord);
}