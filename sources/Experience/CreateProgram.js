export default class CreateProgram {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.init();
  }

  init() {
    this.prg = this.gl.createProgram();
    this.gl.attachShader(this.prg, this.vertexShader);
    this.gl.attachShader(this.prg, this.fragmentShader);
    this.gl.linkProgram(this.prg);

    const didLink = this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS);

    if (didLink) {
      return this.prg;
    } else {
      console.warn(this.gl.getShaderInfoLog(this.prg));
    }
  }
}
