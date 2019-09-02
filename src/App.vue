<template>
  <div id="app">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import Phaser from 'phaser';
import MainScene from "./Scene.js";
import SATPlugin from './phaser-sat';

export default {
  name: 'app',
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  mounted () {
    this.resize();
    let config = {
        type: Phaser.WEBGL,
        canvas: this.$refs.canvas,
        antialias: true,
        pixelArt: false,
        width: this.width,
        height: this.height,
        backgroundColor: '#222222',
        plugins: {
            global: [
                { key: 'SATPlugin', plugin: SATPlugin, start: true }
            ]
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 400 },
                debug: false
            }
        },
        scene: [MainScene],
    };

    new Phaser.Game(config);
  },
  methods: {
    resize () {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }
  },
  components: {
  }
}
</script>