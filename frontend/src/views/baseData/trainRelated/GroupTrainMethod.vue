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
        { prop: 'name', label: '组训方法' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '组训方法', label: '组训方法', vModel: 'name', name: '', required: true }
      ]
    }
  }
}
</script>
