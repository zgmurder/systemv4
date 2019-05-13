
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/supportermajor" @dialogVisible="dialogVisible" />
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
        { prop: 'order', label: '排序', width: '50', noFilter: true },
        { prop: 'name', label: '后勤专业名称' }
      ],
      schema: [
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 },
        { fieldType: 'input', placeholder: '后勤专业名称', label: '专业名称', vModel: 'name', name: '', required: true }
      ]
    }
  },
  methods: {
    dialogVisible(count = 0) {
      this.schema[0].order = count + 1
    }
  }
}
</script>
