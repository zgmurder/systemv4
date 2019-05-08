<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { OrgSequences } from '@/const/index'
export default {
  name: 'Property',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '职务名称' },
        { prop: 'orgSequence', label: '编制序列', handleValue: (value) => OrgSequences.find(item => item.type === value).name },
        { prop: 'isCommander', label: '指挥员(是/否)', style: { color: '#67C23A' }},
        { prop: 'isMaster', label: '军政主官(是/否)', style: { color: '#F56C6C' }},
        { prop: 'sortCode', label: '职务编码' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '职务名称', label: '职务名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '编制序列', label: '编制序列', vModel: 'orgSequence', required: true, orgSequence: '', options: OrgSequences },
        { fieldType: 'input-number', placeholder: '职务编码', label: '职务编码', vModel: 'sortCode', sortCode: 0 },
        { fieldType: 'checkbox', placeholder: '是否指挥员', label: '指挥员', vModel: 'isCommander', isCommander: false, border: true },
        { fieldType: 'checkbox', placeholder: '是否军政主官', label: '军政主官', vModel: 'isMaster', isMaster: false, border: true }
      ]
    }
  },
  methods: {
    beforeSubmit(target) {
      target.orgSequence = OrgSequences.find(item => item.name === target.orgSequence).type
    },
    beforeEdit(target) {
      target.orgSequence = OrgSequences.find(item => item.type === target.orgSequence).name
    }
  }
}
</script>
