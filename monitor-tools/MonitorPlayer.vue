<script setup>
import { inject} from "vue";
import {MONIT_INJECT_KEY} from "./utils/constant.js";

const {
  monitorRefData,
  funcModeTaber:{
    funcModeTabs,
    currentModeInfo,
    handles
  }
} =  inject(MONIT_INJECT_KEY)

</script>

<template>
  <div class="video-play-funcs">
    <div class="top-btns">
      <div
          v-for="funcItem in funcModeTabs"
          :key="funcItem.label"
          class="top-btn" :class="[funcItem.mode === monitorRefData.playFuncMode ? 'active' : '']"
          @click="handles.changeMode(funcItem)"
      >
        {{ funcItem.label }}
      </div>
    </div>
    <div class="func-content" >
      <component :is="currentModeInfo.component" ></component>
    </div>
  </div>
</template>

<style scoped lang="scss">
.video-play-funcs {
  width: 100%;
  height: 100%;
  //height: 800px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #fff9f9;

  .top-btns {
    display: flex;
    width: fit-content;
    font-size: 16px;

    .top-btn {
      padding: 10px 24px;
      box-sizing: border-box;
      border: 1px solid #499067;
      &:hover{
        cursor: pointer;
      }

      &.active {
        background-color: #499067;
      }
    }

  }
  .func-content{
    min-height: 0;
    flex-grow: 1;
    margin-top: 12px;
  }
}
</style>