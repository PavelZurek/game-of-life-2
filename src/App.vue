<template>
  <GameOfLife />
</template>

<script>
import GameOfLife from "./components/GameOfLife";

export default {
  name: 'App',
  components: {
    GameOfLife
  }
}
</script>

<style>
html, body {
    margin: 0;
    height: 100%;
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
