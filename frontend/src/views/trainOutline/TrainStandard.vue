<template>
  <div class="property">
    <formAndTable ref="formAndTable" :schema="schema" url="standard/trainstandard" :columns="columns" />
    <!-- :default-option="{sort: { state: 1 }}" -->
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import swichCom from './swich'
import { startStandard } from '@/api/baseApi'
import { StandardState } from '@/const/index'
// private String id;
//   private String name;        // 手动录入
//   private String version;     // 版本号, 手动录入
//   private int state;          // 大纲启用状态: 0: 未启用/ 1: 已启用/ 2: 已停用, 参考StandardState  不可编辑
//   private Long startTime;     // 大纲启用日期, 不可编辑
//   private Long endTime;
export default {
  components: {
    formAndTable
  },
  data() {
    const colors = ['#909399', '#67C23A', '#F56C6C']
    return {
      columns: [
        { prop: 'name', label: '大纲名称' },

        { prop: 'state', label: '启用状态', handleValue: value => StandardState[value], style: value => ({ color: colors[value] }) },
        { prop: 'startTime', label: '启用日期', handleValue: parseDate => parseDate && this.$tools.parseTime(parseDate, '{y}年{m}月{d}日') },
        { prop: 'endTime', label: '停用日期', handleValue: parseDate => parseDate && this.$tools.parseTime(parseDate, '{y}年{m}月{d}日') },
        {
          prop: 'state', label: '是否启用', component: swichCom, change: (id, activate) => {
            console.log(id, activate)
            startStandard(id, activate).then(res => {
              this.$message.success('操作成功')
              this.$refs.formAndTable.fetchTableList()
            })
          }
        }
      ],
      schema: [
        { fieldType: 'input', placeholder: '大纲名称', required: true, label: '大纲名称', vModel: 'name' },
        { fieldType: 'input', placeholder: '版本号', required: true, label: '版本号', vModel: 'version' }
      ]
    }
  }
}
</script>
