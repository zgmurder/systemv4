
<template>
  <div class="PlaceRequirement">
    <form-and-table ref="formAndTable" url="standard/placerequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
// import comRender from '@/pages/common/com-render'
import formAndTable from '@/components/formAndTable'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
// class PlaceRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;
//   private List<String> requiredPlaces;
//   private List<String> optionalPlaces;
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
        { prop: 'orgCategory', label: '单位分类', width: 200 },
        { prop: 'requiredPlaces', label: '必需场地类型', handleValue: value => value.join('、') },
        { prop: 'optionalPlaces', label: '可选场地类型', handleValue: value => value.join('、') }
      ],
      schema: [
        { fieldType: 'select', required: true, placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', orgCategory: '', options: [] },
        { fieldType: 'select', required: true, width: '100%', placeholder: '必需场地类型', label: '必需场地', vModel: 'requiredPlaces', requiredPlaces: [], options: [], multiple: true },
        { fieldType: 'select', width: '100%', placeholder: '可选场地类型', label: '可选场地', vModel: 'optionalPlaces', optionalPlaces: [], options: [], multiple: true }
      ]
    }
  },
  computed: {
    schemaOrgCategory() {
      return this.schema.find(item => item.vModel === 'orgCategory')
    },
    schemaRequiredPlaces() {
      return this.schema.find(item => item.vModel === 'requiredPlaces')
    },
    schemaOptionalPlaces() {
      return this.schema.find(item => item.vModel === 'optionalPlaces')
    }
  },
  async created() {
    this.schemaOrgCategory.options = await queryList('dictionary/orgcategory')
    this.schemaOptionalPlaces.options = this.schemaRequiredPlaces.options = await queryList('dictionary/placetype')
  }
}
</script>
