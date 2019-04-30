<template>
  <div>
    <formAndTable url="/device/scales" :columns="columns" :schema="schema" />
  </div>
</template>
<script>
import formAndTable from '@/components/formAndTable'
import { queryOrgs } from '@/api/org'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      url: '',
      columns: [
        { prop: 'serialNumber', label: '设备序号' },
        { prop: 'name', label: '设备名称' },
        { prop: 'model', label: '设备型号' },
        { prop: 'vendor', label: '设备厂家' },
        { prop: 'organizationId', label: '授权单位' }
        // { prop: 'organization', label: '支持功能' }
      ],
      schema: [
        {
          fieldType: 'autocomplete',
          fetchSuggestions: this.querySearch,
          placeholder: '单位名称',
          label: '单位名称',
          vModel: 'organizationId',
          organizationId: '',
          required: true,
          // optValue: 'objectId',
          width: '100%',
          onChange: (item, obj) => {
            this.org = { ...obj }
            // const initArr = [obj.value, '123456', '123456', '']
            // this.schema.forEach((item, index) => {
            //   if (index) item[item.vModel] = initArr[index - 1]
            // })
          }
        },
        {
          fieldType: 'input',
          width: '100%',
          placeholder: '设备序号',
          label: '设备序号',
          vModel: 'serialNumber',
          required: true
        },
        {
          fieldType: 'input',
          width: '100%',
          placeholder: '设备名称',
          label: '设备名称',
          required: true,
          vModel: 'name'
        },
        {
          fieldType: 'input',
          width: '100%',
          required: true,
          placeholder: '设备型号',
          label: '设备型号',
          vModel: 'model'
          // onInput: (value, item) => {
          //   if (!value) return (item.error = '')
          //   if (value !== this.schemaPassword.password) { item.error = item.errorMassage }
          // },
          // validate: item => item[item.vModel] === this.schemaPassword.password,
          // errorMassage: '密码不一致'
        },
        {
          fieldType: 'input',
          width: '100%',
          placeholder: '设备厂家',
          label: '设备厂家',
          required: true,
          vModel: 'vendor'
        }
      ]
    }
  },
  methods: {
    async querySearch(queryString = '', cb) {
      // let str
      // const { orgSequence, displayName } = this.$store.getters.organization
      // if (orgSequence < 2) str = queryString
      // else {
      //   if (displayName.includes(queryString)) str = displayName
      //   else str = displayName + queryString
      // }
      const result = await queryOrgs()
      const arr = result.map(item => ({
        value: item.displayName,
        ...item
      }))
      cb(arr)
    },
    beforeSubmit(target) {
      target.organizationId = this.org.id
      target.parentOrgIds = this.org.parentIds
      console.log(target)
    }
  }

}
</script>
