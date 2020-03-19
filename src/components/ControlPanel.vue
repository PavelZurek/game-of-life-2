<template>
  <div id="controlPanel">
    <div id="controlPanelHeader">
      <button :title="controlPanelCollapsed ? 'Show control panel' : 'Hide control panel'"
              v-on:click="onControlPanelCollapseClick">{{ controlPanelCollapsed ? '&darr;' : '&uarr;' }}</button>
      Control panel
    </div>

    <div id="controlPanelBody"
         v-if="!controlPanelCollapsed">
      <button title="Play/Pause"
              v-on:click="onPausePlayButtonClick">⏸</button>
      <button title="Step"
              v-on:click="onStepButtonClick">🔂</button>
      <button title="Show/Hide grid"
              v-on:click="onGridButtonClick">🌐</button>
      <button title="Show/Hide FPS"
              v-on:click="onFpsButtonClick">FPS</button>

      <input type="color"
             title="Background color"
             v-model="style.backgroundColor"
             v-on:change="updateStyles" />
      <input type="checkbox"
             title="Use single color for cells"
             v-model="style.useCustomCellColor"
             v-on:change="updateStyles" />
      <input type="color"
             title="Cell color"
             v-model="style.cellColor"
             v-on:change="updateStyles" />
    </div>
  </div>
</template>

<script>
  import { dragElement } from "./functions/dragElement.ts";

  export default {
    name: "ControlPanel",
    props: {
      gameController: Object
    },
    data() {
      return {
        controlPanelCollapsed: true,
        style: undefined
      }
    },
    mounted() {
      dragElement('controlPanel', 'controlPanelHeader', {top: '10px', left: '10px'});

      this.style = this.gameController.getStyle();
    },
    methods: {
      onControlPanelCollapseClick() {
        this.controlPanelCollapsed = !this.controlPanelCollapsed;
      },
      onPausePlayButtonClick(mouseEvent) {
        this.gameController.pausePlay();
        if (this.gameController.isGameRunning()) {
          mouseEvent.target.innerText = '⏸';
        } else {
          mouseEvent.target.innerText = '▶';
        }
      },
      onStepButtonClick() {
        if (!this.gameController.isGameRunning()) {
          this.gameController.step();
        }
      },
      updateStyles() {
        this.gameController.setStyle(this.style);
      },
      onFpsButtonClick() {
        this.gameController.toggleStats();
      },
      onGridButtonClick() {
        this.style.showGrid = !this.style.showGrid;
        this.updateStyles();
      }
    }
  }
</script>

<style scoped>
#controlPanel {
  position: absolute;
  padding: 0;
  opacity: 0.2;
  background-color: #A1A1A1;
}
#controlPanel:hover {
  opacity: 0.8;
}
#controlPanelHeader {
  background-color: #31a19f;
  color: #ffffff;
  font-weight: bold;
  cursor: move;
  padding-right: 5px;
}
#controlPanelBody {
  margin: 10px;
}
#controlPanelBody > button {
  padding: 0;
  background: transparent;
  border: none !important;
}
</style>