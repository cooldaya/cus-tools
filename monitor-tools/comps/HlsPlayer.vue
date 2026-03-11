<script setup>
import {useTemplateRef, reactive, watch, onBeforeUnmount} from "vue";
import Hls from "hls.js";

const props = defineProps({
  hlsUrl: {
    type: String,
    default: () => ''
  }
})


let hlsInstance = null;
const hlsVideoRef = useTemplateRef('hlsVideoRef')

const refData = reactive({
  hlsLoading: false
})


const handles = {
  initHlsPlayer() {
    refData.hlsLoading = true;
    const videoEl = hlsVideoRef.value;
    if (!videoEl) setTimeout(() => {
      handles.initHlsPlayer()
    }, 1000)
    const hlsUrl = props.hlsUrl;
    // 检查浏览器支持情况
    if (Hls.isSupported()) {
      // 使用hls.js播放
      hlsInstance = new Hls({
        disableAudioTracks: true, // 若不需要音频，设为 true（减少音频解码消耗）
        enableWorker: true, // 启用Web Worker（提升解码性能）
      });

      hlsInstance.loadSource(hlsUrl);
      hlsInstance.attachMedia(hlsVideoRef.value);

      // 监听HLS事件
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        hlsVideoRef.value
            .play()
            .catch((err) => {
              console.error("自动播放失败:", err);
            })
            .finally(() => {
              refData.hlsLoading = false;
            });
      });
    } else if (
        hlsVideoRef.value?.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Safari 直接支持HLS
      hlsVideoRef.value.src = hlsUrl;
      hlsVideoRef.value.addEventListener("loadedmetadata", () => {
        hlsVideoRef.value
            .play()
            .catch((err) => {
              console.error("播放失败:", err);
            })
            .finally(() => {
              refData.hlsLoading = false;
            });
      });
    } else {
      alert("您的浏览器不支持HLS视频播放");
      refData.hlsLoading = false;
    }
  },
  disposeHlsPlayer() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  },

  getCapture(option={}) {
    const {
      captureName = 'test'
    } = option;
    const canvas = document.createElement("canvas");
    canvas.width = hlsVideoRef.value.videoWidth || hlsVideoRef.value.clientWidth;
    canvas.height =
        hlsVideoRef.value.videoHeight || hlsVideoRef.value.clientHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(hlsVideoRef.value, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
        (blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${captureName}-${new Date().getTime()}.jpg`;
          a.click();
          URL.revokeObjectURL(a.href); // 释放内存
        },
        "image/jpeg",
        0.8
    );
  }

}

watch(() => props.hlsUrl, () => {
  if (!props.hlsUrl) return;
  handles.disposeHlsPlayer();
  handles.initHlsPlayer();
})

onBeforeUnmount(() => {
  handles.disposeHlsPlayer();
})


defineExpose({
  getCapture: handles.getCapture
})

</script>

<template>
  <video ref="hlsVideoRef" muted autoplay class="hls-player" v-loading="refData.hlsLoading"
         :element-loading-text="'加载中'"></video>
</template>

<style scoped lang="scss">
.hls-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>