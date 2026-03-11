import {monitorApi} from "../monitor-config.js";

function pick(obj, keys) {
  return keys.reduce((res, key) => {
    if (key in obj) {
      res[key] = obj[key];
    }
    return res;
  }, {});
}


 async function changeMonitorControl(cameraIndexCode,dir,isMove=false) {
  if (!cameraIndexCode) return;
  let params = {
    cameraIndexCode,
    action: isMove ? 0 : 1, //0-开始 ，1-停止
    command: dir, //方向
    speed: "50",
  };
  try {
    const res = await monitorApi.hikControlling(params);
    if (res.status === 200) {
      console.log("控制成功:", res);
    } else {
      console.log("控制失败:", res);
    }
  } catch (err) {
    console.log(err);
  }
}

export {
  pick,
  changeMonitorControl
}