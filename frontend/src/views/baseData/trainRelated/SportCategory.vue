
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/sportcategory" @dialogVisible="dialogVisible" />
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
        { prop: 'name', label: '课目类型' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '课目类型', label: '课目类型', vModel: 'name', name: '', required: true },
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
