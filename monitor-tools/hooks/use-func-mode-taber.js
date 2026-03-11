import {computed, defineAsyncComponent, shallowReactive} from "vue";
import {EVENT_TYPES, PLAY_FUNC_MODES} from "@/views/supervise/video-monitor/monitor-tools/utils/constant.js";

export function useFuncModeTaber(option = {}) {
  const {monitorRefData, uit, addPlayModes = []} = option;
  const funcModeTabs = shallowReactive([
    {
      label: '预览',
      mode: PLAY_FUNC_MODES.PREVIEW,
      component: defineAsyncComponent(() => import('../func-tabs/MonitorPreview.vue')),
      cb() {
        if (monitorRefData.selectedVideoNodes && monitorRefData.selectedVideoNodes.length) {
          uit.emit(EVENT_TYPES.UPDATE_TREE_SELECTED, monitorRefData.selectedVideoNodes)
        } else {
          uit.emit(EVENT_TYPES.UPDATE_TREE_SELECTED, [])
        }
      }
    },
    {
      label: '回放',
      mode: PLAY_FUNC_MODES.PLAYBACK,
      component: defineAsyncComponent(() => import('../func-tabs/MonitorPlayBack.vue')),
      cb() {
        uit.emit(EVENT_TYPES.UPDATE_TREE_SELECTED, [])
        monitorRefData.playbackNode = null;
      }
    },
    ...addPlayModes
  ])


  const currentModeInfo = computed(() => funcModeTabs.find(item => item.mode === monitorRefData.playFuncMode))

  const handles = {
    changeMode(funcItem) {
      if (funcItem.mode === monitorRefData.playFuncMode) return;
      monitorRefData.playFuncMode = funcItem.mode;
      if(![PLAY_FUNC_MODES.PLAYBACK,PLAY_FUNC_MODES.PREVIEW].includes(funcItem.mode)){
        uit.emit(EVENT_TYPES.UPDATE_TREE_SELECTED, monitorRefData.otherModeSNM[funcItem.mode] || [])
      }
      funcItem?.cb();
    },
  }
  return {
    funcModeTabs,
    currentModeInfo,
    handles
  }
}