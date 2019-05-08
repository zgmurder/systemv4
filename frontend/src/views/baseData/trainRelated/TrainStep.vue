
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { OrgType, OrgSequences } from '@/const/index'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '步骤名称' },
        { prop: 'orgType', label: '单位类型', style: { color: '#F56C6C' }},
        { prop: 'trainUnits', label: '训练单元', handleValue: (value) => value.join('、') }
      ],
      schema: [
        { fieldType: 'input', width: '50%', placeholder: '步骤名称', label: '步骤名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', width: '50%', placeholder: '单位类型', label: '单位类型', vModel: 'orgType', orgType: '', options: Object.values(OrgType), required: true },
        { fieldType: 'select', width: '100%', placeholder: '训练单元', label: '训练单元', vModel: 'trainUnits', trainUnits: [], multiple: true, options: OrgSequences.map(item => item.name), required: true }
      ]
    }
  }
}
</script>
