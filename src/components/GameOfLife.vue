<template>
  <canvas id="canvas"></canvas>
</template>

<script>
  export default {
    name: "GameOfLife",
    mounted() {
      this.canvasElement = document.getElementById("canvas");
      this.canvas = this.canvasElement.getContext("2d");
      this.resizeCanvasOnPage();
    },
    methods: {
      resizeCanvasOnPage() {
        this.canvasElement.width  = window.innerWidth;
        this.canvasElement.height = window.innerHeight;
      }
    }
  }
</script>

<style scoped>
#canvas {

}
</style>