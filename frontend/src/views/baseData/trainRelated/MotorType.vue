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
        { prop: 'name', label: '摩托类型' },
        { prop: 'unit', label: '计量单位' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '摩托类型', label: '摩托类型', vModel: 'name', name: '', required: true },
        { fieldType: 'input', placeholder: '计量单位', label: '计量单位', vModel: 'unit', unit: '', required: true }
      ]
    }
  }
}
</script>
