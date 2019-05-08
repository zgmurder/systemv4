
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryListByKeyValue } from '@/api/baseApi'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '枪手名称' },
        { prop: 'gunTypes', label: '枪支类型', handleValue: value => value.join('、') }
      ],
      schema: [
        { fieldType: 'input', placeholder: '枪手名称', label: '枪手名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '军械分类', label: '军械分类', vModel: 'gunTypes', gunTypes: [], options: [], multiple: true }
      ]
    }
  },
  async created() {
    this.schema[1].options = await queryListByKeyValue('OrdnanceType')
  }
}
</script>
