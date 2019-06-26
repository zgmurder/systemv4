<template>
  <div class="BMIStandard">
    <form-and-table ref="formAndTable" url="standard/bulletrequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { BulletNumType } from '@/const'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
// class BulletRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;     // 单位分类
//   private String majorType;       // 专业类型
//   private String ordnanceType;    // 军械类型
//   private String rankL1;          // 军衔一级分类(义务兵/士官/军官)
//   private int quota;              // 数量配额
//   private String unitType;        // 计量单位
//   private String numType;         // 数量类型(单人/单炮/总量)
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
        { prop: 'ordnanceType', label: '军械类型' },
        // { prop: 'bulletReq',
        //   label: '数量指标',
        //   handleValue: (value) => {
        //     return `${value.quota} ${value.unitType} / ${value.numType}`
        //   }
        // },
        { prop: 'majorType', label: '专业类型' },
        { prop: 'rankL1', label: '军衔等级' }
      ],
      schema: [
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', orgCategory: '', options: [] },
        { fieldType: 'input', placeholder: '专业类型', label: '专业类型', vModel: 'majorType', majorType: '' },
        { fieldType: 'select', placeholder: '军械类型', label: '军械类型', vModel: 'ordnanceType', valueKey: 'id', options: [] },
        { fieldType: 'select', placeholder: '军衔等级', label: '军衔等级', vModel: 'rankL1', rankL1: '', options: [] },
        { fieldType: 'select', placeholder: '数量类型', label: '数量类型', vModel: 'numType', numType: '', options: BulletNumType },
        { fieldType: 'input-number', placeholder: '数量配额', label: '数量配额', vModel: 'quota', quota: 0 }
        // { fieldType: 'select', placeholder: '计量单位', label: '计量单位', vModel: 'unitType', unitType: '' }
      ]
    }
  },
  computed: {
    schemaObj() {
      return this.schema.reduce((prev, curr) => {
        prev[`${curr.vModel}Schema`] = curr
        return prev
      }, {})
    }
  },
  watch: {
    // 'schemaBulletReqNumType.bulletReqNumType': {
    //   handler(newValue) {
    //     const arr = ['人.年', '枪.年', '炮.年', '班.年', '年']
    //     if (arr.includes(newValue)) return
    //     const mapArr = Object.values(BulletNumType)
    //     const index = mapArr.findIndex(item => item === newValue)
    //     this.schemaBulletReqNumType.bulletReqNumType = arr[index]
    //   },
    //   isDeep: true
    // }

  },
  async created() {
    this.schemaObj.orgCategorySchema.options = await queryList('dictionary/orgcategory')
    this.schemaObj.ordnanceTypeSchema.options = await queryList('dictionary/ordnancetype')
    this.schemaObj.rankL1Schema.options = await queryList('dictionary/militaryrank')
  },
  methods: {
    beforeSubmit(target) {
      target.unitType = target.ordnanceType.bulletUnit
      target.ordnanceType = target.ordnanceType.name

    //   const deletesKeys = ['bulletReqQuota', 'bulletReqNumType', 'bulletReqUnitType']
    //   formData.bulletReq = {
    //     quota: formData.bulletReqQuota,
    //     numType: formData.bulletReqNumType,
    //     unitType: formData.bulletReqUnitType
    //   }
    //   formData.standard = this.$parent.standard.objectId
    //   Object.keys(formData).forEach(item => {
    //     if (deletesKeys.includes(item)) delete formData[item]
    //   })
    }
    // beforeEdit(row) {
    //   row.bulletReqUnitType = row.bulletReq.unitType
    //   row.bulletReqNumType = row.bulletReq.numType
    //   row.bulletReqQuota = row.bulletReq.quota
    //   row.standard = this.$parent.standard.name
    // },
    // handleChangeOrdnanceType() {
    //   let unitType = '发'
    //   unitType = (this.schemaOrdnanceType.options.find(item => { return this.schemaOrdnanceType.ordnanceType === item.name }) || {}).bulletUnit
    //   this.schemaBulletReqUnitType.bulletReqUnitType = unitType
    // }

  }
}
</script>
