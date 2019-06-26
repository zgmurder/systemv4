<template>
  <div class="BMIStandard">
    <form-and-table ref="formAndTable" url="standard/motorrequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
// class MotorRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;     // 单位分类
//   private String majorType;       // 专业类型
//   private int quota;              // 数量配额: 训练小时数要求或行车里程数
//   private String unitType;        // 计量单位
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
        { prop: 'orgCategory', label: '单位分类' },
        { prop: 'motorType', label: '摩托训练类型' },
        { prop: 'bulletReq', label: '数量指标', handleValue: (val, row) => `${row.quota} ${row.unitType}` }
      ],
      schema: [
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', required: true, orgCategory: '', options: [] },
        { fieldType: 'select', placeholder: '训练类型', label: '训练类型', vModel: 'motorType', required: true, motorType: '', valueKey: 'id', options: [], onChange: this.handleChangeMotorType },
        { fieldType: 'input-number', label: '数量（小时）', vModel: 'quota', quota: 0 }
        // { fieldType: 'input', placeholder: '计量单位', label: '计量单位', vModel: 'unitType', unitType: '', disabled: true }
      ]
    }
  },
  computed: {
    schemaOrgCategory() {
      return this.schema.find(item => item.vModel === 'orgCategory')
    },
    schemaMotorType() {
      return this.schema.find(item => item.vModel === 'motorType')
    },
    schemaQuota() {
      return this.schema.find(item => item.vModel === 'quota')
    },
    schemaUnitType() {
      return this.schema.find(item => item.vModel === 'unitType')
    }

  },
  async created() {
    this.schemaOrgCategory.options = await queryList('dictionary/orgcategory')
    this.schemaMotorType.options = await queryList('dictionary/motortype')
  },
  methods: {
    beforeSubmit(formData) {
      formData.unitType = formData.motorType.unit
      formData.motorType = formData.motorType.name
    },
    beforeEdit(row) {
      this.schemaQuota.label = `数量（${row.unitType}）`
    },
    handleChangeMotorType(value, obj) {
      obj && (this.schemaQuota.label = `数量（${obj.unit}）`)
    }
  }
}
</script>
