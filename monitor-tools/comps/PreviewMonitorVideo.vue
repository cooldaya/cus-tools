<script setup>
import {inject, onMounted, reactive, useTemplateRef} from "vue";
import HlsPlayer from './HlsPlayer.vue';
import JoystickPanel from './JoystickPanel.vue';
import {monitorApi} from "../monitor-config.js";
import {getSvgIcon} from "../utils/get-assets.js";
import {MONIT_INJECT_KEY} from '../utils/constant.js'
import {changeMonitorControl} from '../utils/funcs.js'


const monitorTool =  inject(MONIT_INJECT_KEY)
const props = defineProps({
  videoNode: {
    type: Object,
    default: () => {
    }
  },
})
const previewVideoRef = useTemplateRef('previewVideoRef');
const hlsPlayerRef = useTemplateRef('hlsPlayerRef');


const refData = reactive({
  hlsUrlLoading: false,
  streamType:0, //0:主码流，1:子码流
  hlsUrl: '',
  showJoystickPanel: false,
  activeTools: {}
});

const toolsMenu = [
  {
    iconUrl: getSvgIcon('capture-icon'),
    label: '拍照',
    toolCode:'capture',
    action: () => {
      hlsPlayerRef.value.getCapture(props.videoNode.label);
    }
  },
  {
    iconUrl: getSvgIcon('stream-switch-icon'),
    label: '切换码流',
    toolCode:'stream-switch',
    action: () => {
      refData.streamType = refData.streamType === 0 ? 1 : 0;
     handles.requestHlsUrl()
    }
  },
  {
    iconUrl: getSvgIcon('joystick-icon'),
    label: '操控台',
    toolCode:'console',
    action: (toolItem) => {
      refData.activeTools[toolItem.toolCode] = refData.showJoystickPanel = !refData.showJoystickPanel;
    }
  }
]


const handles = {
  toggleFullscreen() {
    const targetEl = previewVideoRef.value;
    document.fullscreenElement ? document.exitFullscreen() : targetEl.requestFullscreen()
  },
  async requestHlsUrl() {
    const payload = {
      cameraIndexCode: props.videoNode.value,
      streamType: refData.streamType
    }
    refData.hlsUrlLoading = true;
    try {
      const res = await monitorApi.getPreviewUrl(payload);
      refData.hlsUrl = res?.data?.data;
    } catch (e) {
      console.log(e)
    } finally {
      refData.hlsUrlLoading = false;
    }
  },
  async changeDirection(dir,isMove) {
    const cameraIndexCode = props.videoNode.value;
    changeMonitorControl(cameraIndexCode,dir,isMove)
  },
  closeSingleVideo() {
    const selectedVideoNodes = monitorTool.monitorRefData.selectedVideoNodes;
    const newSelectedVideoNodes = selectedVideoNodes.filter(item => item.value !== props.videoNode.value);
    monitorTool.handles.changePreviewSVNodes(newSelectedVideoNodes,true)
  }
}


onMounted(() => {
  handles.requestHlsUrl()
})
</script>

<template>
  <div class="preview-monitor-video" v-loading="refData.hlsUrlLoading" :element-loading-text="'加载中'"
       ref="previewVideoRef">
    <div class="top-overlay">
      <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
           width="20" height="20" fill="#6f7e91">
        <path
            d="M917.333333 621.866667a5.333333 5.333333 0 0 0-5.333333-5.333334h-64a5.333333 5.333333 0 0 0-5.333333 5.333334v42.293333a5.333333 5.333333 0 0 1-5.333334 5.333333h-61.866666a106.666667 106.666667 0 0 0-72.533334-65.706666 2.08 2.08 0 0 1-0.533333-3.786667l202.133333-116.693333a5.333333 5.333333 0 0 0 1.973333-7.253334l-42.986667-74.666666a5.333333 5.333333 0 0 1 1.92-7.306667l22.773333-13.12a5.333333 5.333333 0 0 0 1.92-7.253333L764.8 156.8a5.333333 5.333333 0 0 0-7.466667-2.133333L80 545.706667a5.333333 5.333333 0 0 0-0.693333 8.746666l156.373333 126.24a5.333333 5.333333 0 0 0 5.973333 0.48L336 627.04c26.666667-15.36 69.013333-48 113.066667-48a83.093333 83.093333 0 0 1 54.346666 20.16 5.333333 5.333333 0 0 0 6.026667 0.533333l282.24-162.933333a5.333333 5.333333 0 0 1 7.2 1.973333l5.653333 9.866667a5.333333 5.333333 0 0 1-1.92 7.253333l-332.426666 192a5.333333 5.333333 0 0 1-7.253334-1.92l-28.533333-49.333333a5.333333 5.333333 0 0 0-7.253333-1.973333l-55.466667 32a5.333333 5.333333 0 0 0-1.92 7.253333l17.44 30.186667a5.333333 5.333333 0 0 1-1.973333 7.253333L362.666667 684.053333a5.333333 5.333333 0 0 1-7.2-1.973333l-17.333334-30.026667a5.333333 5.333333 0 0 0-7.253333-1.92l-55.466667 32a5.333333 5.333333 0 0 0-1.92 7.253334L328.213333 784a5.333333 5.333333 0 0 0 7.253334 1.92L422.56 736a5.333333 5.333333 0 0 1 7.253333 1.92l5.706667 9.866667a5.333333 5.333333 0 0 0 7.253333 1.973333l127.573334-73.653333a2.08 2.08 0 0 1 3.04 2.346666 106.026667 106.026667 0 0 0 45.173333 117.333334 97.6 97.6 0 0 0 93.066667 68.32H837.333333a5.333333 5.333333 0 0 1 5.333334 5.333333V912a5.333333 5.333333 0 0 0 5.333333 5.333333h64a5.333333 5.333333 0 0 0 5.333333-5.333333zM508.586667 514.08a5.333333 5.333333 0 0 1-4.48 0.32 156.266667 156.266667 0 0 0-55.093334-9.973333c-57.653333 0-105.44 29.92-137.013333 49.76-5.333333 3.146667-63.04 36.853333-63.04 36.853333a5.333333 5.333333 0 0 1-5.973333-0.48l-32-25.706667a5.333333 5.333333 0 0 1 0.693333-8.693333l518.4-299.306667a5.333333 5.333333 0 0 1 7.253333 1.92L788.16 346.666667a5.333333 5.333333 0 0 1-1.973333 7.253333z m198.986666 192.48a31.68 31.68 0 1 1-31.68-31.626667 31.68 31.68 0 0 1 31.68 31.626667z m129.76 83.2h-88.373333a2.506667 2.506667 0 0 1-1.76-4.373333 105.866667 105.866667 0 0 0 27.466667-39.68 2.56 2.56 0 0 1 2.346666-1.6H837.333333a5.333333 5.333333 0 0 1 5.333334 5.333333v35.04a5.333333 5.333333 0 0 1-5.333334 5.28z"
        />
        <path
            d="M675.893333 706.56m-18.666666 0a18.666667 18.666667 0 1 0 37.333333 0 18.666667 18.666667 0 1 0-37.333333 0Z"
        />
      </svg>
      <span class="camera-name ml-6">{{ videoNode.label || '未知设备' }}</span>
      <span class="stream-type">({{refData.streamType === 0 ? '主码流' : '子码流'}})</span>
      <span class="preview-text">
        正在预览
      </span>
      <img :src="getSvgIcon('close-icon')" alt="关闭" class="close-btn ml-6" @click.stop="handles.closeSingleVideo">
    </div>

    <!-- 视频控件 -->
    <div class="hls-video-wrap" @dblclick="handles.toggleFullscreen">
      <HlsPlayer :hls-url="refData.hlsUrl" ref="hlsPlayerRef"/>
    </div>

    <div class="bottom-overlay">
      <div class="tool-item" v-for="toolItem in toolsMenu" :key="toolItem.label" @click.stop="toolItem.action(toolItem)"
           :title="toolItem.label" :class="{
             active: refData.activeTools[toolItem.toolCode]
           }">
        <img :src="toolItem.iconUrl" :alt="toolItem.label" class="svg-icon">
      </div>
    </div>
    <div class="joystick-panel-wrap" v-show="refData.showJoystickPanel">
      <JoystickPanel :controlDir="handles.changeDirection" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.preview-monitor-video {
  width: 100%;
  height: 100%;
  position: relative;

  .hls-video-wrap {
    height: 100%;
  }

  &:hover {
    .top-overlay, .bottom-overlay {
      opacity: 1;
      visibility: visible;
    }
  }

  .top-overlay, .bottom-overlay {
    position: absolute;
    width: 100%;
    height: 10%;
    max-height: 30px;
    z-index: 20;
    background-color: #000000cc;
    display: flex;
    align-items: center;
    padding: 0 12px;
    opacity: 0;
    visibility: hidden;
    transition-duration: 600ms;
  }

  .ml-6 {
    margin-left: 6px;
  }

  .top-overlay {
    top: 0;
    .stream-type{
      font-size: 12px;
      color: #b5b5b5;
    }
    .preview-text{
      margin-left: auto;
    }
    .close-btn{
      width: 20px;
      cursor: pointer;
    }
  }

  .bottom-overlay {
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;

    .tool-item {
      width: 20px;
      height: 20px;
      cursor: pointer;
      filter: brightness(0.6);
      transition-duration: 300ms;
      &:hover{
        filter: brightness(0.8);
      }


      .svg-icon {
        width: 100%;
        height: 100%;
      }
      &.active{
        filter: brightness(1.2);
      }
    }

  }

  .joystick-panel-wrap{
    position: absolute;
    z-index: 10;
    inset: 0;
  }

}
</style>