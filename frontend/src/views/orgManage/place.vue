<template>
  <div class="trainer-root">
    <formAndTableAndTree :schema="schema" :default-where="defaultWhere" :no-handle="noHandle" :columns="columns" url="resource/trainplace" @current-change="handleNodeClick" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTableAndTree from '@/components/formAndTable/indexAndTree'
import { queryLowerOrgs, queryList } from '@/api/baseApi'
import { PlaceBuiltStatus } from '@/const'
// class TrainPlace {
//   private String id;
//   private String name;                // 场地名称(必填)
//   private String organizationId;      // 关联单位, 查询返回organization对象(必填)
//   private List<String> placeTypes;    // 场地类型列表(必填)
//   private Boolean indoor;             // 是否为室内场地
//   private Boolean internal;           // 是否为自建场地
//   private int builtStatus;            // 建设状态, 0:已建、1:在建、2:未建
//   private Long startedAt;             // 开建日期(选填)
//   private Long builtAt;               // 建成日期(选填)
//   private List<String> weathers;      // 适用天气
//   private String area;                // 场地规格
//   private int capacity;               // 人员容量
//   private String address;             // 场地地址
//   private List<String> photos;        // 场地图片路径

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
        { prop: 'name', label: '场地名称' },
        { prop: 'organization', label: '单位名称', handleValue: org => org.displayName, width: '150px' },
        { prop: 'weathers', label: '使用天气', handleValue: weathers => weathers.join('、') },
        { prop: 'indoor', label: '室内场地', handleValue: value => value ? '是' : '否' },
        { prop: 'internal', label: '自建场地', handleValue: value => value ? '是' : '否' },
        { prop: 'placeTypes', label: '场地类型', handleValue: weathers => weathers.join('、') },
        { prop: 'builtStatus', label: '建设状态', handleValue: builtStatus => PlaceBuiltStatus.Names[builtStatus] },
        { prop: 'startedAt', label: '开建日期', handleValue: startedAt => this.$tools.parseTime(startedAt) },
        { prop: 'builtAt', label: '建成日期', handleValue: builtAt => this.$tools.parseTime(builtAt) }

        // { prop: 'soldier', label: '姓名', handleValue: soldier => soldier.name, width: '80px' },
        // { prop: 'position', label: '职务', handleValue: position => position.name, width: '80px' },
        // { prop: 'rank', label: '军衔', handleValue: rank => rank.name, width: '80px' },
        // { prop: 'level', label: '教练员等级', width: '100px' },
        // { prop: 'availableCourses', label: '主教课目', handleValue: value => value.map(item => item.name).join('、') },
        // { prop: 'assistCourses', label: '备教课目', handleValue: value => value.map(item => item.name).join('、') },
        // { prop: 'startedAt', label: '教龄', handleValue: this.$tools.distanceToday('year'), width: '50px' }
      ],
      schema: [
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', color: '#F56C6C', content: `提示：只能添加账号绑定单位（本级）场地，当前单位：${this.$store.getters.organization.name}` },
        { fieldType: 'input', placeholder: '场地名称', label: '场地名称', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '使用天气', label: '使用天气', vModel: 'weathers', multiple: true, options: [], required: true },
        { fieldType: 'checkbox', border: true, label: '室内场地', vModel: 'indoor', indoor: false },
        { fieldType: 'checkbox', border: true, label: '自建场地', vModel: 'internal', internal: false },
        { fieldType: 'select', width: '66%', placeholder: '场地类型', label: '场地类型', multiple: true, vModel: 'placeTypes', placeTypes: [], options: [], required: true },
        { fieldType: 'radio-group', placeholder: '建设状态', label: '建设状态', options: PlaceBuiltStatus.Names, vModel: 'builtStatus', builtStatus: 0, optValue: 'index' },
        { fieldType: 'date-picker', valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日', placeholder: '开建日期', label: '开建日期', vModel: 'startedAt', startedAt: null },
        { fieldType: 'date-picker', valueFormat: 'timestamp', format: 'yyyy 年 MM 月 dd 日', placeholder: '建成日期', label: '建成日期', vModel: 'builtAt', builtAt: null, pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < this.findModel('startedAt').startedAt
          }
        }},
        { fieldType: 'input', placeholder: '例如：占地XX平方', label: '场地规格', vModel: 'area', area: '' },
        { fieldType: 'input-number', placeholder: '人员容量', label: '人员容量', vModel: 'capacity', capacity: 0 },
        { fieldType: 'input', placeholder: '场地地址', label: '场地地址', vModel: 'address', address: '' },
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', content: '场地图片', color: '#409EFF' },
        { fieldType: 'upload', width: '100%', headers: { Authorization: 'Bearer ' + this.$store.getters.token }, action: process.env['VUE_APP_BASE_API'] + 'file/smallfile', listType: 'picture-card' }
        // { fieldType: 'transfer', vModel: 'availableCourseIds', availableCourseIds: [], width: '50%', data: [], titles: ['主教课目', '已选'], props: { key: 'id', label: 'name' }, onChange: (obj, value) => {
        //   this.findModel('assistCourseIds').data = this._courseArr.filter(item => !value.includes(item.id))
        // } },
        // { fieldType: 'transfer', vModel: 'assistCourseIds', assistCourseIds: [], width: '50%', data: [], titles: ['备教课目', '已选'], props: { key: 'id', label: 'name' }, onChange: (obj, value) => {
        //   this.findModel('availableCourseIds').data = this._courseArr.filter(item => !value.includes(item.id))
        // } }
      ],
      noHandle: row => row.organizationId !== this.$store.getters.organization.id,
      defaultWhere: {}
    }
  },
  //   <el-upload
  //   action="https://jsonplaceholder.typicode.com/posts/"
  //   list-type="picture-card"
  //   :on-preview="handlePictureCardPreview"
  //   :on-remove="handleRemove">
  //   <i class="el-icon-plus"></i>
  // </el-upload>
  created() {
    console.log(process.env.VUE_APP_BASE_API)

    // eslint-disable-next-line no-unused-vars
    // const { orgCategory, orgSequence, id } = this.$store.getters.organization
    // if (orgSequence < 6) {
    //   queryList('standard/course', { where: { 'orgCategories': orgCategory + '首长机关' }}).then(res => {
    //     this._courseArr = [...res]
    //     this.findModel('availableCourseIds').data = res
    //     this.findModel('assistCourseIds').data = res
    //   })
    // } else {
    //   queryLowerOrgs(id, { 'orgCategory': { $ne: orgCategory }}).then(res => {

    //   })
    // }
    Promise.all([
      queryList('dictionary/weathertype'),
      queryList('dictionary/placetype')
    ]).then(([weathertypes, placetypes]) => {
      this.findModel('weathers').options = weathertypes
      this.findModel('placeTypes').options = placetypes
    })
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

