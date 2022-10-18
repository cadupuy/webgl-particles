import CreateShader from './CreateShader.js';
import CreateProgram from './CreateProgram.js';

import { hexToRgb } from './Utils/hexToRbg.js';

import vert from './shaders/vert.glsl';
import frag from './shaders/frag.glsl';

export default class Experience {
  constructor() {
    this.dpr = window.devicePixelRatio;
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.gl = null;

    this.time = 0;

    this.vShader = null;
    this.fShader = null;
    this.program = null;

    // Attributes
    this.positionAttribLoc = null;
    this.colorAttribLoc = null;

    // uniforms
    this.timeUniformLoc = null;

    this.buffer = null;
    this.data = [];
    this.array = [];
    this.NB_POINTS = 10000;

    this.setupCanvas();
    this.setupProgram();
    this.setupData();
    this.render();
    this.onframe();
  }

  setupCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.height = `${this.size.height}px`;
    canvas.style.width = `${this.size.width}px`;
    canvas.style.background = 'black';
    canvas.width = this.size.width * this.dpr;
    canvas.height = this.size.height * this.dpr;
    this.gl = canvas.getContext('webgl');
    document.body.appendChild(canvas);
  }

  setupProgram() {
    this.vShader = new CreateShader(this.gl, this.gl.VERTEX_SHADER, vert);
    this.fShader = new CreateShader(this.gl, this.gl.FRAGMENT_SHADER, frag);
    this.program = new CreateProgram(
      this.gl,
      this.vShader.shader,
      this.fShader.shader
    );
  }

  setupData() {
    this.positionAttribLoc = this.gl.getAttribLocation(
      this.program.prg,
      'aPosition'
    );
    this.colorAttribLoc = this.gl.getAttribLocation(this.program.prg, 'aColor');
    this.timeUniformLoc = this.gl.getUniformLocation(this.program.prg, 'uTime');

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const palettes = ['#ff00ff', '#fff000', '#000fff'];
    for (let i = 0; i < this.NB_POINTS; i++) {
      const x = -1 + Math.random() * 2;
      const y = -1 + Math.random() * 2;

      const idx = Math.floor(Math.abs(Math.sin(x * y * 20)) * palettes.length);
      // const idx = Math.floor(Math.random() * palettes.length);
      const color = palettes[idx];
      let { r, g, b } = hexToRgb(color);

      // Le gpu attend des valeurs entre 0 et 1
      r /= 255;
      g /= 255;
      b /= 255;

      this.array.push(x, y, r, g, b);
    }

    this.data = new Float32Array(this.array);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.data, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  render() {
    this.gl.viewport(
      0,
      0,
      this.size.width * this.dpr,
      this.size.height * this.dpr
    );
    this.gl.useProgram(this.program.prg);

    //bind data
    this.gl.enableVertexAttribArray(this.positionAttribLoc);
    this.gl.enableVertexAttribArray(this.colorAttribLoc);
    this.gl.uniform1f(this.timeUniformLoc, this.time);

    //read
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    this.gl.vertexAttribPointer(
      this.positionAttribLoc,
      2,
      this.gl.FLOAT,
      false,
      20,
      0
    );
    this.gl.vertexAttribPointer(
      this.colorAttribLoc,
      3,
      this.gl.FLOAT,
      false,
      20,
      8
    );

    this.gl.drawArrays(this.gl.POINTS, 0, 10000);
  }

  update() {
    this.time += 0.01;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.data);
  }

  onframe() {
    this.update();
    this.render();
    window.requestAnimationFrame(() => {
      this.onframe();
    });
  }
}
