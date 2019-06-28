<template>
  <div class="trainer-root">
    <formAndTableAndTree :schema="schema" :default-where="defaultWhere" :no-handle="noHandle" :columns="columns" url="resource/trainer" @current-change="handleNodeClick" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTableAndTree from '@/components/formAndTable/indexAndTree'
import { queryLowerOrgs, queryList } from '@/api/baseApi'
// import comRender from '@/pages/common/com-render'
// import tools from '@/utils/tools'
// class Trainer {
//   private String id;
//   private String soldierId;               // 关联人员, 查询返回soldier对象(必填)
//   private String organizationId;          // 关联单位, 查询返回organization对象(必填)
//   private String level;                   // 教练员等级(必填)
//   private Long startedAt;                 // 提升为教练员的日期(必填)
//   private List<String> availableCourseIds;  // 主教课目列表, 查询返回availableCourses对象列表
//   private List<String> assistCourseIds;     // 备教课目列表, 查询返回assistCourses对象列表

//   private Long createdTime;
//   private Long updatedTime;
// }
export default {
  name: 'OrgProperty',
  components: {
    formAndTableAndTree
  },
  data() {
    return {
      columns: [
        { prop: 'organization', label: '单位名称', handleValue: org => org.displayName, width: '150px' },
        { prop: 'soldier', label: '姓名', handleValue: soldier => soldier.name, width: '80px' },
        { prop: 'position', label: '职务', handleValue: position => position.name, width: '80px' },
        { prop: 'rank', label: '军衔', handleValue: rank => rank.name, width: '80px' },
        { prop: 'level', label: '教练员等级', width: '100px' },
        { prop: 'availableCourses', label: '主教课目', handleValue: value => value.map(item => item.name).join('、') },
        { prop: 'assistCourses', label: '备教课目', handleValue: value => value.map(item => item.name).join('、') },
        { prop: 'startedAt', label: '教龄', handleValue: this.$tools.distanceToday('year'), width: '50px' }
      ],
      schema: [
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', color: '#F56C6C', content: `提示：只能添加账号绑定单位（本级）教练员，当前单位：${this.$store.getters.organization.name}` },
        // { fieldType: 'input', placeholder: '当前单位', label: '当前单位', vModel: 'organizationId', organizationId: this.$store.getters.organization.displayName, required: true },
        { fieldType: 'select', placeholder: '选择人员', label: '选择人员', vModel: 'soldierId', optValue: 'id', options: [], required: true },
        { fieldType: 'select', placeholder: '教练员等级', label: '教练员等级', vModel: 'level', options: [], required: true },
        { fieldType: 'date-picker', valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日', placeholder: '升为教练员日期', label: '上任日期', vModel: 'startedAt', required: true, startedAt: new Date(2010, 1, 1).getTime() },
        { fieldType: 'transfer', vModel: 'availableCourseIds', availableCourseIds: [], width: '50%', data: [], titles: ['主教课目', '已选'], props: { key: 'id', label: 'name' }, onChange: (obj, value) => {
          this.findModel('assistCourseIds').data = this._courseArr.filter(item => !value.includes(item.id))
        } },
        { fieldType: 'transfer', vModel: 'assistCourseIds', assistCourseIds: [], width: '50%', data: [], titles: ['备教课目', '已选'], props: { key: 'id', label: 'name' }, onChange: (obj, value) => {
          this.findModel('availableCourseIds').data = this._courseArr.filter(item => !value.includes(item.id))
        } }
      ],
      noHandle: row => row.organizationId !== this.$store.getters.organization.id,
      defaultWhere: {}
    }
  },
  created() {
    // eslint-disable-next-line no-unused-vars
    const { orgCategory, orgSequence, id } = this.$store.getters.organization
    if (orgSequence < 6) {
      queryList('standard/course', { where: { 'orgCategories': orgCategory + '首长机关' }}).then(res => {
        this._courseArr = [...res]
        this.findModel('availableCourseIds').data = res
        this.findModel('assistCourseIds').data = res
      })
    } else {
      queryLowerOrgs(id, { 'orgCategory': { $ne: orgCategory }}).then(res => {

      })
    }
    Promise.all([
      queryList('resource/soldier', { where: {
        inserviceStatus: 0,
        'rank.rankLevel1': { $in: ['军官', '士官'] },
        'organization.orgSequence': orgSequence
      }}),
      queryList('dictionary/trainerlevel')
    ]).then(([soldiers, trainerlevels]) => {
      this.findModel('soldierId').options = soldiers.map(item => {
        item.name = `${item.name}（${item.position.name}）`
        return item
      })
      this.findModel('level').options = trainerlevels
    })
    console.log(process.env.VUE_APP_BASE_API)
  },
  methods: {
    findModel(vModel) {
      return this.schema.find(item => item.vModel === vModel)
    },
    handleNodeClick(data, node) {
      const obj = { 'organization.parentIds': data.id }
      this.defaultWhere = { ...this.defaultWhere, ...obj }
      // this.$refs.formAndTable.baseComponent.fetchTableList()
      // console.log(node)
    },
    beforeSubmit(formData) {
      formData.organizationId = this.$store.getters.organization.id
    },
    beforeEdit(target) {
      // target.optionalMajors = target.optionalMajors.toString()
    },
    dialogVisible(count = 0) {
      // const obj = this.schema.find(item => item.vModel === 'order')
      // obj.order = count + 1
    }
  }
}
</script>
<style scoped>

</style>

