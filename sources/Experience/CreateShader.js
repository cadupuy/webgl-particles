export default class CreateShader {
  constructor(gl, type, src) {
    // gl = context,
    // type = VERTEX_SHADER || FRAGMENT_SHADER
    // src = shader_string
    this.gl = gl;
    this.type = type;
    this.src = src;

    this.init();
  }

  init() {
    this.shader = this.gl.createShader(this.type);
    this.gl.shaderSource(this.shader, this.src);
    this.gl.compileShader(this.shader);

    const didCompile = this.gl.getShaderParameter(
      this.shader,
      this.gl.COMPILE_STATUS
    );

    if (didCompile) {
      return this.shader;
    } else {
      console.log(didCompile);
    }
  }
}
