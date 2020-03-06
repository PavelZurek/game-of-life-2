<template>
  <canvas id="canvas"></canvas>
</template>

<script>
  export default {
    name: "GameOfLife",
    data() {
      return {
        sizeX: 20,
        sizeY: 20,
        cellSize: 5
      }
    },
    mounted() {
      this.canvasElement = document.getElementById("canvas");
      this.canvas = this.canvasElement.getContext("2d");

      this.resizeCanvasOnPage();
      this.initData();
    },
    methods: {
      resizeCanvasOnPage() {
        this.canvasElement.width  = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
      },
      initData() {
        this.data = [];
        for (let i = 0; i < this.sizeX; i++) {
          let row = [];
          for (let j = 0; j < this.sizeY; j++) {
            row[j] = 0;
          }
          this.data[i] = row;
        }
      },
      draw() {
        this.canvas.fillStyle = '#000000';
        this.canvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        this.canvas.fillStyle = '#00FF00';
        for (let i = 0; i < this.sizeX; i++) {
          for (let j = 0; j < this.sizeY; j++) {
            if (this.data[i][j]) {
              this.canvas.fillRect(
                i * this.cellSize,
                j * this.cellSize,
                this.cellSize,
                this.cellSize
              );
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
#canvas {

}
</style>