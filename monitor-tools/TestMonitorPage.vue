<script setup>
import {reactive} from "vue";
import {SiteVideoTree, MonitorPlayer, PanTilt, useMonitorTool} from './index.js';
import {testTreeData} from './test-data.js'


const {
  monitorRefData
} = useMonitorTool();

const refData = reactive({
  testTreeData: Object.freeze(testTreeData)
})
</script>

<template>
  <div class="test-monitor-page">
    <div class="side-bar">
      <SiteVideoTree :tree-data="refData.testTreeData"/>
      <div class="pan-tilt-wrap" v-show="monitorRefData.selectedWrap.nodeValue">
        <el-collapse accordion>
          <el-collapse-item title="云台">
            <div class="pan-tilt-panel-wrap">
              <PanTilt :scale="0.8" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="monitor-main">
      <MonitorPlayer />
    </div>
  </div>
</template>

<style scoped lang="scss">
.test-monitor-page {
  height: 100%;
  width: 100%;
  display: flex;
  column-gap: 14px;
  background-color: rgba(31, 51, 51, 0.47);


  .side-bar {
    width: 240px;
    position: relative;
    background-color: #1f3333;

    .pan-tilt-wrap{
      position: absolute;
      bottom: 0;
      width: 100%;
      .pan-tilt-panel-wrap{
        display: flex;
        justify-content: center;
      }
    }
  }
  .monitor-main{
    min-width: 0;
    flex:1;
    background-color: #1f3333;
  }

}
</style>