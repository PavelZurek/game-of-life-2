<template>
  <div>
    <div id="controlPanel">
      <button v-on:click="onPausePlayButtonClick" title="Play/Pause">⏸</button>
      <button v-on:click="tick" title="Step" v-bind:disabled="intervalId">🔂</button>
      <button v-on:click="onGridButtonClick" title="Show/Hide grid">🌐</button>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: "GameOfLife",
    data() {
      return {
        cellSize: 5,
        showGrid: false,
        intervalId: undefined
      }
    },
    mounted() {
      this.canvasElement = document.getElementById("canvas");
      this.canvas = this.canvasElement.getContext("2d");

      this.resizeOnPage();

      this.draw();
      this.pausePlay();
    },
    methods: {
      onGridButtonClick() {
        this.showGrid = !this.showGrid;
        if (!this.intervalId) {
          this.draw();
        }
      },
      onPausePlayButtonClick(mouseEvent) {
        this.pausePlay();
        if (this.intervalId) {
          mouseEvent.target.innerText = '⏸';
        } else {
          mouseEvent.target.innerText = '▶';
        }
      },
      pausePlay() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        } else {
          this.intervalId = setInterval(this.tick, 100);
        }
      },
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

        for (let i = 0; i < this.sizeX; i++) {
          for (let j = 0; j < this.sizeY; j++) {
            if (this.data[i][j]) {
              this.canvas.fillStyle = this.getCellColor(this.data[i][j]);
              this.canvas.fillRect(
                i * this.cellSize,
                j * this.cellSize,
                this.cellSize,
                this.cellSize
              );
            }
          }
        }

        if (this.showGrid) {
          this.canvas.lineWidth = 0.5;
          this.canvas.strokeStyle = '#FFFFFF';
          this.canvas.beginPath();

          for (let i = 0; i < this.sizeX; i++) {
            const x = i * this.cellSize;
            this.canvas.moveTo(x, 0);
            this.canvas.lineTo(x, this.canvasElement.height);
          }
          for (let i = 0; i < this.sizeY; i++) {
            const y = i * this.cellSize;
            this.canvas.moveTo(0, y);
            this.canvas.lineTo(this.canvasElement.width, y);
          }

          this.canvas.stroke();
        }
      },
      getCellColor (value) {
        value -= 1;
        if (value < 256) {
          return `rgb(${value},255,0)`;
        } else if (value > 512) {
          return 'rgb(255,0,0)';
        } else {
          return `rgb(255,${512 - value},0)`;
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
            if (this.data[i][j] > 0) {
              if (liveNeighboursCount < 2 || liveNeighboursCount > 3) {
                newRow[j] = 0;
              } else {
                if (newRow[j] < 513) {
                  newRow[j] ++;
                }
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
        return this.data[row][column] > 0 ? 1 : 0;
      }
    }
  }
</script>

<style scoped>
#controlPanel {
  position: absolute;
  margin: 10px;
  padding: 10px;
  opacity: 0.2;
  background-color: #A1A1A1;
}
#controlPanel:hover {
  opacity: 0.8;
}
#controlPanel > button {
  padding: 0;
  background: transparent;
  border: none !important;
}
</style>