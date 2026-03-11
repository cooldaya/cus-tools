<template>
  <div class="joystick-panel" @mousedown="handles.handleMouseDown" @mouseup="handles.handleMouseUp"
    @mouseleave="handles.handleMouseLeave">

    <div v-for="item in dirPanels" :key="item.dir" class="dir-panel-item" :data-dir="item.dir"
      :style="item.cursorStyle">
    </div>
  </div>
</template>

<script setup>
import {getCursorIcon} from "../utils/get-assets.js";
import {monitorApi} from '../monitor-config.js'

const props = defineProps({
  controlDir: {
    type: Function,
    default: monitorApi.hikControlling
  },
})

let CENTER_DIR = 'CENTER'

let currentControlDir = ''
const dirPanels = [
  {
    dir: 'LEFT_UP',
  },
  {
    dir: 'UP'
  },
  {
    dir: 'RIGHT_UP'
  },
  {
    dir: 'LEFT'
  },
  {
    dir: CENTER_DIR
  },
  {
    dir: 'RIGHT'
  },
  {
    dir: 'LEFT_DOWN'
  },
  {
    dir: 'DOWN'
  },
  {
    dir: 'RIGHT_DOWN'
  },
].map(item => ({
  ...item,
  cursorStyle: {
    cursor: item.dir === CENTER_DIR ? 'auto' : `url('${getCursorIcon(item.dir.toLowerCase())}') 16 16, auto`,
  }
}))


const handles = {
  handleMouseDown: (e) => {
    currentControlDir = e.target.dataset.dir;
    if (currentControlDir === CENTER_DIR || !currentControlDir) {
      currentControlDir = '';
      return;
    }
    console.log('start', currentControlDir)
    props.controlDir(currentControlDir,true);
  },
  handleMouseUp: () => {
    if (!currentControlDir) return;
    console.log('stop', currentControlDir)
    props.controlDir(currentControlDir,false);
    currentControlDir = '';
  },
  handleMouseLeave: () => {
    handles.handleMouseUp()
  },
}
</script>

<style lang="scss" scoped>
.joystick-panel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  user-select: none;

  .dir-panel-item {
    min-height: 0;
    min-width: 0;
    display: grid;
    place-content: center;
  }

}
</style>