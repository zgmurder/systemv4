<template>
  <div class="soldier">

    <formAndTableAndTree ref="formAndTable" :default-where="defaultWhere" url="resource/soldier" :schema="schema" :columns="columns" :no-handler="!!$route.meta.defaultWhere.inserviceStatus" @current-change="handleNodeClick" @dialogIsClose="dialogIsClose">
      <!-- <el-dropdown slot="moreHandle" style="margin-left:10px" trigger="click" @command="moreIsClick(props.row,$event)">
        <span class="el-dropdown-link" @click.stop="transferVisible = false">
          <el-button size="mini" type="text">更多</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="retireSoldier">退役</el-dropdown-item>
          <el-dropdown-item command="tmpRemoveSoldier">暂离深造</el-dropdown-item>
          <el-dropdown-item command="deleteSoldier">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-button slot="moreHandle" slot-scope="{data}" type="text" size="mini" style="color:#67C23A" icon="el-icon-share" @click.stop="handleMore($event,data)">更多 </el-button>
    </formAndTableAndTree>
    <ul v-show="menuVisible" ref="myElPopper" class="el-dropdown-menu el-popper el-dropdown-menu--medium" style="position:fixed;left:initial;    overflow: hidden">
      <li class="el-dropdown-menu__item" @click.stop="changeSoldier(1)">退役</li>
      <li class="el-dropdown-menu__item" @click.stop="changeSoldier(3)">暂离深造</li>
      <li class="el-dropdown-menu__item" @click.stop="changeSoldier(2)">调离</li>
    </ul>
  </div>
</template>

<script>
import formAndTableAndTree from '@/components/formAndTable/indexAndTree'
import { queryList, queryLowerOrgs, saveItem } from '@/api/baseApi'
import { Gender, PoliticalStatus, SoldierCategories, TroopCategory, OrgSequenceMap, AgeSection, TeachAgeSection } from '@/const/index'

// private String id;
//   private String name;                      // 人员姓名(必填)
//   private String cardId;                    // 保障卡号或身份证号(必填)
//   private String gender;                    // 性别(必填)
//   private Long birthday;                    // 出生日期(必填)
//   private String politicalStatus;           // 政治面貌(党员/团员/群众)(必填)
//   private Double height;                    // 当前身高(厘米)(必填)
//   private Double weight;                    // 当前体重(公斤)(必填)
//   private String headUrl;                   // 头像图片HTTP路径(选填)(先上传到图片服务器，然后记录图片路径)
//   private AdvancedPersonInfo advanced;      // 用户可选相关信息

//   private String organizationId;            // 当前所在单位ID; 只读显示时，返回Organization对象
//   private Long joinedAt;                    // 加入单位日期，添加时自动设置
//   private Long leftAt;                      // 离开单位日期，退伍或调离时自动填入 (无需用户输入)

//   // 以下是军人基本资料
//   private int inserviceStatus;              // 服役状态，(默认0) 0: 服役中 1: 已退役 2: 已调离 3: 暂离深造 (由调动时触发，自动设置)
//   private Long enlistedAt;                  // 入伍日期(必填)
//   private Long dischargedAt;                // 退伍日期，退伍时自动填入 (无需用户输入)
//   private String positionId;                // 职务ID（必填）; 从Position表获取可选列表
//   private String position;                  // 职务名称, 只读显示用
//   private String rankId;                    // 军衔等级ID(必填)，可选项从军衔等级表MilitaryRank获取可选列表
//   private String rankId;                      // 职务名称, 只读显示用

//   private String soldierCategory;           // 人员类别(必填)，区分指挥警官/技术警官/文职人员/士官/义务兵
//   private Boolean isSupporter;              // 保障人员标志(必填)
//   private String personProperty;            // 人员属性(自动生成), 区分分队\警官\保障人员\预备队员\新兵\新训干部骨干
//   private Boolean isCivilServant;           // 是否为文职人员(自动生成)
//   private Boolean isSpecialForce;           // 是否为特战队员，所属单位属性为特战时为true, 其它为false (自动生成)
//   private String specialForceType;          // 作战队员或者预备队员，对特战分队有效，所属单位为特战属性时，由用户选择。(选填)

//   private String gunnerType;                // 枪手类型(选填)
//   private List<String> majorType;           // 专业类型(选填)，可选项根据单位分类获取可选专业
//   private String physicalLevel;             // 体能训练等级分类，区分一类人员/二类人员/三类人员/新兵(自动设置)
//   private String troopCategory;             // 军兵种(地面人员/空勤人员/船艇人员)(自动设置)

//   private Long createdTime;
//   private Long updatedTime;
// CourseCategory, TroopCategory,
export default {
  name: 'Soldier',
  components: {
    formAndTableAndTree
  },
  data(vm) {
    return {
      columns: [
        { prop: 'name', label: '姓名', width: '80px', filterConfig: value => ({ '$regex': value }) },
        { prop: 'cardId', label: '证号', width: '120px', filterConfig: value => ({ '$regex': value }) },
        { prop: 'gender', label: '性别', width: '50px', filterConfig: value => value },
        { prop: 'organization', label: '所属单位', handleValue: org => org.displayName },
        { prop: 'birthday', label: '年龄', width: '50px', handleValue: this.$tools.distanceToday('year'), filterConfig: { fieldType: 'select', placeholder: '年龄段', label: '年龄段', vModel: 'birthday', options: AgeSection, birthday: '', filterConfig: value => {
          const now = new Date()
          if (value === '40岁以上') {
            const $lte = new Date(now.getFullYear() - 40, now.getMonth(), now.getDate()).getTime()
            return { $lte }
          }
          const arr = value.split('~').map(value => parseInt(value))
          const $gte = new Date(now.getFullYear() - arr[1] - 1, now.getMonth(), now.getDate() + 1).getTime()
          const $lte = new Date(now.getFullYear() - arr[0], now.getMonth(), now.getDate()).getTime()
          return { $gte, $lte }
        } }},
        { prop: 'politicalStatus', label: '政治面貌', width: '80px', filterConfig: value => value },
        // { prop: 'height', label: '身高(cm)' },
        // { prop: 'weight', label: '体重(kg)' },

        { prop: 'positionId', label: '职务', width: '80px', handleValue: (value, row) => row.position.name, filterConfig: value => value },
        { prop: 'soldierCategory', label: '人员类别', width: '80px' },
        { prop: 'rankId', label: '军衔等级', width: '80px', handleValue: (value, row) => row.rank.name, filterConfig: value => value },
        { prop: 'enlistedAt', label: '兵龄', width: '50px', handleValue: this.$tools.distanceToday('year'), filterConfig: { fieldType: 'select', placeholder: '兵龄段', label: '兵龄段', vModel: 'enlistedAt', options: TeachAgeSection, enlistedAt: '', filterConfig: value => {
          const now = new Date()
          if (value === '10年以上') {
            const $lte = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()).getTime()
            return { $lte }
          }
          const arr = value.split('~').map(value => parseInt(value))
          const $gte = new Date(now.getFullYear() - arr[1] - 1, now.getMonth(), now.getDate() + 1).getTime()
          const $lte = new Date(now.getFullYear() - arr[0], now.getMonth(), now.getDate()).getTime()
          return { $gte, $lte }
        } }}
        // { prop: 'positionAt', label: '上任日期', handleValue: this.$tools.distanceToday('year') }
      ],
      schema: [
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', color: '#F56C6C', content: '基本信息' },
        { fieldType: 'input', placeholder: '人员姓名', label: '人员姓名', vModel: 'name', required: true, name: '小王',
          onInput: (value, item) => {
            if (!value) { item.error = '' }
            if (value.length < 2 || value.length > 4) { item.error = item.errorMassage }
          },
          validate: item => item[item.vModel].length > 1 && item[item.vModel].length < 5,
          errorMassage: '名字长度为2-4个'
        },
        { fieldType: 'input', placeholder: '个人证号', label: '个人证号', vModel: 'cardId', required: true, cardId: '1243244555443' },
        { fieldType: 'select', placeholder: '性别', label: '性别', vModel: 'gender', required: true, options: Object.values(Gender), gender: '男' },
        { fieldType: 'date-picker', placeholder: '出生日期', label: '出生日期', vModel: 'birthday', required: true, birthday: new Date(1992, 10, 18).getTime(), valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日' },
        { fieldType: 'select', placeholder: '政治面貌', label: '政治面貌', vModel: 'politicalStatus', required: true, options: PoliticalStatus, politicalStatus: '党员' },
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', content: '单位信息', color: '#409EFF' },
        { fieldType: 'cascader', props: { label: 'name', value: 'id' }, changeOnSelect: true, expandTrigger: 'hover', placeholder: '单位名称', label: '单位名称', vModel: 'organization', organization: [], required: true,
          onChange: (obj, value, found) => {
            this.editOrg = value.reduce((prev, curr) => {
              return prev.id === curr ? prev : prev.children.find(item => item.id === curr)
            }, obj.options[0])
            queryLowerOrgs(this.editOrg.id).then(children => {
              this.editOrg.children = children.map(item => {
                const arr = new Array(item.childCount)
                if (arr.length)item.children = arr
                return item
              })
            })
            // queryLowerOrgs
            this.schemaObj.majorTypeSchema.options = [...this.editOrg.orgMajors]
            const orgSequence = this.editOrg.orgSequence > 6 ? 6 : this.editOrg.orgSequence
            queryList('dictionary/position', { where: { orgSequence }}).then(list => {
              this.schemaObj.positionIdSchema.options = list
            })
          }, options: []
        }, //, fetchSuggestions: this.querySearch
        { fieldType: 'select', placeholder: '当前职务', label: '当前职务', vModel: 'positionId', optValue: 'id', required: true, options: [] },
        { fieldType: 'date-picker', valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日', placeholder: '上任日期', label: '上任日期', vModel: 'positionAt', required: true, positionAt: new Date(2017, 1, 1).getTime() },
        { fieldType: 'select', placeholder: '人员类别', label: '人员类别', vModel: 'soldierCategory', required: true, options: SoldierCategories,
          onChange: (obj, value) => {
            // this.schemaObj.rankSchema.options = []
            // this.schemaObj.rankSchema.rankId = ''
            // this.schemaObj.positionAtSchema.positionAt = null
            // this.schemaObj.positionAtSchema.required = false
            // this.schemaObj.positionAtSchema.disabled = true
            if (value.includes('警官')) {
              value = '军官'
              // this.schemaObj.positionAtSchema.required = true
              // this.schemaObj.positionAtSchema.disabled = false
              // this.schemaObj.positionAtSchema.positionAt = new Date(2011, 1, 1).getTime()
            } else if (value.includes('文职人员') || !value) {
              value = undefined
            }
            // if (value.includes('文职人员') || !value) {
            //   this.schemaObj.rankSchema.disabled = true
            //   this.schemaObj.rankSchema.required = false
            // } else {
            queryList('dictionary/militaryrank', { where: { rankLevel1: value }, option: { sort: { order: -1 }}}).then(list => {
              this.schemaObj.rankIdSchema.disabled = !list.length
              this.schemaObj.rankIdSchema.options = list
              this.schemaObj.rankIdSchema.required = true
            })
            // }
          }
        },
        { fieldType: 'select', placeholder: '军衔等级', label: '军衔等级', vModel: 'rankId', optValue: 'id', options: [], required: true },

        { fieldType: 'date-picker', valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日', placeholder: '入伍日期', label: '入伍日期', vModel: 'enlistedAt', required: true, enlistedAt: new Date(2010, 1, 1).getTime() },
        { fieldType: 'checkbox', placeholder: '其他选项', label: '保障人员', border: true, vModel: 'isSupporter', isSupporter: false, onChange: (obj, value) => {
          if (value) {
            queryList('dictionary/supportermajor').then(list => {
              this.schemaObj.majorTypeSchema.options = list
            })
          }
        } },
        { fieldType: 'select', placeholder: '专业类型', label: '专业类型', vModel: 'majorType', options: [] },
        { fieldType: 'select', placeholder: '枪手类型', label: '枪手类型', vModel: 'gunnerType', options: TroopCategory },

        { fieldType: 'divider1', width: '100%', contentPosition: 'center', needClick: true, content: '其他信息 ● 选填（点击显示/隐藏）', click: () => {
          const index = this.schema.findIndex(item => item.needClick)
          console.log(index)

          const arr = this.schema.slice(index + 1)
          arr.forEach(item => { item.hidden = !item.hidden })
        }, color: '#E6A23C' },
        { fieldType: 'input', placeholder: '联系电话', label: '联系电话', vModel: 'phoneNum', hidden: true },
        { fieldType: 'input', placeholder: '血型', label: '血型', vModel: 'bloodType', hidden: true },
        { fieldType: 'input', placeholder: '国籍', label: '国籍', vModel: 'nationality', hidden: true },
        { fieldType: 'input', placeholder: '籍贯', label: '籍贯', vModel: 'fromCity', hidden: true },
        { fieldType: 'input', placeholder: '户口所在地', label: '户口所在地', vModel: 'currentCity', hidden: true },
        { fieldType: 'input', placeholder: '最高学历', label: '最高学历', vModel: 'highestDegree', hidden: true },
        { fieldType: 'input', placeholder: '毕业院校', label: '毕业院校', vModel: 'graduatedSchool', hidden: true },
        { fieldType: 'input', placeholder: '所学专业', label: '所学专业', vModel: 'graduatedMajor', hidden: true },

        { fieldType: 'input', placeholder: '身高(cm)', label: '身高(cm)', vModel: 'height', height: 172, hidden: true },
        { fieldType: 'input', placeholder: '体重(kg)', label: '体重(kg)', vModel: 'weight', weight: 55, hidden: true }
      ],
      editOrg: {},
      menuVisible: false,
      formVisible: true,
      defaultWhere: { ...(this.$route.meta.defaultWhere || {}) }
    }
  },
  computed: {
    schemaObj() {
      return this.schema.reduce((prev, curr) => {
        prev[`${curr.vModel}Schema`] = curr
        return prev
      }, {})
    },
    comformVisible() {
      return this.formVisible || true
    }
  },
  watch: {
    // 'schemaObj.organizationSchema.organization': {
    //   handler(newValue) {
    //     if (newValue) {
    //       console.log(newValue)
    //       // queryList()
    //     }
    //   }
    //   // isDeep: true
    // }
  },
  created() {
    document.addEventListener('click', () => {
      this.menuVisible = false
      this.editScope = {}
    })
    const rootOrg = this.$tools.cloneDeep(this.$store.getters.organization)
    rootOrg.children = []
    this.schemaObj.organizationSchema.options = [rootOrg]
    // $EventBus
    Promise.all([
      queryList('dictionary/position').then(list => {
        this.schemaObj.positionIdSchema.options = list.map(item => {
          item.name = `${item.name}（${OrgSequenceMap[item.orgSequence] || item.orgCategory}）`
          return item
        })
      }),
      queryList('dictionary/militaryrank', { option: { sort: { order: -1 }}}).then(list => {
        this.schemaObj.rankIdSchema.options = list
      })
    ]).then(() => {
      this.$EventBus.$emit('finished')
    })
  },
  methods: {
    // async querySearch(queryString, cb) {
    //   let str
    //   const { orgSequence, displayName } = this.$store.getters.organization
    //   if (orgSequence < 2)str = queryString
    //   else {
    //     if (displayName.includes(queryString))str = displayName
    //     else str = displayName + queryString
    //   }
    //   const result = await queryList('resource/organization', {
    //     where: { displayName: { '$regex': str }, '$or': [{ 'orgType': '分队' }, { 'orgType': '部队' }] }
    //   })
    //   const arr = result
    //     .map(item => {
    //       const { name, id, orgSequence, orgMajors, orgType, displayName } = item
    //       let value = name
    //       if (orgType === '部门' || orgType === '首长机关')value = displayName.split(this.$store.getters.organization.name)[1]
    //       return { value, id, orgSequence, orgMajors, displayName }
    //     })
    //   cb(arr)
    // },
    handleNodeClick(data, node) {
      const obj = { 'organization.parentIds': data.id }
      this.defaultWhere = { ...this.defaultWhere, ...obj }
      // this.$refs.formAndTable.baseComponent.fetchTableList()
      // console.log(node)
    },
    beforeSubmit(target) {
      // target.organization = toPointer('Organization2', this.editOrg.id)
      // const foundP = this.schemaObj.positionSchema.options.find(item => item.name === target.position)
      // foundP && (target.positionId = foundP.id)
      // const foundR = this.schemaObj.rankSchema.options.find(item => item.name === target.rankId)
      // foundR && (target.rankId = foundR.id)

      target.organizationId = this.editOrg.id
      // target.cardId = target.cardId + ''
      delete target.organization
      // if (found) {
      //   target.isMaster = found.isMaster
      //   target.positionCode = found.sortCode
      // }
      // target.orgSequence = this.editOrg.orgSequence
      // target.orgDisplayName = this.editOrg.displayName
    },
    beforeEdit(target) {
      queryList('dictionary/position', { where: { orgSequence: target.organization.orgSequence }}).then(list => {
        this.schemaObj.positionIdSchema.options = list
      })
      this.editOrg = { ...target.organization }
      this.schemaObj.soldierCategorySchema.onChange(null, target.soldierCategory)
      target.organization = target.organization.displayName
      this.schemaObj.organizationSchema.fieldType = 'input'
      this.schemaObj.organizationSchema.disabled = true
      this.schemaObj.organizationSchema.organization = target.organization.displayName
    },
    dialogIsClose() {
      this.schemaObj.organizationSchema.fieldType = 'cascader'
      this.schemaObj.organizationSchema.disabled = false
    },
    changeSoldier(inserviceStatus) {
      if (inserviceStatus !== 3) {
        // eslint-disable-next-line no-unused-vars
        const { organization, ...data } = this.editScope.row
        data.inserviceStatus = inserviceStatus
        saveItem(`${this.url}/change/${data.id || data._id}`, { ...data })
        this.$refs.formAndTable.baseComponent.fetchTableList()
      }
    },
    handleMore(e, scope) {
      this.menuVisible = true
      this.editScope = scope
      this.$refs.myElPopper.style.left = 'initial'
      this.$refs.myElPopper.style.right = '10px'
      this.$refs.myElPopper.style.top = e.clientY + 20 + 'px'
    }
  }
}
</script>
