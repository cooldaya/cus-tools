import {hikControlling, previewUrl,playbackHlsUrl} from "@/api/hik";

export const monitorApi = {
  hikControlling, // 云台控制
  getPreviewUrl: previewUrl, // 获取hls地址
  playbackHlsUrl, // 获取回放hls地址
}
