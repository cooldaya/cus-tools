<script setup>
import {ref, inject, computed} from 'vue'
import arrowUpIconUrl from '../assets/icons/arrow-up-icon.svg'
import {getSvgIcon} from "../utils/get-assets.js";
import {MONIT_INJECT_KEY} from '../utils/constant.js'
import {changeMonitorControl} from "../utils/funcs.js";

const props = defineProps({
  scale: {
    type: Number,
    default: 1
  },
})

const {selectedVideoNode} = inject(MONIT_INJECT_KEY)
let CENTER_DIR = 'CENTER'
let currentControlDir = ref('')
const dirButtons = [
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
]
const optButtons = [
  {
    dir: 'FOCUS_NEAR',
    iconUrl: getSvgIcon('focus-near-icon')
  },
  {
    dir: 'FOCUS_FAR',
    iconUrl: getSvgIcon('focus-far-icon')
  },
  {
    dir: 'IRIS_ENLARGE',
    iconUrl: getSvgIcon('iris-enlarge-icon')
  },
  {
    dir: 'IRIS_REDUCE',
    iconUrl: getSvgIcon('iris-reduce-icon')
  }
]


const handles = {
  handleMouseDown: (e) => {
    currentControlDir.value = e.target.dataset.dir;
    if (currentControlDir.value === CENTER_DIR || !currentControlDir.value) {
      currentControlDir.value = '';
      return;
    }
    console.log('start', currentControlDir.value)
    changeMonitorControl(selectedVideoNode.value, currentControlDir.value, true);
  },
  handleMouseUp: () => {
    if (!currentControlDir.value) return;
    console.log('stop', currentControlDir.value)
    changeMonitorControl(selectedVideoNode.value, currentControlDir.value, false);
    currentControlDir.value = '';
  },
  handleMouseLeave: () => {
    handles.handleMouseUp()
  },
}


const panTiltTheme = computed(() => {
  const rawRect = {
    width: 240,
    height: 304
  };
  const scaledRect = {
    width: rawRect.width * props.scale + 'px',
    height: rawRect.height * props.scale + 'px'
  };
  return {
    wrapStyle: scaledRect,
    contentStyle: {
      width:rawRect.width + 'px',
      height: rawRect.height + 'px',
      transform: `scale(${props.scale})`,
      'transform-origin': 'left top',
    }
  }
})
</script>

<template>
  <div class="pan-tilt" v-if="selectedVideoNode" :style="panTiltTheme.wrapStyle">
    <div class="pan-tilt-content" :style="panTiltTheme.contentStyle">
      <div class="dir-control-panel">
        <div class="center-circle" :data-dir="CENTER_DIR"></div>
        <div v-for="item in dirButtons" :key="item.dir" class="dir-btn-item" :class="{
      [(item.dir+'').toLowerCase()]:true,
      'active':currentControlDir === item.dir,
    }" :data-dir="item.dir" @mousedown="handles.handleMouseDown" @mouseup="handles.handleMouseUp"
             @mouseleave="handles.handleMouseLeave">
          <img :src="arrowUpIconUrl" :alt="item.dir" class="btn-icon">
        </div>
      </div>
      <div class="opt-control-panel">
        <div v-for="item in optButtons" :key="item.dir" class="opt-btn" :class="{
      [(item.dir+'').toLowerCase()]:true,
      'active':currentControlDir === item.dir,
    }" :data-dir="item.dir" @mousedown="handles.handleMouseDown" @mouseup="handles.handleMouseUp"
             @mouseleave="handles.handleMouseLeave">
          <img :src="item.iconUrl" :alt="item.dir" class="btn-icon">
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.pan-tilt {
  width: 100%;
  height: 100%;

  .pan-tilt-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    padding: 14px 0;
    box-sizing: border-box;
  }

  .btn-icon {
    user-select: none;
    pointer-events: none;
  }

  /* 控制面板容器：圆形布局 */
  .dir-control-panel {
    position: relative;
    width: 220px; /* 控制盘整体大小 */
    height: 220px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;


    /* 中心圆形 */
    .center-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .dir-btn-item {
      width: 44px;
      height: 44px;
      display: grid;
      place-content: center;
      position: absolute;
      border-radius: 50%;
      background-color: #ffffff;
      cursor: pointer;
      transition-duration: 300ms;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      border: solid 1px #ffffff;
      /* 鼠标悬浮 */
      &:hover {
        background-color: #f9fafb;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #d1d5db;
      }

      &.active {
        background-color: #eeeef1;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        /* transform: scale(0.9) translate(0%, 0%); 保持按压缩放 */
        border-color: #9ca3af;
      }

      .btn-icon {
        width: 20px;
        pointer-events: none;
      }
    }

    /*
    按钮位置
    图标旋转方向（全部用 ArrowUp 旋转实现）
     */
    .up {
      transform: translate(0%, -70px);

      .btn-icon {
        transform: rotate(0deg);
      }
    }

    .down {
      transform: translate(0%, 70px);

      .btn-icon {
        transform: rotate(180deg);
      }
    }

    .left {
      transform: translate(-70px, 0%);

      .btn-icon {
        transform: rotate(270deg);
      }
    }

    .right {
      transform: translate(70px, 0%);

      .btn-icon {
        transform: rotate(90deg);
      }
    }

    .left_up {
      transform: translate(-50px, -50px);

      .btn-icon {
        transform: rotate(315deg);
      }
    }

    .right_up {
      transform: translate(50px, -50px);

      .btn-icon {
        transform: rotate(45deg);
      }
    }

    .left_down {
      transform: translate(-50px, 50px);

      .btn-icon {
        transform: rotate(225deg);
      }
    }

    .right_down {
      transform: translate(50px, 50px);

      .btn-icon {
        transform: rotate(135deg);
      }
    }

  }

  .opt-control-panel {
    margin-top: 16px;
    display: flex;
    padding: 0 8%;
    width: 100%;
    justify-content: space-between;

    .opt-btn {
      display: grid;
      place-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      color: red;
      transition-duration: 300ms;
      /* 鼠标悬浮：增强视觉反馈 */
      &:hover {
        background-color: #f9fafb;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #d1d5db;
      }

      /* 鼠标按压（mousedown）：模拟“按下”触感 */
      &:active {
        background-color: #f3f4f6;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transform: scale(0.95);
        border-color: #9ca3af;
      }

      .btn-icon {
        width: 22px;
        filter: brightness(0.4);
      }
    }
  }
}

</style>