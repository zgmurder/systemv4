<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/position2" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryListByKeyValue } from '@/api/baseApi'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '职务名称' },
        { prop: 'orgCategory', label: '单位分类' },
        { prop: 'isCommander', label: '指挥员(是/否)', style: { color: '#67C23A' }},
        { prop: 'isMaster', label: '军政主官(是/否)', style: { color: '#F56C6C' }},
        { prop: 'sortCode', label: '排序码' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '职务名称', label: '职务名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', required: true, orgCategory: '', options: [] },
        { fieldType: 'input-number', placeholder: '职务编码', label: '职务编码', vModel: 'sortCode', sortCode: 0 },
        { fieldType: 'checkbox', placeholder: '是否指挥员', label: '指挥员', vModel: 'isCommander', isCommander: false, border: true },
        { fieldType: 'checkbox', placeholder: '是否军政主官', label: '军政主官', vModel: 'isMaster', isMaster: false, border: true }
      ]
    }
  },
  async created() {
    this.schema[1].options = await queryListByKeyValue('OrgCategory')
  }
}
</script>
