<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/position" @dialogVisible="dialogVisible" />
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
        { prop: 'order', label: '序号', width: '50' },
        { prop: 'name', label: '职务名称', filterConfig: true },
        { prop: 'orgSequence', label: '编制序列(单位分类)', handleValue: (value, row) => {
          const found = OrgSequences.find(item => item.type === value)
          return found ? found.name : row.orgCategory
        }, filterConfig: true },
        { prop: 'commander', label: '指挥员(是/否)', style: { color: '#67C23A' }, handleValue: value => value ? '是' : '否', filterConfig: true },
        { prop: 'master', label: '军政主官(是/否)', style: { color: '#F56C6C' }, handleValue: value => value ? '是' : '否', filterConfig: true }
        // { prop: 'sortCode', label: '职务编码' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '职务名称', label: '职务名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '编制序列', label: '编制序列', vModel: 'orgSequence', required: true, orgSequence: '', options: OrgSequences, optValue: 'type' },
        // { fieldType: 'input-number', placeholder: '职务编码', label: '职务编码', vModel: 'sortCode', sortCode: 0 },
        { fieldType: 'checkbox', placeholder: '是否指挥员', label: '指挥员', vModel: 'commander', commander: false, border: true },
        { fieldType: 'checkbox', placeholder: '是否军政主官', label: '军政主官', vModel: 'master', master: false, border: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  methods: {
    // beforeSubmit(target) {
    //   console.log(target)

    //   target.orgSequence = OrgSequences.find(item => item.name === target.orgSequence).type
    // },
    // beforeEdit(target) {
    //   target.orgSequence = OrgSequences.find(item => item.type === target.orgSequence).name
    // },
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
