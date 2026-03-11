<script setup>
import {computed, inject, reactive, watch} from "vue";
import pickerOptions from "@/objs/dt-picker-options.js";
import {imvdDmp} from "@/api/imvd.js";
import {usePagination} from "@/hooks/pagination.js";
import {MONIT_INJECT_KEY} from "./utils/constant.js";

const refData = reactive({
  reqQueryParams: {
    pageIndex: 1,
    pageSize: 4,
    imvdmpcd: null,
    beginTime: null,
    endTime: null
  },
  qptime: [],
  pageImgs: [],
  imgTotal: 0
})

watch(() => refData.qptime, (v) => {
  const reqQueryParams = refData.reqQueryParams;
  if (!v) {
    reqQueryParams.beginTime = undefined;
    reqQueryParams.endTime = undefined;
  } else {
    if (Array.isArray(v)) {
      reqQueryParams.beginTime = v[0].format('yyyy-MM-dd HH:mm:ss');
      reqQueryParams.endTime = v[1].format('yyyy-MM-dd HH:mm:ss');
    }
  }
}, {
  deep: true
});


const preImgs = computed(() => {
  return refData.pageImgs.map(i => '/' + i.fileurl);
});

const {pageIndex, pageSize, pageSizes} = usePagination();


const {
  monitorRefData
} = inject(MONIT_INJECT_KEY)
const stationSVNode = computed(() => (monitorRefData.otherModeSNM['img-station'] || []).at(0))


const handles = {
  async searchImg() {
    const reqQParams = refData.reqQueryParams;
    const condition = [stationSVNode.value,reqQParams.beginTime,reqQParams.endTime].every(item=>!!item);
    if(!condition) return;
    const res = imvdDmp({
      ...refData.reqQueryParams,
      imvdmpcd: stationSVNode.value.value
    })
    refData.pageImgs = res.data.data.items || [];
    refData.imgTotal = res.data.data.total;
  }
}

watch(() => monitorRefData.otherModeSNM['img-station'], () => {
  handles.searchImg()
})
</script>

<template>
  <div class="pic-station-div">
    <div class="pic-search">
      <el-form :inline="true" :model="refData.reqQueryParams" label-suffix=":">
        <el-form-item label="时间">
          <el-date-picker v-model="refData.qptime" type="daterange" range-separator="-" start-placeholder="开始时间"
                          end-placeholder="结束时间" :shortcuts="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button color="#499067" @click="handles.searchImg">
            <template #icon>
              <IconSvg icon-class="search"/>
            </template>
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="imgs">
      <el-image class="item-img" v-for="(item, idx) in refData.pageImgs" :initial-index="idx" :key="item.id"
                :src="'/' + item?.filesimurl" :preview-teleported="true" :preview-src-list="preImgs"></el-image>
    </div>
    <div class="crud-pg">
      <el-pagination small background layout="total,prev, next, jumper" :total="refData.imgTotal"
                     v-model:current-page="pageIndex" v-model:page-size="pageSize" :page-sizes="pageSizes"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pic-station-div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  background: linear-gradient(270deg,
      rgba(0, 50, 47, 0.3) 0%,
      rgba(9, 41, 39, 0.7) 100%);

  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 10px;

  .pic-search {
    .el-form {
      height: 40px;
      margin: 5px 0 0 15px;
    }
  }

  .imgs {
    flex: 1;
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .item-img {
    width: 50%;
    height: 50%;
    padding: 10px;
  }
}
</style>