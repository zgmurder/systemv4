<template>
  <div class="property">
    <formAndTable ref="formAndTable" url="standard/trainsection" :schema="schema" :columns="columns" @dialogIsClose="dialogIsClose" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { OrgType, PersonProperty } from '@/const/index'
import { queryList } from '@/api/baseApi'
import standardMixin from './standardMixin'

export default {
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data(vm) {
    return {
      columns: [
        { prop: 'name', label: '分册名称', filterConfig: value => ({ '$regex': value }) },
        { prop: 'code', label: '分册编码' },
        {
          prop: 'orgTypes',
          label: '单位类型',
          handleValue: value => value && value.join('、'),
          filterConfig: true
        },
        {
          prop: 'orgCategories',
          label: '单位分类',
          handleValue: value => value && value.join('、'),
          filterConfig: value => ({ '$regex': value })
        },
        {
          prop: 'personProperties',
          label: '人员属性',
          handleValue: value => value && value.join('、'),
          filterConfig: true
        }
      ],
      schema: [
        { fieldType: 'input', placeholder: '分册名称', label: '分册名称', vModel: 'name', name: '', required: true },
        { fieldType: 'input', placeholder: '分册编码', label: '分册编码', vModel: 'code', code: '', required: true },
        { fieldType: 'select', width: '50%', placeholder: '适用的单位类型', label: '单位类型', vModel: 'orgTypes', multiple: true, required: true, orgTypes: [], options: Object.values(OrgType)
        },
        { fieldType: 'select', width: '50%', placeholder: '适用的人员属性', label: '人员属性', vModel: 'personProperties', personProperties: [], multiple: true, required: true, options: PersonProperty },
        { fieldType: 'select', width: '100%', placeholder: '适用的单位分类', label: '单位分类', vModel: 'orgCategories', multiple: true, orgCategories: [], options: [], required: true, filterable: true }
      ]
    }
  },
  computed: {
    orgCategories() {
      return this.schema.find(item => item.vModel === 'orgCategories')
    },
    orgTypes() {
      return this.schema.find(item => item.vModel === 'orgTypes')
    }
  },
  watch: {
    'orgTypes.orgTypes': {
      async handler(newVal) {
        if (!newVal.length) return (this.orgCategories.orgCategories = [])
        this.orgCategories.options = await queryList('dictionary/orgcategory', {
          where: { orgType: { $in: newVal }}
        })
      }
    }
  },
  methods: {

  }
}
</script>
