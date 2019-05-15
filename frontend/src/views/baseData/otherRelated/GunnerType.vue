
<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/gunnertype" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryList } from '@/api/baseApi'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50' },
        { prop: 'name', label: '枪手名称' },
        { prop: 'gunTypes', label: '枪支类型', handleValue: value => value.join('、') }
      ],
      schema: [
        { fieldType: 'input', placeholder: '枪手名称', label: '枪手名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '军械分类', label: '军械分类', vModel: 'gunTypes', gunTypes: [], options: [], multiple: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  async created() {
    this.schema[1].options = await queryList('dictionary/ordnancetypes')
  }
}
</script>
