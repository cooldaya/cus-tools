# Monitor Tools 视频监控工具

一个基于 Vue 3 的视频监控播放工具集，支持视频预览、回放、云台控制等功能。

## 目录结构

```
monitor-tools/
├── index.js                 # 入口文件，导出组件和hooks
├── MonitorPlayer.vue        # 主播放器组件（预览/回放模式切换）
├── monitor-config.js        # API配置文件
├── comps/                   # 子组件
│   ├── SiteVideoTree.vue    # 站点视频树
│   ├── PreviewMonitorVideo.vue  # 单个预览视频组件
│   ├── HlsPlayer.vue        # HLS播放器封装
│   ├── PanTilt.vue          # 云台控制面板
│   ├── JoystickPanel.vue    # 操控杆面板
│   ├── TimeSegment.vue      # 时间段选择组件
│   └── TimeLine/            # 时间线组件
├── func-tabs/               # 功能标签页组件
│   ├── MonitorPreview.vue   # 预览模式
│   └── MonitorPlayBack.vue  # 回放模式
├── hooks/                   # 组合式函数
│   ├── use-tools.js         # 核心Hook
│   ├── use-func-mode-taber.js  # 模式切换Hook
│   └── use-mitt.js          # 事件总线Hook
├── utils/                   # 工具函数
│   ├── constant.js          # 常量定义
│   ├── funcs.js             # 通用函数
│   └── get-assets.js        # 资源获取
├── assets/                  # 静态资源
│   ├── icons/               # 图标
│   └── cursor-icons/        # 光标图标
└── libs/                    # 第三方库
    ├── mitt.ts              # 事件总线
    └── dayjs.js             # 日期处理
```

## 安装依赖

确保项目已安装以下依赖：

```bash
npm install hls.js element-plus
```

## 快速开始

### 基础用法

```vue
<script setup>
import { reactive } from 'vue';
import { SiteVideoTree, MonitorPlayer, PanTilt, useMonitorTool } from './monitor-tools';

const { monitorRefData } = useMonitorTool();

const refData = reactive({
  treeData: [] // 你的视频树数据
});
</script>

<template>
  <div class="monitor-page">
    <div class="side-bar">
      <SiteVideoTree :tree-data="refData.treeData" />
      <div class="pan-tilt-wrap" v-show="monitorRefData.selectedWrap.nodeValue">
        <PanTilt :scale="0.8" />
      </div>
    </div>
    <div class="monitor-main">
      <MonitorPlayer />
    </div>
  </div>
</template>
```

### 扩展播放模式

支持添加自定义播放模式：

```vue
<script setup>
import { defineAsyncComponent } from 'vue';
import { SiteVideoTree, MonitorPlayer, PanTilt, useMonitorTool } from './monitor-tools';

const { monitorRefData } = useMonitorTool({
  addPlayModes: [
    {
      label: '自定义模式',
      mode: 'custom-mode',
      component: defineAsyncComponent(() => import('./CustomMode.vue')),
      cb() {
        console.log('切换到自定义模式');
      },
      viewMaxCount: 1  // 该模式支持的视频窗口数量
    }
  ]
});
</script>
```

## 组件说明

### useMonitorTool

核心 Hook，用于初始化和管理视频监控状态。

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| viewMaxCount | number | 9 | 最大预览窗口数量 |
| addPlayModes | array | [] | 自定义播放模式配置 |

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| monitorRefData | reactive | 响应式状态数据 |
| selectedVideoNode | computed | 当前选中的视频节点 |
| monitorOption | reactive | 配置选项 |
| funcModeTaber | object | 模式切换控制器 |
| uit | object | 事件总线工具 |
| handles | object | 操作方法集合 |

**monitorRefData 结构：**

```js
{
  selectedVideoNodes: [],      // 当前选中的视频节点列表
  selectedWrap: {              // 当前选中窗口信息
    nodeValue: null,
    nodeIndex: -1
  },
  playFuncMode: 'preview',     // 当前播放模式
  playbackNode: null,          // 回放节点
  otherModeSNM: {}             // 其他模式的选中节点
}
```

### SiteVideoTree

站点视频树组件，用于展示和选择视频设备。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| treeData | array | testTreeData | 树形数据 |
| viewMaxCount | number | 9 | 最大可选数量 |

**树节点数据结构：**

```js
{
  value: 'camera_001',    // 节点唯一标识
  label: '摄像头1',        // 节点名称
  type: 'video',          // 节点类型：'video' 为视频节点
  children: []            // 子节点
}
```

### MonitorPlayer

主播放器组件，包含预览和回放模式切换。

**功能：**
- 预览模式：支持多窗口同时预览
- 回放模式：支持历史视频回放
- 自动网格布局

### PanTilt

云台控制面板组件。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| scale | number | 1 | 缩放比例 |

**控制功能：**
- 方向控制：上、下、左、右、左上、右上、左下、右下
- 焦距控制：焦距近、焦距远
- 光圈控制：光圈放大、光圈缩小

### PreviewMonitorVideo

单个预览视频组件。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| videoNode | object | {} | 视频节点信息 |

**功能：**
- HLS视频播放
- 拍照截图
- 码流切换（主码流/子码流）
- 全屏显示
- 云台操控台

### HlsPlayer

HLS播放器封装组件。

**Props：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hlsUrl | string | '' | HLS视频地址 |

**方法：**
- `getCapture(name)` - 截图功能

## API 配置

在 `monitor-config.js` 中配置API接口：

```js
import { hikControlling, previewUrl, playbackHlsUrl } from "@/api/hik";

export const monitorApi = {
  hikControlling,      // 云台控制
  getPreviewUrl: previewUrl,    // 获取预览HLS地址
  playbackHlsUrl,      // 获取回放HLS地址
};
```

### API 接口说明

**获取预览地址：**

```js
// 请求参数
{
  cameraIndexCode: 'camera_001',  // 摄像头编码
  streamType: 0                   // 0:主码流, 1:子码流
}

// 返回数据
{
  data: 'https://xxx.m3u8'  // HLS播放地址
}
```

**云台控制：**

```js
// 请求参数
{
  cameraIndexCode: 'camera_001',  // 摄像头编码
  action: 0,                      // 0:开始, 1:停止
  command: 'UP',                  // 方向命令
  speed: '50'                     // 速度
}
```

**获取回放地址：**

```js
// 请求参数
{
  cameraIndexCode: 'camera_001',
  beginTime: '2024-01-01 00:00:00',
  endTime: '2024-01-01 23:59:59',
  inout: '1',
  protocol: 'rtsp'
}
```

## 事件系统

工具内部使用 mitt 实现事件通信。

**事件类型：**

| 事件名 | 说明 |
|--------|------|
| UPDATE_TREE_SELECTED | 更新树选中状态 |

**使用示例：**

```js
const { uit } = useMonitorTool();

// 监听事件
uit.onEvent('UPDATE_TREE_SELECTED', (nodes) => {
  console.log('选中的节点:', nodes);
});

// 触发事件
uit.emit('UPDATE_TREE_SELECTED', selectedNodes);
```

## 播放模式

### 预览模式 (preview)

- 支持多窗口同时预览（默认最多9个）
- 自动网格布局
- 支持单个视频操作

### 回放模式 (playback)

- 单视频回放
- 时间段选择
- 时间线展示

## 工具栏功能

### 预览模式工具栏

| 工具 | 说明 |
|------|------|
| 拍照 | 截取当前所有视频画面 |
| 关闭全部 | 关闭所有预览视频 |
| 全屏 | 全屏显示 |

### 单个视频工具栏

| 工具 | 说明 |
|------|------|
| 拍照 | 截取当前视频画面 |
| 切换码流 | 主码流/子码流切换 |
| 操控台 | 显示云台控制面板 |

## 样式定制

组件使用 SCSS 编写样式，可通过以下方式自定义：

```scss
// 覆盖主题色
.video-play-funcs {
  .top-btn.active {
    background-color: your-color;
  }
}
```

## 注意事项

1. 确保后端API返回正确的HLS地址
2. 浏览器需支持HLS播放（推荐使用Chrome）
3. 云台控制需要摄像头支持PTZ功能
4. 回放功能需要后端支持历史视频查询

## 依赖说明

- **Vue 3** - 响应式框架
- **hls.js** - HLS视频播放
- **element-plus** - UI组件库
- **mitt** - 事件总线
- **dayjs** - 日期处理
