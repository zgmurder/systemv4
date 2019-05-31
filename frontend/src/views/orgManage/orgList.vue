<template>
  <div>
    <!--  class="app-container" -->
    <div v-if="$store.getters.organization" style="display:flex;justify-content: flex-end;padding:10px">
      <el-button size="small" :type="deactivated ? 'info':'primary'" @click="deactivated = !deactivated">{{ deactivated?'隐藏':'显示' }}停用单位</el-button>
    </div>
    <tree-org
      v-if="$store.getters.organization"
      :render-content="renderContent"
      :default-expanded-keys="[$store.getters.organization.id]"
      border
      @update="resolve=>cb = resolve"
    />
    <el-button v-else style="display:block;margin:20px auto" type="primary" icon="el-icon-plus" @click="formDialogVisible = true">添加根单位</el-button>
    <el-dialog
      :visible.sync="formDialogVisible"
      width="70%"
      @close="initForm"
    >
      <div slot="title">{{ id?'修改数据':'添加数据' }}</div>
      <formSchema ref="formSchema" :schema="schema" :editing="!!id" @formFinish="formFinish" />
      <!-- {{schemaObj.name}} -->
    </el-dialog>
  </div>
</template>

<script>

import treeOrg from '@/components/Tree'
import formSchema from '@/components/formAndTable/formSchema'
// import {  addOrg } from '@/api/org'
// import { saveItem } from '@/api/baseApi'
import { OrgOptions } from './data'
import { OrgType, OrgSequences } from '@/const/index'
import { queryList, saveItem, updateItem, deleteItem, stopOrg } from '@/api/baseApi'
// private String id;
//   private String name;              // 单位短名称，手动录入
//   private String displayName;       // 单位完整名称(后端自动生成)
//   private int nodeCode;             // 单位同级排序码，手动录入
//   private String orgCode;           // 单位完整排序码，自动生成
//   private String parentId;          // 父单位ID，页面手动选择
//   private List<String> parentIds = new ArrayList<>();   // 上级单位ID列表，自动生成
//   private List<String> childrenIds = new ArrayList<>(); // 直属子单位ID列表,自动生成
//   private int orgSequence;          // 编制序列，手动选择
//   private String orgType;           // 单位类型，手动选择
//   private String orgCategory;       // 单位分类，手动选择
//   private String orgProperty;       // 单位属性，根据单位分类自动设置(前端)
//   private String serviceType;       // 勤务类型，根据单位分类进行获取后选择
//   private List<String> orgMajors;   // 专业类型，根据单位分类进行获取后选择
//   private Boolean important;        // 重要任务方向部队标志
//   private String specialMission;    // 重要任务方向部队类型
//   private int planSodierCount;      // 不填
//   private String address;           // 地址，手动录入
//   private Double longitude;   // 经度
//   private Double latitude;    // 维度
//   private Double altitude;    // 海拔高度

//   private Boolean deactivated;  // 停用标志，通过单独的停用按钮来触发
//   private Long deactivatedAt;   // 失效时间
export default {
  name: 'TreeTableDemo',
  components: { treeOrg, formSchema },
  data() {
    return {
      formDialogVisible: false,
      schema: [
        {
          fieldType: 'input',
          placeholder: '上级单位',
          label: '上级单位',
          vModel: 'parentName',
          parentName: '',
          disabled: true
        },
        {
          fieldType: 'autocomplete',
          fetchSuggestions: this.querySearch,
          placeholder: '单位名称',
          label: '单位名称',
          vModel: 'name',
          name: '',
          required: true
        },
        {
          fieldType: 'input',
          placeholder: '单位全称',
          label: '单位全称',
          vModel: 'displayName',
          displayName: '',
          disabled: true
        },
        {
          fieldType: 'select',
          placeholder: '编制序列',
          label: '编制序列',
          vModel: 'orgSequence',
          orgSequence: undefined,
          options: OrgSequences,
          optValue: 'type',
          required: true
        },
        {
          fieldType: 'select',
          placeholder: '单位类型',
          label: '单位类型',
          vModel: 'orgType',
          orgType: '',
          options: Object.values(OrgType),
          required: true
        },
        {
          fieldType: 'select',
          placeholder: '单位分类',
          label: '单位分类',
          vModel: 'orgCategory',
          filterable: true,
          valueKey: 'id',
          options: [],
          required: true,
          onChange: (schema, obj) => {
            if (obj) {
              this.schemaObj.orgMajorsSchema.options = obj.optionalMajors
              this.schemaObj.serviceTypeSchema.options = obj.optionalServices
              // this.schemaObj.orgPropertySchema.orgProperty = obj.orgProperty
            } else {
              this.schemaObj.orgMajorsSchema.options = []
              this.schemaObj.serviceTypeSchema.options = []
            }
          }
        },
        {
          fieldType: 'input-number',
          placeholder: '同级排序码',
          label: '同级排序码',
          vModel: 'nodeCode',
          nodeCode: 1,
          required: true
        },
        // {
        //   fieldType: 'input',
        //   placeholder: '单位属性',
        //   label: '单位属性',
        //   vModel: 'orgProperty',
        //   orgProperty: '',
        //   disabled: true
        // },
        {
          fieldType: 'select',
          placeholder: '专业类型',
          label: '专业类型',
          vModel: 'orgMajors',
          orgMajors: [],
          multiple: true,
          options: []
        },
        {
          fieldType: 'select',
          placeholder: '勤务类型',
          label: '勤务类型',
          vModel: 'serviceType',
          serviceType: '',
          options: []
        },
        {
          fieldType: 'checkbox',
          label: '特殊部队',
          vModel: 'important',
          important: false,
          border: true
        },
        {
          fieldType: 'select',
          placeholder: '部队类型',
          label: '部队类型',
          vModel: 'specialMission',
          specialMission: '',
          options: [],
          controlBy: {
            handle: value => value,
            name: 'important'
          }
        },

        // {
        //   fieldType: 'input-number',
        //   placeholder: '编制数量',
        //   label: '编制数量',
        //   vModel: 'planSoldierCount',
        //   planSoldierCount: 0,
        //   min: 0
        // },
        {
          fieldType: 'input-number',
          placeholder: '海拔高度',
          label: '海拔高度',
          vModel: 'altitude',
          altitude: 0,
          min: 0
        },
        {
          fieldType: 'input-number',
          placeholder: '经度',
          label: '经度',
          vModel: 'longitude',
          longitude: 0
        },
        {
          fieldType: 'input-number',
          placeholder: '纬度',
          label: '纬度',
          vModel: 'latitude',
          latitude: 0
        },
        {
          fieldType: 'input',
          placeholder: '单位地址',
          label: '单位地址',
          vModel: 'address',
          address: '',
          width: '100%'
        }
        // {fieldType: "checkbox", placeholder: "是否指挥员", label: "指挥员", vModel: "isCommander", isCommander: false,border:true},
      ],
      className: 'Organization2',
      currOrg: {},
      currNode: {},
      id: '',
      url: 'resource/organization',
      cb: () => {},
      deactivated: false
    }
  },
  computed: {
    schemaObj() {
      return this.schema.reduce((prev, curr) => {
        prev[`${curr.vModel}Schema`] = curr
        return prev
      }, {})
    },
    departOptions() {
      const found = OrgOptions.find(item =>
        item.condition.orgSequence
          ? item.condition.orgSequence === this.currOrg.orgSequence
          : item.condition.orgSequences.includes(this.currOrg.orgSequence)
      )
      return (found && found.options) || []
    }
  },
  watch: {
    'schemaObj.nameSchema.name': {
      handler(newValue, oldValue) {
        if (!newValue) this.initForm()
        else if (this.currOrg.orgSequence === 1 || !this.currOrg.orgSequence) {
          this.schemaObj.displayNameSchema.displayName = newValue
        } else if (this.currOrg.orgSequence === 2) {
          if (this.currOrg.orgType === '部门') {
            this.schemaObj.displayNameSchema.displayName = this.id ? (this.currNode.parent.data.displayName || '') + newValue : `${this.currOrg.displayName}${newValue}`
          } else {
            this.schemaObj.displayNameSchema.displayName = this.id ? newValue : `${this.currOrg.displayName}${newValue}`
          }
        } else {
          this.schemaObj.displayNameSchema.displayName = this.id ? (this.currNode.parent.data.displayName || '') + newValue : `${this.currOrg.displayName}${newValue}`
        }
        !this.id && this.handleDepart(newValue)
      }
    },
    'schemaObj.orgTypeSchema.orgType': {
      async handler(newValue) {
        if (!newValue) {
          this.schemaObj.orgCategorySchema.orgCategory = ''
          this.schemaObj.orgCategorySchema.options = []
        } else {
          const obj = this.schemaObj.orgCategorySchema
          obj.disabled = newValue === '部门'
          if (obj.disabled) {
            obj.orgCategory = obj.orgCategory || this.currOrg.orgCategory
          }
          obj.options = await queryList('dictionary/orgcategory', {
            where: { orgType: newValue }
          })
          if (this.id && !obj.disabled) {
            const [optionalMajors, optionalServices] = [[], []]
            obj.orgCategory = obj.options.find(item => item.name === obj.orgCategory) || { optionalMajors, optionalServices }
            this.schemaObj.orgMajorsSchema.options = obj.orgCategory.optionalMajors
            this.schemaObj.serviceTypeSchema.options = obj.orgCategory.optionalServices
          }
        }
      }
    }
  },
  created() {
    queryList('dictionary/specialmission').then(list => {
      this.schemaObj.specialMissionSchema.options = list
    })
  },
  methods: {
    //
    renderContent(h, { node, data, store }) {
      const isRoot = data.id === this.$store.getters.organization.id
      node.visible = !data.deactivated || this.deactivated
      return (
        <span class='custom-tree-node'>
          <span>
            <span>{data.nodeCode} {data.name}</span>
            <el-tag type='success' size='mini' class='tag'> {OrgSequences.find(item => item.type === data.orgSequence).name}</ el-tag>
            <el-tag type='info' size='mini' class='tag'> {data.orgCategory} </el-tag>
            <el-tag type='warning' size='mini' class='tag'> {data.orgType} </el-tag>
          </span>
          <span>
            {!isRoot && <el-button size='mini' type={data.deactivated ? '' : 'info'} disabled={isRoot} on-click={e => {
              e.stopPropagation()
              this.stopOrg(data, node, store, data.deactivated)
            }} plain>{data.deactivated ? '启用' : '停用'}</el-button>}
            <el-button size='mini' type='danger' disabled={!!data.childCount} on-click={e => {
              e.stopPropagation()
              this.deleteOrg(data, node, store)
            }} plain title={!!data.childCount && '存在下级单位无法操作'}>删除</el-button>
            <el-button size='mini' type='success' on-click={e => {
              e.stopPropagation()
              this.handeEdit(data, node)
            }} plain> 查看编辑 </el-button>
            <el-button size='mini' type='primary' on-click={e => {
              if (node.expanded)e.stopPropagation()
              this.handeAdd(data, node)
              // e.stopPropagation()
              // if (!node.isLeaf && !node.expanded)node.expanded = true
            }} plain> 添加下级单位 </el-button>
          </span>
        </span>
      )
    },
    initForm() {
      this.$refs.formSchema.initForm()
      this.id = ''
      this.currNode = {}
      this.currOrg = {}
    },
    handeAdd(org, node) {
      this.currOrg = org
      this.currNode = node
      this.formDialogVisible = true
      const found = this.schema.find(item => item.vModel === 'nodeCode')
      this.schemaObj.orgMajorsSchema.options = []
      this.schemaObj.serviceTypeSchema.options = []
      // 防止初始值被污染
      setTimeout(() => {
        this.schemaObj.parentNameSchema.parentName = this.currOrg.name
        this.schemaObj.displayNameSchema.displayName = this.currOrg.name
      })
      this.$nextTick(() => {
        found.nodeCode = node.childNodes.length + 1
      })
    },
    handeEdit(data, node) {
      this.formDialogVisible = true
      this.id = data.id
      this.currOrg = data
      this.currNode = node
      setTimeout(() => {
        this.schemaObj.parentNameSchema.parentName = (this.currNode.parent.data || {}).name
      })
      setTimeout(() => {
        this.schema.forEach(item => {
          item[item.vModel] = data[item.vModel] || item[item.vModel]
        })
      }, 100)
    },
    querySearch(queryString, cb) {
      queryString && this.handleString(queryString)
      let results = this.departOptions.map(item => ({ value: item.name }))
      results = queryString
        ? results.filter(item => item.value.includes(queryString))
        : results
      cb(results)
    },
    handleString(value) {
      if (!value) return
      const parentName = this.id ? this.currOrg.parentName : this.currOrg.name
      if (value.includes(parentName)) {
        this.$message.warning('不能输入包含上级名称，系统已自动处理')
        this.schemaObj.nameSchema.name = value.split(parentName).join('')
      }
      // if (value) this.handleChangeOrgName();
      // else this.formData.orgCategory = "";
    },
    handleDepart(newValue) {
      if (!newValue) return
      const foundDepart = this.departOptions.find(item => item.name === newValue)
      if (foundDepart) {
        this.schemaObj.orgTypeSchema.orgType = foundDepart.orgType
        this.schemaObj.orgSequenceSchema.orgSequence = foundDepart.orgSequence
      }
      const foundOrgSequence = OrgSequences.find(item =>
        item.name.includes('支队') ? newValue.includes('支队') : newValue.includes(item.name))
      if (foundOrgSequence) {
        this.schemaObj.orgTypeSchema.orgType = foundOrgSequence.describe
        this.schemaObj.orgSequenceSchema.orgSequence = newValue.includes('支队') ? '' : foundOrgSequence.type
      }
    },
    updateChildren(node, deactivated = false) {
      queryList('resource/organization', { where: {
        parentId: node.data ? node.data.id : {
          '$exists': false
        }
      }}).then(children => {
        console.log(children)

        if (children.length) {
          node.childNodes.length = 0
          node.doCreateChildren(children)
          // node.expanded = true
          node.isLeaf = false
          this.$message.success('操作成功')
          this.formDialogVisible = false
        } else {
          this.updateChildren(node.parent)
        }
      })
    },
    formFinish(formData) {
      if (this.$tools.isObject(formData.orgCategory)) {
        formData.orgCategory = formData.orgCategory.name
      }
      const isNotRoot = this.$tools.isEmpty(this.$store.getters.organization)
      if (isNotRoot) {
        saveItem(this.url, formData).then(obj => {
          if (!obj) return
          this.$store.dispatch('user/changeOrg', obj)
          this.$message({ showClose: true, type: 'success', message: '根单位添加成功' })
          this.formDialogVisible = false
        })
      } else {
        if (this.id) {
          formData.id = this.id
          updateItem(this.url, formData).then(res => {
            if (!res) return
            this.updateChildren(this.currNode.parent)
          })
        } else {
          formData.parentId = this.currOrg.id
          saveItem(this.url, formData).then(res => {
            if (!res) return
            console.log(res)

            if (res.id === this.$store.getters.organization.id) this.$store.dispatch('user/changeOrg', res)
            this.updateChildren(this.currNode)
          })
        }
      }
    },
    async deleteOrg(data, node, store) {
      const isOk = await this.$confirm('删除该单位将删除所有下级单位及单位下的所有人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => false)
      if (!isOk) return
      deleteItem(this.url, data.id).then(res => {
        if (!node.data.parentId) {
          this.$store.dispatch('user/changeOrg', null)
        } else {
          this.updateChildren(node.parent)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    async stopOrg(data, node, store, deactivated) {
      const isOk = await this.$confirm(`确定要${deactivated ? '启' : '停'}用吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => false)
      if (!isOk) return
      stopOrg(data.id, !deactivated).then(res => {
        this.deactivated = deactivated
        this.updateChildren(node.parent)
      }).catch(res => {
        console.log(res)
      })
    }
  }
}
</script>
