
<template>
  <div class="property">
    <formAndTable ref="formAndTable" :schema="schema" :columns="columns" @dialogIsClose="dialogIsClose" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import newComSubCourse from '@/pages/common/new-com-subCourse'
import {
  OrgType,
  PersonProperty,
  TrainRequirement,
  ScoreCriteria2,
  OrgSequences,
  TestRequirement
} from '@/const/index'
import { queryList, toPointer } from '@/api/baseApi'
import standardMixin from '../../standardMixin'
const ScoreCriteriaOptions = Object.values(ScoreCriteria2).map(
  item => item.name
)
const OrgSequenceOptions = Object.values(OrgSequences).map(item => item.name)
// 课目时间表
// const CourseTimeSchema = new Schema({
//  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],    // 训练课目
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
//  section: { type: Schema.Types.ObjectId, ref: 'TrainSection' },    // 训练大纲
//  orgCategories: [String],                        // 课目适用的单位分类列表
//  personProperties: [String],                     // 课目适用的人员属性列表,一般是一个
//  serviceReq: String,                             // 勤务类型
//  tasks: [String],                                   // 训练任务(可选)
//  hoursInDay: Number,                             // 昼训时间要求
//  hoursAtNight: Number,                           // 夜训时间要求
// });
export default {
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        {
          prop: 'section',
          label: '大纲分册',
          handleValue: value => value.name,
          style: { color: '#67C23A' }
        },
        {
          prop: 'courses',
          label: '课目名称',
          style: { color: '#F56C6C' },
          handleValue: value => value && value.map(item => item.name).join('、')
        }, // handleValue:value=>value && value.map(item=>item.name).join('、')
        {
          prop: 'orgCategories',
          label: '单位分类',
          handleValue: value => value.join('、')
        },
        {
          prop: 'personProperties',
          label: '人员属性',
          handleValue: value => value.join('、')
        },
        {
          prop: 'tasks',
          label: '对应任务',
          handleValue: value => value.join('、')
        },
        // { prop: "serviceReq", label: "勤务类型" },
        {
          prop: 'hoursInDay',
          label: '昼训时间',
          handleValue: value => `${value}小时`
        },
        {
          prop: 'hoursAtNight',
          label: '夜训时间',
          handleValue: value => `${value}小时`
        }
      ],
      schema: [
        // {fieldType: "input",width:'50%', placeholder: "训练大纲", label: "训练大纲", vModel: "standard", standard: '',disabled:true},
        {
          fieldType: 'select',
          placeholder: '大纲分册',
          label: '大纲分册',
          vModel: 'section',
          optValue: 'objectId',
          width: '66%',
          section: '',
          options: [],
          required: true,
          filterable: true,
          onChange: (obj, value) => (this._section = value)
        },
        {
          fieldType: 'select',
          width: '50%',
          placeholder: '课目名称',
          label: '课目名称',
          vModel: 'courses',
          courses: [],
          multiple: true,
          filterable: true,
          required: true,
          optValue: 'objectId',
          options: []
        },
        // {fieldType: "input-number", placeholder: "课目序号", label: "课目序号", vModel: "seq", seq: 0},
        {
          fieldType: 'select',
          placeholder: '人员属性',
          label: '人员属性',
          width: '50%',
          required: true,
          vModel: 'personProperties',
          personProperties: [],
          multiple: true,
          options: []
        },
        // {fieldType: "select", placeholder: "单位类型", label: "单位类型", vModel: "orgType", orgType: '',options:[],},
        {
          fieldType: 'select',
          width: '66%',
          placeholder: '单位分类',
          label: '单位分类',
          required: true,
          vModel: 'orgCategories',
          orgCategories: [],
          multiple: true,
          options: []
        },
        {
          fieldType: 'select',
          placeholder: '对应任务（无数据，不可选）',
          label: '对应任务',
          vModel: 'tasks',
          multiple: true,
          tasks: [],
          options: [],
          disabled: false
        },
        {
          fieldType: 'select',
          placeholder: '专业类型（无数据，不可选）',
          label: '对应专业',
          vModel: 'majorReq',
          majorReq: '',
          options: [],
          disabled: false
        },
        {
          fieldType: 'select',
          placeholder: '对应勤务（无数据，不可选）',
          label: '对应勤务',
          vModel: 'serviceReq',
          serviceReq: [],
          multiple: true,
          options: [],
          disabled: false
        },
        {
          fieldType: 'input-number',
          placeholder: '昼训(小时)',
          label: '昼训时间',
          vModel: 'hoursInDay',
          hoursInDay: 0
        },
        {
          fieldType: 'input-number',
          placeholder: '夜训(小时)',
          label: '夜训时间',
          vModel: 'hoursAtNight',
          hoursAtNight: 0
        }
      ]
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
    'schemaObj.standardSchema.standard': {
      async handler(newVal) {
        if (!newVal) return (this.schemaObj.sectionSchema.options = [])
        this.schemaObj.sectionSchema.options = await queryList(
          'TrainSection',
          {
            standard: toPointer('TrainStandard', newVal)
          }
        )
      }
    },
    'schemaObj.sectionSchema.section': {
      async handler(newValue) {
        if (!newValue) {
          this.schemaObj.personPropertiesSchema.personProperties = []
          this.schemaObj.personPropertiesSchema.options = []
          this.schemaObj.orgCategoriesSchema.orgCategories = []
          this.schemaObj.orgCategoriesSchema.options = []
          this.schemaObj.coursesSchema.options = []
          this.schemaObj.coursesSchema.course = []
        } else {
          const section =
            this.schemaObj.sectionSchema.options.find(
              item => item.objectId === newValue
            ) || this._editSection
          const isEdit = this.$refs.formAndTable.objectId
          !isEdit && (this.schemaObj.personPropertiesSchema.personProperties = [
            ...section.personProperties
          ])
          this.schemaObj.personPropertiesSchema.options = [
            ...section.personProperties
          ]
          !isEdit && (this.schemaObj.orgCategoriesSchema.orgCategories = [
            ...section.orgCategories
          ])
          this.schemaObj.orgCategoriesSchema.options = [
            ...section.orgCategories
          ]

          this.schemaObj.coursesSchema.options = await queryList(
            'Course',
            {
              section: toPointer('TrainSection', newValue)
            }
          )
        }
      }
    },
    'schemaObj.coursesSchema.courses': {
      handler(newValue) {
        if (
          newValue &&
          newValue.length &&
          this.schemaObj.coursesSchema.options.length
        ) {
          newValue.forEach(objectId => {
            const course = this.schemaObj.coursesSchema.options.find(
              item => item.objectId === objectId
            )
            if (course) {
              this.schemaObj.tasksSchema.tasks = this.$tools.uniq([
                ...course.tasks,
                ...this.schemaObj.tasksSchema.tasks
              ])
              this.schemaObj.tasksSchema.options = this.$tools.uniq([
                ...course.tasks,
                ...this.schemaObj.tasksSchema.options
              ])
              this.schemaObj.serviceReqSchema.serviceReq = this.$tools.uniq([
                ...course.serviceReq,
                ...this.schemaObj.serviceReqSchema.serviceReq
              ])
              this.schemaObj.serviceReqSchema.options = this.$tools.uniq([
                ...course.serviceReq,
                ...this.schemaObj.serviceReqSchema.options
              ])
              this.schemaObj.majorReqSchema.majorReq = course.majorReq
            }
          })
        }
      }
    }
  },
  methods: {
    reBeforeSubmit(target) {
      target.section = toPointer('TrainSection', target.section)
      target.courses = target.courses.map(objectId => {
        return {
          objectId,
          className: 'Course',
          __type: 'Pointer'
        }
      })
    },
    reBeforeEdit(target) {
      this._editSection = { ...target.section }
      target.section = target.section.objectId
      target.courses = target.courses.map(item => item.objectId)
    }
  }
}
</script>
