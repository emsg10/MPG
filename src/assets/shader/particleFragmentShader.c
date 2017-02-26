  precision mediump float;

  uniform vec4 uColor;

  varying float vLifetime;

  uniform sampler2D sTexture;


  void main(void) {
    vec4 texColor;
    texColor = texture2D(sTexture, gl_PointCoord);
    gl_FragColor = vec4(uColor) * texColor;
    gl_FragColor.a *= vLifetime;
  }