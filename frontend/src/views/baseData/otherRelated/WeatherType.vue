<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/weathertype" />
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
        { prop: 'order', label: '序号', width: '50' },
        { prop: 'name', label: '天气名称' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '天气名称', label: '天气名称', vModel: 'name', name: '', required: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  }
}
</script>
