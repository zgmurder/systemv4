<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/motortype" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50', noFilter: true },
        { prop: 'name', label: '摩托类型' },
        { prop: 'unit', label: '计量单位' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '摩托类型', label: '摩托类型', vModel: 'name', name: '', required: true },
        { fieldType: 'input', placeholder: '计量单位', label: '计量单位', vModel: 'unit', unit: '', required: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  methods: {
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
