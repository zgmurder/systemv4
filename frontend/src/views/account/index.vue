<template>
  <div class="app-container">
    <form-and-table url="/account/user" :before-click-add="beforeClickAdd" :columns="columns" :schema="schema" :no-handle="noHandle" @cell-mouse-enter="()=>false" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import { queryRoles } from '@/api/account'
import { queryOrgs, queryList } from '@/api/baseApi'
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
        const found = this.roleList.find(item => item.roleName === row.roleName)
        const permissions = found.permissions.reduce((prev, curr) => {
          const arr = curr.actions.map(item => `${curr.schemaName}:${item}`)
          return prev.concat(arr)
        }, [])
        const ownPermissions = this.$store.getters.permissions || []
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
          placeholder: '选择单位',
          label: '选择单位',
          vModel: 'organizationId',
          organizationId: '',
          required: true,
          // optValue: 'objectId',
          width: '100%',
          onChange: (item, obj) => {
            this.org = { ...obj }
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
      ],
      roleList: []
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
    queryList('/account/role').then(list => {
      this.roleList = list
      this.schemaRoleName.options = list.filter(item => item.roleName !== 'Administrator')
    })
  },
  methods: {
    aaaa() {
      console.log(111)
    },
    async querySearch(queryString = '', cb) {
      let { displayName } = this.$store.getters.organization
      if (queryString && queryString.includes(displayName)) {
        displayName = queryString
      }
      const result = await queryOrgs({
        $or: [{ 'orgType': '分队' }, { 'orgType': '部队' }],
        sort: { orgSequence: 1 },
        limit: 20,
        displayName: {
          '$regex': displayName
        }
      })
      const arr = result.map(item => ({
        value: item.displayName,
        ...item
      }))
      cb(arr)
    },
    beforeSubmit(target) {
      target.organizationId = this.org.id
      // target.parentOrgIds = this.org.parentIds
    },
    beforeEdit(target) {
      this.org = { ...(target.organization || {}) }
      target.organizationId = target.organization && target.organization.displayName
    },
    handleRole(roleName) {
      const found = this.roleList.find(item => item.roleName === roleName)
      return found.displayName + '（' + found.permissions.reduce((prev, curr) => {
        return `${prev}${curr.schemaName}：${curr.actions.join('、')}；`
      }, '') + '）'
    },
    beforeClickAdd() {
      if (this.$tools.isEmpty(this.$store.getters.organization)) {
        this.$message.warning('请选添加单位')
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

