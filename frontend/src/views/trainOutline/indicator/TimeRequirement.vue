<template>
  <div class="PersonRequirement">
    <form-and-table ref="formAndTable" url="standard/timerequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
import { PersonProperty } from '@/const/index'
// class TimeRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;       // 单位分类
//   private String personProperty;    // 人员属性分类
//   private Double months;               // 年度训练月数
//   private Double days;                 // 年度训练天数
//   private Double hours;                // 年度训练小时数
//   private Double daysPerMonth;          // 月度训练天数
//   private Double daysPerWeek;           // 每周训练天数
//   private Double hoursPerDay;           // 每天训练小时数
//   private Double hoursAtNight;          // 年度夜训小时数
//   private Double rateAtNight;           // 年度夜巡比率
//   private Double flexibleDays;          // 机动天数
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
        { prop: 'orgCategory', label: '单位分类', width: '200px' },
        { prop: 'personProperty', label: '人员属性', width: '100px' },
        {
          label: '时间要求',
          handleValue: (value, row) => {
            return `年度训练月数：${row.months}(月), 年度训练天数：${row.days}(天)，年度训练小时数：${row.hours} (小时)，年度夜训小时数：${row.hoursAtNight} (小时)，年度夜巡比率：${row.rateAtNight}(%)，月度训练天数：${row.daysPerMonth} (天)，每周训练天数：${row.daysPerWeek} (天)，每天训练小时数：${row.hoursPerDay} (小时)，机动天数：${row.flexibleDays}(天)`
          }
        }
      ],
      schema: [
        // { fieldType: 'input', placeholder: '训练大纲', label: '训练大纲', vModel: 'standard', standard: '', disabled: true },
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', orgCategory: '', keyOptions: [] },
        { fieldType: 'select', placeholder: '人员属性', label: '人员属性', vModel: 'personProperty', personProperty: '', options: PersonProperty },
        { fieldType: 'input-number', placeholder: '年度训练月数', label: '年度训练月数', vModel: 'months', months: '' },
        { fieldType: 'input-number', placeholder: '年度训练天数', label: '年度训练天数', vModel: 'days', days: '' },
        { fieldType: 'input-number', placeholder: '年度训练小时', label: '年度训练小时', vModel: 'hours', hours: '' },
        { fieldType: 'input-number', placeholder: '年度夜训小时', label: '年度夜训小时', vModel: 'hoursAtNight', hoursAtNight: '' },
        { fieldType: 'input-number', placeholder: '年度夜巡比率', label: '年度夜巡比率', vModel: 'rateAtNight', rateAtNight: '' },
        { fieldType: 'input-number', placeholder: '月度训练天数', label: '月度训练天数', vModel: 'daysPerMonth', daysPerMonth: '' },
        { fieldType: 'input-number', placeholder: '每周训练天数', label: '每周训练天数', vModel: 'daysPerWeek', daysPerWeek: '' },
        { fieldType: 'input-number', placeholder: '每天训练小时', label: '每天训练小时', vModel: 'hoursPerDay', hoursPerDay: '' },
        { fieldType: 'input-number', placeholder: '机动天数', label: '机动天数', vModel: 'flexibleDays', flexibleDays: '' }
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
