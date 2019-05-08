<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { ScoreCriteria2 } from '@/const/index'
const optionalScores = ScoreCriteria2.Level4.optionalScores
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '教练员等级' },
        { prop: 'scoreReq', label: '达标要求', handleValue: (value) => optionalScores[value] }
      ],
      schema: [
        { fieldType: 'input', placeholder: '军衔名称', label: '军衔名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '达标要求', label: '达标要求', vModel: 'scoreReq', scoreReq: 2, options: optionalScores, optValue: 'index', required: true }
      ]
    }
  },
  methods: {

  }
}
</script>
