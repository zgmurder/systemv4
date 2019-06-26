<template>
  <div class="PersonRequirement">
    <form-and-table ref="formAndTable" url="standard/personrequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
// class PersonRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;
//   private int trainRate;
// }
export default {
  name: 'Category',
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        // { prop: 'standard', label: '训练大纲', handleValue: (value) => value && value.name },
        { prop: 'orgCategory', label: '单位分类' },
        { prop: 'trainRate', label: '参训率', handleValue: (value) => `${value}%` }
      ],
      schema: [
        // { fieldType: 'input', placeholder: '训练大纲', label: '训练大纲', vModel: 'standard', standard: '', disabled: true },
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', orgCategory: '', options: [] },
        { fieldType: 'input-number', placeholder: '参训率(%)', label: '参训率(%)', vModel: 'trainRate', trainRate: 0 }
      ]
    }
  },
  computed: {
    schemaOrgCategory() {
      return this.schema.find(item => item.vModel === 'orgCategory')
    }
  },
  async created() {
    this.schemaOrgCategory.options = await queryList('dictionary/orgcategory')
  }
}
</script>
