<script setup>
import {inject, reactive, watch} from "vue";
import TimeSegment from '../comps/TimeSegment.vue'
import dayjs from '../libs/dayjs.js';
import HlsPlayer from "../comps/HlsPlayer.vue";
import {MONIT_INJECT_KEY} from "../utils/constant.js";
import {monitorApi} from "../monitor-config.js";
import {ElMessage} from "element-plus";

const {monitorRefData} = inject(MONIT_INJECT_KEY);

const refData = reactive({
  hlsLoading:false,
  hlsUrl: "",
  dateTimeRange: {
    beginTime: "",
    endTime: ""
  }
})


const handles = {
  handleTimeRangeChange(val) {
    const formatter = (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    Object.assign(refData.dateTimeRange, {
      beginTime: formatter(val.beginTime),
      endTime: formatter(val.endTime)
    })
    handles.handlePlaybackNodeChange(monitorRefData.playbackNode)
  },
  async requestPlackBackUrl() {
    refData.hlsLoading = true;
    const playbackNode = monitorRefData.playbackNode;
    const payload = {
      cameraIndexCode: playbackNode.value,
      ...refData.dateTimeRange,
      inout: "1",
      protocol: "rtsp",
    }
    const res = await monitorApi.playbackHlsUrl(payload);
    const url = res?.data?.data;
    if(!url){
      return ElMessage.error("回放视频不存在！");
    }
    refData.hlsUrl = url;
    refData.hlsLoading = false;
  },
  handlePlaybackNodeChange(node) {
    const dateTimeRange = refData.dateTimeRange
    const condition = [node,node?.value,dateTimeRange.beginTime,dateTimeRange.endTime].every(item => !!item)
    if(condition) handles.requestPlackBackUrl();
  }
}

watch(() => monitorRefData.playbackNode, handles.handlePlaybackNodeChange)
</script>

<template>
  <div class="monitor-play-back">
    <div class="play-back-content" v-if="monitorRefData.playbackNode">
      <div class="hls-player-wrap" v-loading="refData.hlsLoading" :element-loading-text="'加载中'">
        <HlsPlayer :hlsUrl="refData.hlsUrl" />
      </div>
      <div class="time-line-wrap">
        <TimeSegment immediate @timeRangeChange="handles.handleTimeRangeChange"/>
      </div>
    </div>
    <div class="no-select-node" v-else>
      <span>请选择播放节点</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.monitor-play-back{
  height: 100%;
  .play-back-content{
    height: 100%;
    display: flex;
    flex-direction: column;

    .hls-player-wrap{
      min-height: 0;
      flex:1;
    }
    .time-line-wrap{
      margin-top: 14px;
    }
  }
  .no-select-node{
    height: 100%;
    display: grid;
    place-content: center;
    background-color: #5e5e5e;
    span{
      font-size: 16px;
    }
    color: #ffbd33;
  }

}
</style>