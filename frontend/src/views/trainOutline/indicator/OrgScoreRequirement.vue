<template>
  <div class="OrgScoreRequirement">
    <form-and-table ref="formAndTable" url="standard/orgscorerequirement" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { ScoreCriteria2 } from '@/const/'
import standardMixin from '../standardMixin'
import { queryList } from '@/api/baseApi'
// class OrgScoreRequirement {
//   private String id;
//   private String standardId;
//   private String orgCategory;   // 单位分类
//   private int scoreReq;         // 最低成绩要求
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
        { prop: 'scoreReq',
          label: '最低成绩要求',
          handleValue: (value) => {
            return ScoreCriteria2.Level4.optionalScores[value]
          }
        }
      ],
      schema: [
        { fieldType: 'select', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategory', orgCategory: '', keyOptions: [] },
        { fieldType: 'select', placeholder: '最低要求', label: '最低要求', vModel: 'scoreReq', scoreReq: '', optValue: 'index', options: ScoreCriteria2.Level4.optionalScores }
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
