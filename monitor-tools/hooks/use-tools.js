import {computed, reactive, provide} from "vue";
import {useMitt} from "./use-mitt.js";
import {useFuncModeTaber} from './use-func-mode-taber.js'
import {MONIT_INJECT_KEY, EVENT_TYPES,PLAY_FUNC_MODES} from '../utils/constant.js'



/**
 *
 * @param option
 *   {
 *     viewMaxCount: 9   // 最多预览数量
 *   }
 * @ returns {{uit: {emitter: Emitter<Record<EventType, unknown>>, onEvents: onEvents, offEvents: offEvents, onEvent: onEvent, emit: {<Key extends keyof Events>(type: Key, event: Events[Key]): void, <Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void}}, monitorRefData: UnwrapNestedRefs<{</Key>}}}}
 */
export function useMonitorTool(option={}) {
  const monitorRefData = reactive({
    selectedVideoNodes: [],
    selectedWrap:{
      nodeValue:null,
      nodeIndex:-1
    },
    playFuncMode:PLAY_FUNC_MODES.PREVIEW,
    playbackNode:null,
    otherModeSNM:{ // 其他模式选择的节点

    }
  })
  const monitorOption = reactive({
    viewMaxCount:option.viewMaxCount || 9
  })


  const uit = useMitt();
  const funcModeTaber =  useFuncModeTaber({
    uit,
    monitorRefData,
    addPlayModes:option.addPlayModes ||[]
  });

  // 选中，云台控制
  const selectedVideoNode = computed(()=>{
    if(monitorRefData.selectedWrap.nodeValue) return monitorRefData.selectedVideoNodes.find(node=>node.value===monitorRefData.selectedWrap.nodeValue);
    return null
  })

  const handles = {
    changePreviewSVNodes(newVal, updateTreeSelected = false) {
      handles.changeSelectedVideoNodesByMode(PLAY_FUNC_MODES.PREVIEW,newVal, updateTreeSelected);
    },
    changeSelectedVideoNodesByMode(playMode=PLAY_FUNC_MODES.PREVIEW,newVal=[], updateTreeSelected = false) {
      if(!Array.isArray(newVal)) return console.error('changeSelectedVideoNodesByMode newVal must be array');
      switch ( playMode) {
        case PLAY_FUNC_MODES.PREVIEW:
          monitorRefData.selectedVideoNodes = newVal;
          break;
        case PLAY_FUNC_MODES.PLAYBACK:
          monitorRefData.playbackNode = newVal.at(-1);
          break;
        default:
          monitorRefData.otherModeSNM[playMode] = newVal;
      }
      if (updateTreeSelected) {
        uit.emit(EVENT_TYPES.UPDATE_TREE_SELECTED, newVal);
      }
    }

  }


  const monitorTool = {
    uit,
    monitorRefData,
    selectedVideoNode,
    monitorOption,
    funcModeTaber,
    handles
  }

  provide(MONIT_INJECT_KEY, monitorTool)


  return monitorTool;
}
