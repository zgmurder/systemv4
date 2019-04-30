<template>
  <div class="app-container">
    <form-and-table url="/account/users" :columns="columns" :schema="schema" :no-handle="noHandle" @cell-mouse-enter="()=>false" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryRoles } from '@/api/account'
import { queryOrgs } from '@/api/org'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      option: {},
      columns: [
        { prop: 'username', label: '用户名', noHandle: true },
        { prop: 'roleName', label: '角色', handleValue: this.handleRole },
        { prop: 'organization', label: '单位', handleValue: org => org && org.displayName }
        // { prop: 'organization', label: '支持功能' }
      ],
      noHandle: row => {
        if (row.username === this.$store.getters.username) {
          return true
        }
        const found = this.schemaRoleName.options.find(item => item.roleName === row.roleName)
        const permissions = found.permissions.reduce((prev, curr) => {
          const arr = curr.actions.map(item => `${curr.schemaName}:${item}`)
          return prev.concat(arr)
        }, [])
        const ownPermissions = this.$store.getters.permissions
        const is = permissions.every(item => {
          const str = item.replace(/[\w\W]*:/g, '*:')
          // || ownPermissions.includes(item.replace(/\d?=:/))
          return ownPermissions.includes(item) || ownPermissions.includes(str)
        })
        return !is
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
      this.schemaRoleName.options = list
    })
  },
  methods: {
    aaaa() {
      console.log(111)
    },
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
    },
    handleRole(roleName) {
      const found = this.schemaRoleName.options.find(item => item.roleName === roleName)
      return found.displayName + '（' + found.permissions.reduce((prev, curr) => {
        return `${prev}${curr.schemaName}：${curr.actions.join('、')}；`
      }, '') + '）'
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

