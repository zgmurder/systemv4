<template>
  <div class="app-container">
    <form-and-table :handler="Handler" :columns="columns" :schema="schema" :no-handle="noHandle"/>
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import { saveItem, deleteItem, toPointer, queryListAndTotal } from '@/api/account'
import { queryUsers as queryList, deleteUser as deleteItem, updateUser as updateItem, saveUser as saveItem, queryUsersAndTotal as queryListAndTotal, queryRoles } from '@/api/account'
import { queryOrgs } from '@/api/org'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      Handler: { queryList, deleteItem, saveItem, queryListAndTotal, updateItem },
      columns: [
        { prop: 'username', label: '用户名', noHandle: true },
        { prop: 'roleName', label: '角色' },
        { prop: 'organization', label: '单位', handleValue: org => org && org.displayName }
        // { prop: 'organization', label: '支持功能' }
      ],
      noHandle: row => {
        return row.roleName === 'Administrator'
      },
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
            console.log(this.org)
            const initArr = [obj.value, '123456', '123456', '']
            this.schema.forEach((item, index) => {
              if (index) item[item.vModel] = initArr[index - 1]
            })
          }
        },
        {
          fieldType: 'input',
          width: '100%',
          placeholder: '用户名',
          label: '用户名',
          vModel: 'username',
          required: true
        },
        {
          fieldType: 'input',
          width: '100%',
          placeholder: '密码',
          label: '密码',
          required: true,
          type: 'password',
          vModel: 'password'
        },
        {
          fieldType: 'input',
          width: '100%',
          required: true,
          placeholder: '确认密码',
          label: '确认密码',
          vModel: 'password',
          type: 'password',
          onInput: (value, item) => {
            if (!value) return (item.error = '')
            if (value !== this.schemaPassword.password) { item.error = item.errorMassage }
          },
          validate: item => item[item.vModel] === this.schemaPassword.password,
          errorMassage: '密码不一致'
        },
        {
          fieldType: 'select',
          width: '100%',
          placeholder: '选择角色',
          label: '选择角色',
          required: true,
          vModel: 'roleName',
          optLabel: 'displayName',
          optValue: 'roleName',
          options: []
        }
      ]
    }
  },
  computed: {
    schemaUsername() {
      return this.schema.find(item => item.vModel === 'username')
    },
    schemaRoleName() {
      return this.schema.find(item => item.vModel === 'roleName')
    },
    schemaPassword() {
      return this.schema.find(item => item.vModel === 'password')
    }
  },
  created() {
    queryRoles().then(list => {
      this.schemaRoleName.options = list.filter(item => item.roleName !== 'Administrator')
    })
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
    },
    beforeEdit(target) {
      this.org = { ...(target.organization || {}) }
      target.organizationId = target.organization && target.organization.displayName
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

