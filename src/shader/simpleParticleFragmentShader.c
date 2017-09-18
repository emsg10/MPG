precision mediump float;
uniform sampler2D u_image;
uniform vec4 u_color;
void main()
{
    vec4 baseTexture = texture2D(u_image, gl_PointCoord);
    vec4 baseColor = u_color;
    float alpha = u_color.w;
    gl_FragColor = baseTexture * u_color;
}