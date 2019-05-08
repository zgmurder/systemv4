<template>
  <div class="orgProperty">
    <formAndTable :schema="schema" :columns="columns" url="Dictionary/OrgProperty" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import comRender from '@/pages/common/com-render'
export default {
  name: 'OrgProperty',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'name', label: '单位属性名称', width: '180' },
        { prop: 'optionalMajors', label: '该单位可选专业' }],
      schema: [
        { fieldType: 'input', placeholder: '单位属性', label: '单位属性', vModel: 'name', required: true },
        { fieldType: 'input', placeholder: '可选专业', label: '可选专业', vModel: 'optionalMajors' }
      ]
    }
  },
  methods: {
    beforeSubmit(formData) {
      formData.optionalMajors = this.$tools.strToArr(formData.optionalMajors)
    },
    beforeEdit(target) {
      target.optionalMajors = target.optionalMajors.toString()
    }
  }
}
</script>
