<template>
  <canvas id="canvas"></canvas>
</template>

<script>
  export default {
    name: "GameOfLife",
    data() {
      return {
        cellSize: 5
      }
    },
    mounted() {
      this.canvasElement = document.getElementById("canvas");
      this.canvas = this.canvasElement.getContext("2d");

      this.resizeOnPage();

      this.draw();
      setInterval(this.tick, 200);
    },
    methods: {
      resizeOnPage() {
        this.canvasElement.width  = window.innerWidth;
        this.canvasElement.height = window.innerHeight;

        this.sizeX = Math.floor(this.canvasElement.width / this.cellSize);
        this.sizeY = Math.floor(this.canvasElement.height / this.cellSize);

        this.data = [];
        for (let i = 0; i < this.sizeX; i++) {
          let row = [];
          for (let j = 0; j < this.sizeY; j++) {
            row[j] = Math.floor(Math.random() * 2);
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
      },
      tick () {
        this.generation();
        this.draw();
      },
      generation () {
        let newData = [];

        for (let i = 0; i < this.sizeX; i++) {
          let newRow = [];
          for (let j = 0; j < this.sizeY; j++) {
            let liveNeighboursCount = this.numberOfLiveNeighbours(i, j);
            newRow[j] = this.data[i][j];
            if (this.data[i][j] === 1) {
              if (liveNeighboursCount < 2 || liveNeighboursCount > 3) {
                newRow[j] = 0;
              }
            } else {
              if (liveNeighboursCount === 3) {
                newRow[j] = 1;
              }
            }
          }
          newData[i] = newRow;
        }

        this.data = newData;
      },
      numberOfLiveNeighbours (row, column) {
        return this.getCellValue(row - 1, column - 1) +
                this.getCellValue(row - 1, column) +
                this.getCellValue(row - 1, column + 1) +
                this.getCellValue(row, column - 1) +
                this.getCellValue(row, column + 1) +
                this.getCellValue(row + 1, column - 1) +
                this.getCellValue(row + 1, column) +
                this.getCellValue(row + 1, column + 1);
      },
      getCellValue (row, column) {
        if (row < 0) {
          row = this.sizeX - 1;
        }
        if (row >= this.sizeX) {
          row = 0;
        }
        if (column < 0) {
          column = this.sizeY - 1;
        }
        if (column >= this.sizeY) {
          column = 0;
        }
        return this.data[row][column];
      }
    }
  }
</script>

<style scoped>

</style>