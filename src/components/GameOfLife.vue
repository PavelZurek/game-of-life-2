<template>
  <div>
    <ControlPanel :game-controller="{
      pausePlay: pausePlay,
      step: tick,
      isGameRunning: isGameRunning,
      getStyle: getStyle,
      setStyle: setStyle,
      getValues: getValues,
      setValues: setValues,
      toggleStats: toggleStats
    }" />
    <canvas id="canvas"
            v-on:click="onCanvasMoveOrClick"
            v-on:mousemove="onCanvasMoveOrClick"></canvas>
    <div v-if="this.fps.show" id="fps">
      <div title="current">C: {{ this.fps.currentFps }}</div>
      <div title="average per last 50 frames">A: {{ this.fps.averageFps }}</div>
    </div>
  </div>
</template>

<script>
  import ControlPanel from "./ControlPanel";

  const AVERAGE_FPS_FRAMES_COUNT = 50;

  export default {
    name: "GameOfLife",
    components: {
      ControlPanel
    },
    data() {
      return {
        sizeX: undefined,
        sizeY: undefined,
        data: undefined,
        canvasElement: undefined,
        canvas: undefined,
        intervalId: undefined,
        fps: {
          show: false,
          currentTime: undefined,
          frameTimeSpacing: [],
          currentFps: undefined,
          averageFps: undefined
        },
        style: {
          cellSize: 10,
          showGrid: false,
          backgroundColor: '#000000',
          useCustomCellColor: false,
          cellColor: '#00FF00'
        }
      }
    },
    mounted() {
      this.fps.currentTime = (new Date()).getTime();
      this.canvasElement = document.getElementById("canvas");
      this.canvas = this.canvasElement.getContext("2d");

      document.getElementsByTagName('body')[0].style['background'] = this.style.backgroundColor;

      this.resizeOnPage();

      this.draw();
      this.pausePlay();
    },
    methods: {
      onCanvasMoveOrClick(mouseEvent) {
        if (mouseEvent.type === 'mousemove' && mouseEvent.buttons === 1 || mouseEvent.type === 'click') {
          const canvasPosition = this.canvasElement.getBoundingClientRect();

          const x = Math.floor((mouseEvent.clientX - canvasPosition.x) / this.style.cellSize);
          const y = Math.floor((mouseEvent.clientY - canvasPosition.y) / this.style.cellSize);

          this.data[x][y] = mouseEvent.shiftKey ? 0 : 1;
          this.draw();
        }
      },
      setStyle(style) {
        this.style = {
          ...this.style,
          ...style
        };

        document.getElementsByTagName('body')[0].style['background'] = this.style.backgroundColor;

        if (!this.isGameRunning()) {
          this.draw();
        }
      },
      getStyle() {
        return this.style;
      },
      isGameRunning() {
        return !!this.intervalId;
      },
      pausePlay() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        } else {
          this.intervalId = setInterval(this.tick, 100);
        }
      },
      toggleStats() {
        this.fps.show = !this.fps.show;
      },
      resizeOnPage() {
        this.canvasElement.width  = window.innerWidth;
        this.canvasElement.height = window.innerHeight;

        this.sizeX = Math.floor(this.canvasElement.width / this.style.cellSize);
        this.sizeY = Math.floor(this.canvasElement.height / this.style.cellSize);

        this.data = [];
        for (let i = 0; i < this.sizeX; i++) {
          let row = [];
          for (let j = 0; j < this.sizeY; j++) {
            row[j] = Math.floor(Math.random() * 2);
          }
          this.data[i] = row;
        }
      },
      tick () {
        this.recountFPS();
        this.generation();
        this.draw();
      },
      recountFPS() {
        const previousTime = this.fps.currentTime;
        this.fps.currentTime = (new Date()).getTime();

        const currentDifference = this.fps.currentTime - previousTime;

        this.fps.frameTimeSpacing.push(currentDifference);
        if (this.fps.frameTimeSpacing.length > AVERAGE_FPS_FRAMES_COUNT) {
          this.fps.frameTimeSpacing.shift();
        }

        this.fps.currentFps = 1000 / currentDifference;
        const averageDifference = this.fps.frameTimeSpacing.reduce((total, num) => { return total + num; }) / this.fps.frameTimeSpacing.length;
        this.fps.averageFps = 1000 / averageDifference;
      },
      draw() {
        this.canvas.fillStyle = this.style.backgroundColor;
        this.canvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        for (let i = 0; i < this.sizeX; i++) {
          for (let j = 0; j < this.sizeY; j++) {
            if (this.data[i][j]) {
              this.canvas.fillStyle = this.getCellColor(this.data[i][j]);
              this.canvas.fillRect(
                i * this.style.cellSize,
                j * this.style.cellSize,
                this.style.cellSize,
                this.style.cellSize
              );
            }
          }
        }

        if (this.style.showGrid) {
          this.canvas.lineWidth = 0.5;
          this.canvas.strokeStyle = '#FFFFFF';
          this.canvas.beginPath();

          for (let i = 0; i < this.sizeX; i++) {
            const x = i * this.style.cellSize;
            this.canvas.moveTo(x, 0);
            this.canvas.lineTo(x, this.canvasElement.height);
          }
          for (let i = 0; i < this.sizeY; i++) {
            const y = i * this.style.cellSize;
            this.canvas.moveTo(0, y);
            this.canvas.lineTo(this.canvasElement.width, y);
          }

          this.canvas.stroke();
        }
      },
      getCellColor (value) {
        if (this.style.useCustomCellColor) {
          return this.style.cellColor;
        }

        value -= 1;
        if (value < 256) {
          return `rgb(${value},255,0)`;
        } else if (value >= 512) {
          return 'rgb(255,0,0)';
        } else {
          return `rgb(255,${511 - value},0)`;
        }
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
          row = this.data.length - 1;
        } else if (row >= this.data.length) {
          row = 0;
        }
        if (column < 0) {
          column = this.data[row].length - 1;
        } else if (column >= this.data[row].length) {
          column = 0;
        }
        return this.data[row][column] > 0 ? 1 : 0;
      },
      getValues (callback) {
        console.log({
          data: this.data
        })
        for (let i = 0; i < this.sizeX; i++) {
          for (let j = 0; j < this.sizeY; j++) {
            callback(i, j, this.data[i][j]);
          }
        }
      },
      setValues (callback) {
        let newData = [];

        for (let i = 0; i < this.sizeX; i++) {
          newData[i] = [];
          for (let j = 0; j < this.sizeY; j++) {
            newData[i][j] = Number(callback(i, j));
          }
        }

        this.data = newData;
        this.draw();
      }
    }
  }
</script>

<style scoped>
#fps {
  position: absolute;
  color: #ffffff;
  bottom: 0;
}
</style>