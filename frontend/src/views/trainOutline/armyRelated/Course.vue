
<template>
  <div class="property">
    <formAndTable ref="formAndTable" url="standard/course" :default-where="defaultWhere" :schema="schema" :columns="columns" @dialogIsClose="dialogIsClose" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'
import {
  OrgType,
  TrainRequirement,
  ScoreCriteria2,
  OrgSequences,
  PersonProperty,
  // OrgSequenceMap,
  CourseCategory
} from '@/const/index'
const ScoreCriteriaOptions = Object.values(ScoreCriteria2).map(
  item => item.name
)
const OrgSequenceOptions = Object.values(OrgSequences).map(item => item.name)
// private String id;
//   private String name;    // 课目名称
//   private int seq;     // 课目序号
//   private int category;   // 课目分类，参考CourseCategory
//   private String standardId;  // 大纲标准ID
//   private String sectionId;   // 大纲分册ID
//   private Boolean isManual;     // 子课目是否自定义
//   private String require;     // 训练要求, 必训/选训/自训
//   private String scoreCriteria; // 评分标准, 二级制/四机制/七级制/百分制
//   private List<String> placeTypes;        // 训练场地要求, 参考PlaceType表

//   // 军事课目特有字段
//   private String trainStepName; // 训练步骤, 参考TrainStep表, trainStep返回完整的TrainStep对象
//   private List<Integer> trainUnits; // 训练单元(编制序列), 单兵/班/排/中队/大队.
//   private String orgType;       // 课目适用的单位类型

//   private List<String> orgCategories;   // 课目适用的单位分类列表
//   private List<String> personProperties;  // 课目适用的人员属性列表
//   private List<String> tasks;             // 课目对应任务(可多选)
//   private List<String> serviceReqs;       // 勤务类型要求(可多选)
//   private List<String> majorReqs;         // 专业类型要求(可多选)
//   private List<String> rankReqs;          // 军衔要求(可多选)
//   private List<String> ordnanceTypes;     // 配套军械类型, 参考OrdnanceType表
//   private String gunnerType;              // 要求枪手类型

// 军事课目和体育课目特有字段
// private String textCondition;           // 课目条件
// private String textStandard;            // 课目标准
// private String textEvaluation;          // 考核要求
export default {
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        { prop: 'section', label: '分册', width: '200', handleValue: value => value && value.name, style: { color: '#67C23A' }, filterConfig: true },
        { prop: 'name', label: '课目名称', handleValue: (value, row) => `${row.seq}、${row.name}`, style: { color: '#F56C6C' }, filterConfig: value => ({ '$regex': value }) },
        // {prop: 'seq', label: '序号'},
        // { prop: "orgType", label: "单位类型" },
        { prop: 'orgCategories', label: '单位分类', width: '200', handleValue: value => value && value.join('、'), filterConfig: value => ({ '$regex': value }) },
        { prop: 'personProperties', label: '人员属性', handleValue: value => value && value.join('、'), filterConfig: true },
        { prop: 'require', label: '训练要求', filterConfig: true },
        { prop: 'majorReqs', label: '专业类型', handleValue: value => value.join('、') },
        { prop: 'tasks', label: '对应任务', handleValue: value => value.join('、') },
        { prop: 'serviceReqs', label: '勤务类型', handleValue: value => value.join('、') },
        // { prop: 'scoreCriteria', label: '评分标准' },
        { prop: 'trainStepName', label: '训练步骤', filterConfig: true },
        // { prop: 'trainUnits', label: '训练单元', handleValue: value => value && value.map(key => OrgSequenceMap[key]).join('、') },

        { prop: 'subcourses', label: '子课目', width: '100', style: { color: '#F56C6C', cursor: 'pointer' }, handleValue: value => {
          // return value.length && value.map(item => {
          //   const { seq, name, require, subcourses } = item
          //   let str = `${seq}.${name}(${require})`
          //   if (subcourses.length) {
          //     str = str + '：' + subcourses.map(subItem => {
          //       // eslint-disable-next-line no-unused-vars
          //       const { seq, name, require, subcourses } = item
          //       return `${seq}.${name}(${require})`
          //     }).join('+')
          //   }
          //   return str
          // }).join('；') || '点击添加'
          return '点击编辑'
        }, click: ({ column }) => {
          // this.$refs.formAndTable.dialogVisible = true
          this._isSubCourse = true
          this.schema.forEach(item => {
            item.hidden = item.vModel !== column.property
          })
        } },
        { prop: 'testContents', label: '考核内容', width: '100', handleValue: value => {
          // return (value && value.map(item => {
          //   const { testReq, name } = item
          //   return `${name}(${testReq})`
          // }).join('；')) || '点击添加'
          return '点击编辑'
        }, click: ({ column }) => {
          // this.$refs.formAndTable.dialogVisible = true
          this._isSubCourse = false
          this.schema.forEach(item => {
            item.hidden = item.vModel !== column.property
          })
        },
        style: { color: '#F56C6C', cursor: 'pointer' }
        }
        // {prop: 'serviceReq', label: '勤务类型'},
        // {prop: 'rankL2Reqs', label: '军衔要求'},
        // {prop: 'ordnanceTypes', label: '军械类型'},
        // {
        //   prop: "placeTypes",
        //   label: "场地要求",
        //   handleValue: value => value && value.join("、")
        // }
        // {prop: 'gunnerType', label: '枪手类型'},
        /*
                    textCondition: '',                          // 课目条件
                    textStandard: '',                           // 课目标准
                    textEvaluation: '',                         // 考核要求*/
      ],
      schema: [
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', color: '#F56C6C', content: '基本课目信息' },
        { fieldType: 'select', placeholder: '大纲分册', label: '大纲分册', vModel: 'sectionId', optValue: 'id', sectionId: '', options: [], required: true, filterable: true, onChange: (obj, value) => {
          this._sectionId = value
        } },
        { fieldType: 'input', placeholder: '课目名称', label: '课目名称', vModel: 'name', name: '', required: true },
        { fieldType: 'input-number', placeholder: '课目序号', label: '课目序号', vModel: 'seq', seq: 1, required: true },
        { fieldType: 'select', placeholder: '训练要求', label: '训练要求', vModel: 'require', require: '必训', options: Object.values(TrainRequirement), required: true },
        { fieldType: 'select', placeholder: '评分标准', label: '评分标准', vModel: 'scoreCriteria', scoreCriteria: '四级制', options: ScoreCriteriaOptions, required: true },
        { fieldType: 'select', width: '100%', placeholder: '场地要求', filterable: true, label: '场地要求', vModel: 'placeTypes', multiple: true, placeTypes: [], options: [] },
        { fieldType: 'divider1', width: '100%', contentPosition: 'center', color: '#409EFF', content: '军事相关信息' },
        { fieldType: 'select', placeholder: '训练步骤', label: '训练步骤', vModel: 'trainStepName', trainStepName: '', options: [], required: true },
        { fieldType: 'select', placeholder: '训练单元', label: '训练单元', vModel: 'trainUnits', multiple: true, trainUnits: [], options: OrgSequenceOptions, optValue: 'index', required: true },
        { fieldType: 'select', placeholder: '单位类型', label: '单位类型', vModel: 'orgType', orgType: '', options: OrgType, required: true },
        { fieldType: 'select', width: '66%', placeholder: '单位分类', label: '单位分类', vModel: 'orgCategories', orgCategories: [], multiple: true, options: [], required: true },
        { fieldType: 'select', placeholder: '人员属性', label: '人员属性', vModel: 'personProperties', personProperties: [], multiple: true, options: PersonProperty, required: true },
        { fieldType: 'select', placeholder: '对应任务（无数据，不可选）', label: '对应任务', vModel: 'tasks', tasks: [], multiple: true, options: [], disabled: false },
        { fieldType: 'select', placeholder: '对应勤务（无数据，不可选）', label: '对应勤务', vModel: 'serviceReqs', serviceReqs: [], multiple: true, options: [], disabled: false },
        { fieldType: 'select', placeholder: '对应专业（无数据，不可选）', label: '对应专业', vModel: 'majorReqs', multiple: true, majorReqs: [], options: [], disabled: false },
        { fieldType: 'select', placeholder: '军衔要求', label: '军衔要求', vModel: 'rankReqs', multiple: true, rankReqs: [], options: [] },
        { fieldType: 'select', placeholder: '军械类型', label: '军械类型', vModel: 'ordnanceTypes', multiple: true, ordnanceTypes: [], options: [] },
        { fieldType: 'select', placeholder: '枪手类型', label: '枪手类型', vModel: 'gunnerType', gunnerType: '', options: [] },

        { fieldType: 'divider1', width: '100%', contentPosition: 'center', content: '其他信息', color: '#E6A23C' },
        { fieldType: 'input', width: '100%', placeholder: '课目条件', label: '课目条件', vModel: 'textCondition', textCondition: '' },
        { fieldType: 'input', width: '100%', placeholder: '课目标准', label: '课目标准', vModel: 'textStandard', textStandard: '' },
        { fieldType: 'input', width: '100%', placeholder: '考核要求', label: '考核要求', vModel: 'textEvaluation', textEvaluation: '' },
        { fieldType: 'select', placeholder: '考核内容', label: '考核内容', width: '100%', vModel: 'testContents', hidden: true, multiple: true, testContents: [], onChange: this.handleContents, filterable: true, allowCreate: true, noDataText: "输入可按回车结束，默认为'必考'，可输入格式：课目名称-选考；" },
        { fieldType: 'select', placeholder: '子课目', label: '子课目', width: '100%', vModel: 'subcourses', hidden: true, multiple: true, subcourses: [], onChange: this.handleCourse, filterable: true, allowCreate: true, noDataText: "输入可按回车结束，默认为'必训'，可输入格式：课目名称-选训；" }
      ],
      defaultWhere: { courseCategory: CourseCategory.Train }
    }
  },
  computed: {
    schemaObj() {
      return this.schema.reduce((prev, curr) => {
        prev[`${curr.vModel}Schema`] = curr
        return prev
      }, {})
    }
  },
  watch: {
    'schemaObj.standardIdSchema.standardId': {
      async handler(newVal) {
        if (!newVal) return (this.schemaObj.sectionIdSchema.options = [])
        this.schemaObj.sectionIdSchema.options = await queryList('standard/trainsection', {
          where: {
            'standardId': newVal
          }
        })
      }
      // immediate: true
    },
    'schemaObj.subcoursesSchema.subcourses': {
      handler(newVal) {
        if (JSON.stringify(newVal) === this._newVal || !newVal) return
        this._newVal = JSON.stringify(newVal)
        this.schema.splice(this._schemaLength + 1, this.schema.length - this._schemaLength)
        // this.schema.length = this._schemaLength;
        newVal.forEach((item, index) => {
          const name = item.slice(2, -3)
          this.$set(this.schema, this.schema.length, {
            fieldType: 'select',
            width: '100%',
            placeholder: '该课目下的二级子课目',
            label: name,
            vModel: 'subcourses_' + index,
            ['subcourses_' + index]: [],
            allowCreate: true,
            hidden: !this._isSubCourse,
            multiple: true,
            filterable: true,
            onChange: this.handleCourse,
            noDataText: "输入可按回车结束，默认为'必训'，可输入格式：课目名称-选训；"
          })
        })
      }
    },
    'schemaObj.sectionIdSchema.sectionId': {
      handler(newValue) {
        if (!newValue) {
          this.schemaObj.orgTypeSchema.orgType = ''
          this.schemaObj.orgCategoriesSchema.orgCategories = []
          this.schemaObj.orgCategoriesSchema.options = []
          this.schemaObj.personPropertiesSchema.personProperties = []
          this.schemaObj.personPropertiesSchema.options = []
        } else {
          const selected = this.schemaObj.sectionIdSchema.options.find(
            item => item.id === newValue
          ) || this._editSection
          this.schemaObj.orgTypeSchema.options = selected.orgTypes
          this.schemaObj.orgTypeSchema.orgType = selected.orgTypes[0]
          //   selected.orgTypes.length === 1 &&
          //     (this.schemaObj.orgTypeSchema.orgType = selected.orgTypes[0]);
          this.schemaObj.orgCategoriesSchema.options = selected.orgCategories
          this.schemaObj.orgCategoriesSchema.orgCategories = [...selected.orgCategories]
          //   selected.orgCategories.length === 1 &&
          //     (this.schemaObj.orgCategoriesSchema.orgCategories = this.$units._cloneDeep(
          //       selected.orgCategories
          //     ));
          this.schemaObj.personPropertiesSchema.options = selected.personProperties
          this.schemaObj.personPropertiesSchema.personProperties = [...selected.personProperties]
          //   selected.personProperties.length === 1 &&
          //     (this.schemaObj.personPropertiesSchema.personProperties = this.$units._cloneDeep(
          //       selected.personProperties
          //     ));
        }
        // this._editTimeArr = [];
      }
      // isDeep: true
    },
    'schemaObj.orgCategoriesSchema.orgCategories': {
      async handler(newValue) {
        if (newValue.length) {
          const arr = await queryList('dictionary/orgcategory', {
            where: { name: { $in: newValue }}
          })
          arr.forEach(item => {
            const majorArr = [
              ...this.schemaObj.majorReqsSchema.options,
              ...item.optionalMajors
            ]
            this.schemaObj.majorReqsSchema.options = this.$tools.uniq(majorArr)
            this.schemaObj.majorReqsSchema.disabled = !this.schemaObj.majorReqsSchema.options.length
            const tasksArr = [
              ...this.schemaObj.tasksSchema.options,
              ...item.optionalTasks.map(item => item.name)
            ]
            this.schemaObj.tasksSchema.options = this.$tools.uniq(tasksArr)
            this.schemaObj.tasksSchema.disabled = !this.schemaObj.tasksSchema.options.length
            const serviceReqArr = [
              ...this.schemaObj.serviceReqsSchema.options,
              ...item.optionalServices
            ]
            this.schemaObj.serviceReqsSchema.options = this.$tools.uniq(serviceReqArr)
            this.schemaObj.serviceReqsSchema.disabled = !this.schemaObj.serviceReqsSchema.options.length
          })
        } else {
          this.schemaObj.tasksSchema.disabled = false
          this.schemaObj.majorReqsSchema.disabled = false
          this.schemaObj.serviceReqsSchema.disabled = false
        }
      }
      // isDeep: true
    }
  },
  created() {
    this._schemaLength = this.schema.length
    setTimeout(async() => {
      // console.log(this.schemaObj);

      // const standardPoint = this.$backendService.getParseObject('TrainStandard',this.$parent.standard.objectId);
      // this._sectionOptions = (await this.$units.queryItemByKeyValue('TrainSection','standard',standardPoint)).list;
      // this.schemaObj.sectionIdSchema.options = this._sectionOptions.map(item=>item.name);
      // console.log(this.schemaObj.standardIdSchema.standard)

      this.schemaObj.trainStepNameSchema.options = await queryList('dictionary/trainstep')
      this.schemaObj.rankReqsSchema.options = await queryList('dictionary/militaryrank')
      this.schemaObj.ordnanceTypesSchema.options = await queryList('dictionary/ordnancetype')
      this.schemaObj.placeTypesSchema.options = await queryList('dictionary/placetype')
      this.schemaObj.gunnerTypeSchema.options = await queryList('dictionary/gunnertype')
      this.$EventBus.$emit('finished')
    }, 500)
  },
  methods: {
    beforeSubmit(target) {
      // target.standard = this.$parent.standard.objectId;
      // target.sectionId = toPointer('TrainSection', target.sectionId)
      target.category = CourseCategory.Train
      target.isManual = false
      target.subcourses = target.subcourses.map((item, index) => {
        const [seq, name, require] = item.replace(/[.-]/g, ',').split(',')

        const subcourses = target['subcourses_' + index].map(subItem => {
          const [seq, name, require] = subItem.replace(/[.-]/g, ',').split(',')
          return { seq: parseInt(seq), name, require }
        })
        delete target['subcourses_' + index]
        return { seq: parseInt(seq), name, require, subcourses }
      })
      target.testContents = target.testContents.map(item => {
        const [name, testReq] = item.split('-')
        return { name, testReq }
      })
    },
    beforeEdit(target) {
      // this._editSection = { ...target.sectionId }
      // target.sectionId = target.sectionId.objectId
      this._subcourses = [...target.subcourses]
      target.subcourses = target.subcourses.map(item => {
        // eslint-disable-next-line no-unused-vars
        const { seq, name, require, subcourses } = item
        return `${seq}.${name}-${require}`
      })
      if (target.testContents) {
        if (this.$tools.isArray(target.testContents)) {
          target.testContents = target.testContents.map(item => {
            const { name, testReq } = item
            return `${name}-${testReq}`
          })
        }
      } else {
        target.testContents = []
      }
    },
    afterEdit(row) {
      setTimeout(() => {
        this._subcourses.forEach((item, index) => {
          this.schema[this._schemaLength + index + 1][`subcourses_${index}`] = item.subcourses.map(item => {
            // eslint-disable-next-line no-unused-vars
            const { seq, name, require, subcourses } = item
            return `${seq}.${name}-${require}`
          })
        })
      }, 100)
    },
    handleCourse(obj, value) {
      obj[obj.vModel] = value.map((item, index) => {
        let str
        str = item.indexOf('.') === 1 ? item.slice(2) : item
        str = item.length - item.indexOf('-') === 3 ? str : str + '-必训'
        return `${index + 1}.${str}`
      })
    },
    handleContents(obj, value) {
      obj[obj.vModel] = value.map((item, index) => (item.length - item.indexOf('-') === 3) ? item : item + '-必考')
      // console.log(obj[obj.vModel])
    },
    dialogIsCloseAfter() {
      this._isSubCourse = false
      const found = this.schema.find(item => item.vModel === 'sectionId')
      found[found.vModel] = this._sectionId
    }
  }
}
</script>
