
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/trainstep" @dialogVisible="dialogVisible" />
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
        { prop: 'order', label: '序号', width: '50', noFilter: true },
        { prop: 'priority', label: '优先级', width: '70', noFilter: true },
        { prop: 'name', label: '步骤名称' },
        { prop: 'orgType', label: '单位类型', style: { color: '#F56C6C' }},
        { prop: 'trainUnits', label: '训练单元', handleValue: (value) => value.map(item => OrgSequences.find(e => e.type === item).name).join('、'), noFilter: true }
      ],
      schema: [
        { fieldType: 'input-number', placeholder: '优先级', label: '优先级', vModel: 'priority', priority: 0 },
        { fieldType: 'input', placeholder: '步骤名称', label: '步骤名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '单位类型', label: '单位类型', vModel: 'orgType', orgType: '', options: Object.values(OrgType), required: true },
        { fieldType: 'select', width: '100%', placeholder: '训练单元', label: '训练单元', vModel: 'trainUnits', trainUnits: [], multiple: true, options: OrgSequences.map(item => item.name), required: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  methods: {
    beforeSubmit(target) {
      target.trainUnits = target.trainUnits.map(item => OrgSequences.find(e => e.name === item).type)
    },
    beforeEdit(target) {
      target.trainUnits = target.trainUnits.map(item => OrgSequences.find(e => e.type === item).name)
    },
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
