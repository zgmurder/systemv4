<template>
  <div class="PersonScoreRequirement">
    <form-and-table ref="formAndTable" url="standard/personscorerequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
// import comRender from '@/pages/common/com-render'
import formAndTable from '@/components/formAndTable'
import { ScoreCriteria2, PersonProperty } from '@/const/'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'
// class PersonScoreRequirement {
//   private String id;
//   private String standardId;
//   private String personProperty;    // 训练大纲
//   private List<String> ranks;       // 军衔等级列表
//   private int startYear;            // 任职年限范围,比如0-2年, 2年以上等
//   private int endYear;
//   private int scoreReq;             // 成绩要求
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
        { prop: 'personProperty', label: '人员属性' },
        { prop: 'ranks', label: '军衔等级', handleValue: value => value.join('、') },
        { label: '任职年限范围', handleValue: (value, row) => `${row.startYear}-${row.endYear}年` },
        { prop: 'scoreReq', label: '最低成绩要求', width: 120, handleValue: value => ScoreCriteria2.Level4.optionalScores[value] }

      ],
      schema: [
        { fieldType: 'select', placeholder: '人员属性', label: '人员属性', vModel: 'personProperty', personProperty: '', options: Object.values(PersonProperty) },
        { fieldType: 'select', placeholder: '军衔等级', label: '军衔等级', vModel: 'ranks', ranks: [], options: [], multiple: true },
        { fieldType: 'input-number', placeholder: '最低年限', label: '最低年限', vModel: 'startYear', startYear: 0 },
        { fieldType: 'input-number', placeholder: '最高年限', label: '最高年限', vModel: 'endYear', endYear: 0 },
        { fieldType: 'select', placeholder: '最低要求', label: '最低要求', vModel: 'scoreReq', scoreReq: '', options: ScoreCriteria2.Level4.optionalScores, optValue: 'index' }
      ]
    }
  },
  computed: {
    schemaRanks() {
      return this.schema.find(item => item.vModel === 'ranks')
    }
  },
  async created() {
    // this.schema[0].standard = this.$parent.standard.name
    this.schemaRanks.options = await queryList('dictionary/militaryrank')
  }
//   methods: {
//     beforeSubmit(formData) {
//       const deletesKeys = ['startYear', 'endYear']
//       formData.yearRange = {
//         startYear: formData.startYear,
//         endYear: formData.endYear
//       }
//       formData.scoreReq = ScoreCriteria2.Level4.optionalScores.findIndex(item => item === formData.scoreReq)
//       formData.standard = this.$parent.standard.objectId
//       Object.keys(formData).forEach(item => {
//         if (deletesKeys.includes(item)) delete formData[item]
//       })
//     },
//     beforeEdit(row) {
//       row.scoreReq = ScoreCriteria2.Level4.optionalScores[row.scoreReq]
//       row.standard = this.$parent.standard.name
//       row.startYear = row.yearRange.startYear
//       row.endYear = row.yearRange.endYear
//     }
//   }
}
</script>
