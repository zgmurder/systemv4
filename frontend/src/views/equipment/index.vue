<template>
  <div style="padding:10px">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="智能秤列表" name="deviceInfo" />
      <el-tab-pane label="设备状态记录" name="deviceStatusRecord" />
    </el-tabs>
    <component :is="activeName" />
  </div>
</template>
<script>

import deviceStatusRecord from './deviceStatusRecord'
import deviceInfo from './deviceInfo'
export default {
  components: {
    deviceStatusRecord,
    deviceInfo
  },
  data() {
    return {
      activeName: 'deviceInfo'
    }
  }
}
</script>
