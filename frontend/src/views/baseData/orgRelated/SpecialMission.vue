<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
export default {
  name: 'Property',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '任务名称' },
        { prop: 'describe', label: '描述' }],
      schema: [
        { fieldType: 'input', placeholder: '任务名称', label: '任务名称', vModel: 'name' },
        { fieldType: 'input', placeholder: '描述', label: '描述', vModel: 'describe' }
      ]
    }
  }
}
</script>
