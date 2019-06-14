<template>
  <div class="orgProperty">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/orgproperty" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import comRender from '@/pages/common/com-render'
import tools from '@/utils/tools'
export default {
  name: 'OrgProperty',
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50' },
        { prop: 'name', label: '单位属性名称', width: '180', filterConfig: value => ({ '$regex': value }) },
        { prop: 'optionalMajors', label: '该单位可选专业', filterConfig: value => ({ '$regex': value }), handleValue: value => value && value.join('、') }],
      schema: [
        { fieldType: 'input', placeholder: '单位属性', label: '单位属性', vModel: 'name', required: true },
        { fieldType: 'input', width: '100%', placeholder: '可选专业', label: '可选专业', vModel: 'optionalMajors' },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  methods: {
    beforeSubmit(formData) {
      formData.optionalMajors = tools.strToArr(formData.optionalMajors)
    },
    beforeEdit(target) {
      target.optionalMajors = target.optionalMajors.toString()
    },
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
