
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
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
        { prop: 'name', label: '后勤专业名称' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '后勤专业名称', label: '后勤专业名称', vModel: 'name', name: '', required: true }
      ]
    }
  }
}
</script>
