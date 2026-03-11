<script setup>
import { useTemplateRef,inject} from 'vue'
import {testTreeData} from '../test-data.js'
import {ElMessage} from "element-plus";
import {MONIT_INJECT_KEY,EVENT_TYPES,VIDEO_NODE_TYPE,PLAY_FUNC_MODES} from '../utils/constant.js'


const {
  monitorRefData,
  handles:monitorHandles,
  uit,
  funcModeTaber:{
    currentModeInfo
  }
} =  inject(MONIT_INJECT_KEY)

const props = defineProps({
  treeData: {
    type: Array,
    default: () => (testTreeData)
  },
  viewMaxCount:{
    type:Number,
    default:9
  }
})

const treeProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  disabled(data){
    if(monitorRefData.playFuncMode === PLAY_FUNC_MODES.PREVIEW){
      return false
    }
    if(currentModeInfo.value.viewMaxCount > 1) return false;
    return data.type !== VIDEO_NODE_TYPE
  }
};

const treeCompRef = useTemplateRef('treeComp');
const handles = {
  currentChange(optNode, treeSelectedObj) {
    switch (monitorRefData.playFuncMode) {
      case PLAY_FUNC_MODES.PREVIEW:
        return handles.handlePreviewModeTSC(optNode, treeSelectedObj)
      case PLAY_FUNC_MODES.PLAYBACK:
        return handles.handlePlaybackModeTSC(optNode, treeSelectedObj);
      default:
        return handles.handlePlayOtherModeTSC(monitorRefData.playFuncMode,optNode, treeSelectedObj);
    }
  },
  handlePreviewModeTSC(optNode, treeSelectedObj) {
    let selectedNodes = monitorRefData.selectedVideoNodes;
    const maxCount = props.viewMaxCount;
    const {checkedNodes} = treeSelectedObj;
    const videoCheckedNodes = checkedNodes.filter(node => node.type === VIDEO_NODE_TYPE);
    const preCheckedNodeKeys = selectedNodes.map(item => item.value);
    let finalCheckedNodes = videoCheckedNodes;
    if (videoCheckedNodes.length > maxCount) {
      finalCheckedNodes = [...selectedNodes, ...videoCheckedNodes.filter(node => !preCheckedNodeKeys.includes(node.value))].slice(0, maxCount);
      ElMessage.warning(`最多只能选择${maxCount}个视频`);
    }
    monitorHandles.changePreviewSVNodes(finalCheckedNodes);
    handles.changeTreeStdNodes(finalCheckedNodes);
  },
  handlePlaybackModeTSC(optNode, treeSelectedObj){
    const {checkedNodes} = treeSelectedObj;
    const videoCheckedNodes = checkedNodes.filter(node => node.type === VIDEO_NODE_TYPE);
    if(!videoCheckedNodes.length) return monitorRefData.playbackNode = null
    if(videoCheckedNodes.length > 2){
      ElMessage.warning(`只支持选择单个视频回放`);
      if(monitorRefData.playbackNode){
        handles.changeTreeStdNodes([monitorRefData.playbackNode])
      }
    }else{
      monitorRefData.playbackNode = videoCheckedNodes.filter(item=>item.value !==monitorRefData.playbackNode?.value).at(-1);
      handles.changeTreeStdNodes([monitorRefData.playbackNode])
    }
  },
  handlePlayOtherModeTSC(playFuncMode,optNode, treeSelectedObj){
    const cModeInfo = currentModeInfo.value;
    const cModeViewCount = cModeInfo.viewMaxCount || 1;

    const cModePreSNodes = monitorRefData.otherModeSNM[playFuncMode] || []
    const preCModePreSNodeKeys = cModePreSNodes.map(item => item.value);
    const {checkedNodes} = treeSelectedObj;
    const videoCheckedNodes = checkedNodes.filter(node => node.type === VIDEO_NODE_TYPE);
    if(!videoCheckedNodes.length) return monitorRefData.otherModeSNM[playFuncMode] = []
    let finalCheckedNodes = videoCheckedNodes;
    if(cModeViewCount === 1){ // 单选
      if(videoCheckedNodes.length>2){
        if(cModePreSNodes.length){

          handles.changeTreeStdNodes(cModePreSNodes)
        }
        return ElMessage.warning(`该模式只支持选择单个视频节点`);
      }
      monitorRefData.otherModeSNM[playFuncMode] = videoCheckedNodes.filter(item=>item.value !==cModePreSNodes.at(0)?.value);
      handles.changeTreeStdNodes(monitorRefData.otherModeSNM[playFuncMode])
    }else{
      if (videoCheckedNodes.length > cModeViewCount) {
        finalCheckedNodes = [...cModePreSNodes, ...videoCheckedNodes.filter(node => !preCModePreSNodeKeys.includes(node.value))].slice(0, cModeViewCount);
        ElMessage.warning(`该模式最多只能选择${cModeViewCount}个视频节点`);
      }
      monitorHandles.changePreviewSVNodes(finalCheckedNodes);
      handles.changeTreeStdNodes(finalCheckedNodes);
    }
  },
  changeTreeStdNodes(nodes){
    treeCompRef.value.setCheckedKeys(nodes.map(item => item.value), false);
  },
  getNodeSubVideoNodes(node){
    if(node.type === VIDEO_NODE_TYPE) return node;
    return (node.children || []).map(item=>{
      return item.type === VIDEO_NODE_TYPE ? node : handles.getNodeSubVideoNodes(node)
    })
  },
};


uit.onEvent(EVENT_TYPES.UPDATE_TREE_SELECTED,handles.changeTreeStdNodes)
</script>

<template>
  <div class="site-video-tree">
    <el-tree :data="treeData" show-checkbox @check="handles.currentChange" :props="treeProps" node-key="value"
             ref="treeComp">
      <template #default="{node,data}">
        <slot name="default" :node="node" :data="data">
          <div class="fxc cus-label">
            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 width="20" height="20" v-if="data.type === 'video'">
              <path
                  d="M917.333333 621.866667a5.333333 5.333333 0 0 0-5.333333-5.333334h-64a5.333333 5.333333 0 0 0-5.333333 5.333334v42.293333a5.333333 5.333333 0 0 1-5.333334 5.333333h-61.866666a106.666667 106.666667 0 0 0-72.533334-65.706666 2.08 2.08 0 0 1-0.533333-3.786667l202.133333-116.693333a5.333333 5.333333 0 0 0 1.973334-7.253334l-42.986667-74.666666a5.333333 5.333333 0 0 1 1.92-7.306667l22.773333-13.12a5.333333 5.333333 0 0 0 1.92-7.253333L764.8 156.8a5.333333 5.333333 0 0 0-7.466667-2.133333L80 545.706667a5.333333 5.333333 0 0 0-0.693333 8.746666l156.373333 126.24a5.333333 5.333333 0 0 0 5.973333 0.48L336 627.04c26.666667-15.36 69.013333-48 113.066667-48a83.093333 83.093333 0 0 1 54.346666 20.16 5.333333 5.333333 0 0 0 6.026667 0.533333l282.24-162.933333a5.333333 5.333333 0 0 1 7.2 1.973333l5.653333 9.866667a5.333333 5.333333 0 0 1-1.92 7.253333l-332.426666 192a5.333333 5.333333 0 0 1-7.253334-1.92l-28.533333-49.333333a5.333333 5.333333 0 0 0-7.253333-1.973333l-55.466667 32a5.333333 5.333333 0 0 0-1.92 7.253333l17.44 30.186667a5.333333 5.333333 0 0 1-1.973333 7.253333L362.666667 684.053333a5.333333 5.333333 0 0 1-7.2-1.973333l-17.333334-30.026667a5.333333 5.333333 0 0 0-7.253333-1.92l-55.466667 32a5.333333 5.333333 0 0 0-1.92 7.253334L328.213333 784a5.333333 5.333333 0 0 0 7.253334 1.92L422.56 736a5.333333 5.333333 0 0 1 7.253333 1.92l5.706667 9.866667a5.333333 5.333333 0 0 0 7.253333 1.973333l127.573334-73.653333a2.08 2.08 0 0 1 3.04 2.346666 106.026667 106.026667 0 0 0 45.173333 117.333334 97.6 97.6 0 0 0 93.066667 68.32H837.333333a5.333333 5.333333 0 0 1 5.333334 5.333333V912a5.333333 5.333333 0 0 0 5.333333 5.333333h64a5.333333 5.333333 0 0 0 5.333333-5.333333zM508.586667 514.08a5.333333 5.333333 0 0 1-4.48 0.32 156.266667 156.266667 0 0 0-55.093334-9.973333c-57.653333 0-105.44 29.92-137.013333 49.76-5.333333 3.146667-63.04 36.853333-63.04 36.853333a5.333333 5.333333 0 0 1-5.973333-0.48l-32-25.706667a5.333333 5.333333 0 0 1 0.693333-8.693333l518.4-299.306667a5.333333 5.333333 0 0 1 7.253333 1.92L788.16 346.666667a5.333333 5.333333 0 0 1-1.973333 7.253333z m198.986666 192.48a31.68 31.68 0 1 1-31.68-31.626667 31.68 31.68 0 0 1 31.68 31.626667z m129.76 83.2h-88.373333a2.506667 2.506667 0 0 1-1.76-4.373333 105.866667 105.866667 0 0 0 27.466667-39.68 2.56 2.56 0 0 1 2.346666-1.6H837.333333a5.333333 5.333333 0 0 1 5.333334 5.333333v35.04a5.333333 5.333333 0 0 1-5.333334 5.28z"
              />
              <path
                  d="M675.893333 706.56m-18.666666 0a18.666667 18.666667 0 1 0 37.333333 0 18.666667 18.666667 0 1 0-37.333333 0Z"
              />
            </svg>
            <span class="ml-4">{{ data.label }}</span>
          </div>
        </slot>
      </template>

    </el-tree>
  </div>
</template>

<style scoped lang="scss">
.site-video-tree {
  padding-top: 14px;
  .fxc {
    display: flex;
    align-items: center;
  }

  .ml-4 {
    margin-left: 6px;
  }

  .el-tree {
    .cus-label {
      fill: #ffffff;
    }

    .is-checked .cus-label {
      color: var(--el-color-primary);

      .icon {
        fill: var(--el-color-primary);
      }
    }
  }
}
</style>