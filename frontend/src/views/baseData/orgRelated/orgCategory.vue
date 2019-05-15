<template>
  <div class="category">
    <form-and-table ref="formAndTable" :columns="columns" url="dictionary/orgcategory" :schema="schema" @dialogIsClose="schemaOptionalMajors.options = []" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { OrgType, TroopCategory, PhysicalLevel } from '@/const/index'
import { queryList } from '@/api/baseApi'

export default {
  name: 'Category',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50', noFilter: true },
        { prop: 'name', label: '单位名称', style: { color: '#67C23A' }},
        { prop: 'orgType', label: '单位类型', width: '80', style: { color: '#F56C6C' }},
        { prop: 'orgProperty', label: '单位属性', width: '80' },
        { prop: 'troopCategory', label: '兵种类型', width: '80' },
        { prop: 'physicalLevel', label: '体能等级', style: { color: '#E6A23C' }, width: '80' },
        { prop: 'optionalMajors', label: '可选专业', handleValue: value => value && value.join('、') },
        { prop: 'optionalServices', label: '勤务分类', handleValue: value => value && value.join('、') },
        { prop: 'optionalTasks',
          label: '任务种类',
          handleValue: (value) => value.map(item => item.optionalSubjects.length ? `${item.name}：${item.optionalSubjects.join('、')}` : item.name).join('；')
        }
      ],
      schema: [
        { fieldType: 'input', placeholder: '单位名称', label: '单位名称', vModel: 'name', required: true },
        { fieldType: 'select', placeholder: '单位类型', label: '单位类型', vModel: 'orgType', orgType: '分队', required: true, options: Object.values(OrgType) },
        { fieldType: 'select', placeholder: '单位属性', label: '单位属性', vModel: 'orgProperty', filterable: true, required: true, orgProperty: '', options: [], onChange: (obj, value, found) => {
          this.schemaOptionalMajors.optionalMajors = []
          if (obj) {
            setTimeout(() => {
              this.schemaOptionalMajors.optionalMajors = [...found.optionalMajors]
            }, 200)
          }
        } },
        { fieldType: 'select', width: '100%', placeholder: '专业类型', label: '专业类型', vModel: 'optionalMajors', options: [], optionalMajors: [], multiple: true },
        { fieldType: 'select', placeholder: '军兵种类型', label: '兵种类型', vModel: 'troopCategory', troopCategory: '地面人员', required: true, options: Object.values(TroopCategory) },
        { fieldType: 'select', placeholder: '体能等级', label: '体能等级', vModel: 'physicalLevel', physicalLevel: '二类人员', required: true, options: Object.values(PhysicalLevel) },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 },
        { fieldType: 'select', width: '100%', placeholder: '输入按回车结束', label: '勤务分类', vModel: 'optionalServices', optionalServices: [], filterable: true, allowCreate: true, multiple: true, noDataText: '输入可按回车结束' },
        { fieldType: 'select', width: '100%', placeholder: '输入按回车结束', label: '任务种类', vModel: 'optionalTasks', optionalTasks: [], filterable: true, allowCreate: true, multiple: true, noDataText: '输入可按回车结束' }

      ]
    }
  },
  computed: {
    schemaOrgProperty() {
      return this.schema.find(item => item.vModel === 'orgProperty')
    },
    schemaOptionalMajors() {
      return this.schema.find(item => item.vModel === 'optionalMajors')
    },
    schemaOptionalTasks() {
      return this.schema.find(item => item.vModel === 'optionalTasks')
    }
  },
  watch: {
    'schemaOrgProperty.orgProperty': {
      handler(newValue) {
        const found = this.schemaOrgProperty.options.find(item => item.name === newValue)
        if (!newValue) this.schemaOptionalMajors.options = []
        // this.schemaOptionalMajors.optionalMajors = [];
        if (found) this.schemaOptionalMajors.options = [...found.optionalMajors]
      }
    },
    'schemaOptionalTasks.optionalTasks': {
      handler(newValue) {
        if (JSON.stringify(newValue) === this._newValue) return
        this._newValue = JSON.stringify(newValue)
        // console.log(this.schema)
        this.schema.length = this._schemaLength
        newValue.forEach((item, index) => {
          this.$set(this.schema, this.schema.length,
            { fieldType: 'select', width: '50%', placeholder: '该任务下的课题', label: item, vModel: 'optionalSubjects_' + index, ['optionalSubjects_' + index]: [], allowCreate: true, multiple: true, filterable: true, noDataText: '输入可按回车结束' }
          )
        })
      }
    }
  },
  async created() {
    this.schemaOrgProperty.options = await queryList('dictionary/orgpropertys')
    // console.log(this.schemaOrgProperty.options)
    this._schemaLength = this.schema.length
  },
  methods: {
    beforeSubmit(option) {
      const subjects = Object.keys(option).filter(item => item.includes('optionalSubjects_'))
      const tasks = option.optionalTasks
      if (tasks.length && subjects.length) {
        option.optionalTasks = tasks.map((item, index) => ({ name: item, optionalSubjects: option[subjects[index]] }))
        subjects.forEach(item => delete option[item])
      }
    },
    beforeEdit(row) {
      this._optionalTasks = [...row.optionalTasks]
      row.optionalTasks = row.optionalTasks.map(item => item.name)
    },
    afterEdit(row) {
      this._optionalTasks.forEach((item, index) => {
        this.schema[this._schemaLength + index][`optionalSubjects_${index}`] = item.optionalSubjects
      })
    },
    dialogIsClose() {
      this.schemaOptionalMajors.options = []
    },
    dialogVisible(count = 0) {
      this.schema[1].order = count + 1
    }
  }
}
</script>
