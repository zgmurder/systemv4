<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/trainerlevel" @dialogVisible="dialogVisible" />
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
        { prop: 'order', label: '排序', width: '50', noFilter: true },
        { prop: 'name', label: '等级名称' },
        { prop: 'scoreReq', label: '达标要求', handleValue: (value) => optionalScores[value], noFilter: true }
      ],
      schema: [
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 },
        { fieldType: 'input', placeholder: '等级名称', label: '等级名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '达标要求', label: '达标要求', vModel: 'scoreReq', scoreReq: 2, options: optionalScores, optValue: 'index', required: true }
      ]
    }
  },
  methods: {
    dialogVisible(count = 0) {
      this.schema[0].order = count + 1
    }
  }
}
</script>
