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
        { prop: 'name', label: '场地类型' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '场地类型', label: '场地类型', vModel: 'name', name: '', required: true }
      ]
    }
  }
}
</script>
