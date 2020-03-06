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
body {
  margin: 0;
  overflow: hidden;
}
</style>
