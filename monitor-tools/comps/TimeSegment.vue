<template>
  <div class="container">
<!--    <div class="time-show">当前时间：{{ showCurrentTime }}</div>-->
    <div class="timeLine">
      <TimeLine ref="timelineCompRef" :initTime="showCurrentTime" @dragTimeChange="handles.handleClickTimeLine"
                :timeSegments="timeSegments" @click_timeline="handles.handleClickTimeLine" :initZoomIndex="refData.zoom">
      </TimeLine>
    </div>
    <div class="condition-wrap">
      <label class="condition-item">
        观测时间：
        <el-date-picker v-model="refData.currentTime" type="datetime" placeholder="选择日期时间"
                        :disabled-date="handles.disabledDate" />
      </label>
      <label class="condition-item">
        时长：
        <el-select v-model="refData.timeDuration" placeholder="Select" style="width: 240px"
                   @change="handles.onChangeTimeDuration">
          <el-option v-for="item in refData.durationList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </label>
    </div>
  </div>
</template>

<script setup>
import dayjs from '../libs/dayjs.js'
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import {TimeLine} from './TimeLine';
import { ElMessage } from 'element-plus'
defineOptions({ name: 'SegmentCom' })


const props = defineProps({
  immediate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['timeRangeChange'])
const refData = reactive({
  // 显示时间段
  currentTime: dayjs().subtract(6, 'm').valueOf(),
  timeDuration: 5,
  unit: 'm',
  zoom: 1,
  durationList: [
    {
      label: '30秒',
      value: 0.5,
      zoom: 1,
    },
    {
      label: '1分钟',
      value: 1,
      zoom: 1,
    },
    {
      label: '5分钟',
      value: 5,
      zoom: 1,
    },
    {
      label: '10分钟',
      value: 10,
      zoom: 2,
    },
    {
      label: '30分钟',
      value: 30,
      zoom: 3,
    },
    {
      label: '1小时',
      value: 60,
      zoom: 3,
    },
    {
      label: '2小时',
      value: 120,
      zoom: 3,
    },
    {
      label: '6小时',
      value: 360,
      zoom: 4,
    },
  ]
})

const showCurrentTime = computed(() => dayjs(refData.currentTime).format('YYYY-MM-DD HH:mm:ss'))
const timeSegments = computed(() => {
  const centerTime = dayjs(refData.currentTime);
  const beginTime = centerTime.subtract(refData.timeDuration / 2, refData.unit).valueOf()
  const endTime = centerTime.add(refData.timeDuration / 2, refData.unit).valueOf()
  return [
    {
      name: '时间段1',
      beginTime: beginTime,
      endTime: endTime,
      color: '#1a94bc',
      startRatio: 0.65,
      endRatio: 0.9
    },
    // {
    //   name: '时间段2',
    //   beginTime: new Date('2021-01-13 10:00:00').getTime(),
    //   endTime: new Date('2021-01-14 23:00:00').getTime(),
    //   color: '#1a94bc',
    //   startRatio: 0.65,
    //   endRatio: 0.9
    // },
  ]
})


const timelineCompRef = ref(null)

const handles = {
  handleClickTimeLine(val) {
    // debugger
    const timestamp = dayjs(val).valueOf()
    if (!handles.isValidDateTime(timestamp)) {
      ElMessage.error('选择的时间超出了可观测范围')
      return
    }
    refData.currentTime = timestamp
    timelineCompRef.value.setTime(timestamp)
    timelineCompRef.value.reRender();
    handles.emitTimeRangeChange()
  },
  onChangeTimeDuration(val) {
    const targetOption = refData.durationList.find(item => item.value === val);
    const isValid = handles.isValidDateTime(refData.currentTime)
    if (!isValid) {
      refData.currentTime = dayjs().subtract(val / 2 + 1, 'm').valueOf()
    }

    refData.zoom = targetOption.zoom;
    timelineCompRef.value.setZoom(targetOption.zoom)
    timelineCompRef.value.reRender()
    handles.emitTimeRangeChange()
  },
  isValidDateTime(timestamp) {
    const currentDateTime = dayjs(timestamp);
    // 选中时间 加上 时长的一半 不能超过当前时间
    return currentDateTime.add(refData.timeDuration / 2, refData.unit).isBefore(dayjs())
  },
  disabledDate(date) {
    // 禁用那些会导致时间超出可观测范围的日期
    const currentDateTime = dayjs(date);
    return !handles.isValidDateTime(currentDateTime.valueOf())
  },
  emitTimeRangeChange() {
    nextTick(() => {
      emit('timeRangeChange', timeSegments.value[0])
    })
  }
}


onMounted(()=>{
  if(props.immediate) {
    handles.handleClickTimeLine(refData.currentTime)
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;

  .time-show {
    margin: 10px 0;
    display: flex;
    justify-content: center;
    user-select: none;
  }

  .timeLine {
    height: 50px;
  }

  .condition-wrap {
    margin: 10px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    column-gap: 20px;
    font-size: 14px;
    color: #afafaf;

    .condition-item {
      display: flex;
      align-items: center;
    }
  }
}
</style>
