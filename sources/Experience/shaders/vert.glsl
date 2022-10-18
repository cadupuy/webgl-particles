attribute vec2 aPosition;
attribute vec3 aColor;

uniform float uTime;

varying vec3 vColor;

void main() {
    float dist = 1. - distance( aPosition.y, 0. );

    float t = uTime * dist * abs(aPosition.y);

    float x = aPosition.x + t;
    float y = aPosition.y + sin( uTime * 10. + aPosition.x * 10. ) * .02;
    vec2 pos = vec2( x, y );

    pos.x = mod( pos.x, 2. ) - 1.;

    gl_Position = vec4(pos, 1., 1.);

    gl_PointSize = 6. * cos( ( 1. - dist ) * 10. );// + tan( dist * 2. ) * .01;

    vColor = aColor;
}
