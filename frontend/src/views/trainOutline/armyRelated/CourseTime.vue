
<template>
  <div class="property">
    <formAndTable ref="formAndTable" :schema="schema" url="standard/coursetime" :columns="columns" @dialogIsClose="dialogIsClose" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import newComSubCourse from '@/pages/common/new-com-subCourse'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'
import { PersonProperty } from '@/const'
// class CourseTime {
//   private String id;
//   private List<String> courseIds;           // 训练课目ID列表
//   private String standardId;                // 大纲标准ID
//   private String sectionId;                 // 大纲分册ID
//   private List<String> orgCategories;       // 课目适用的单位分类列表
//   private List<String> personProperties;    // 课目适用的人员属性列表
//   private List<String> tasks;               // 对应任务列表
//   private List<String> serviceReqs;         // 勤务类型列表
//   private String major;                     // 专业类型
//   private int hoursInDay;                   // 昼训时间要求
//   private int hoursAtNight;                 // 夜训时间要求
// }
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
          style: { color: '#67C23A' },
          filterConfig: true
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
          handleValue: value => value.join('、'),
          filterConfig: value => ({ $regex: value })
        },
        {
          prop: 'personProperties',
          label: '人员属性',
          handleValue: value => value.join('、'),
          filterConfig: true
        },
        {
          prop: 'tasks',
          label: '对应任务',
          handleValue: value => value.join('、')
        },
        // { prop: "serviceReqs", label: "勤务类型" },
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
        { fieldType: 'select', placeholder: '大纲分册', label: '大纲分册', vModel: 'sectionId', optValue: 'id', width: '66%', sectionId: '', options: [], required: true, filterable: true, onChange: (obj, value) => (this._section = value) },
        { fieldType: 'select', width: '50%', placeholder: '相关课目', label: '相关课目', vModel: 'courseIds', courseIds: [], multiple: true, filterable: true, required: true, optValue: 'id', options: [] },
        // {fieldType: "input-number", placeholder: "课目序号", label: "课目序号", vModel: "seq", seq: 0},
        { fieldType: 'select', placeholder: '人员属性', label: '人员属性', width: '50%', required: true, vModel: 'personProperties', personProperties: [], multiple: true, options: PersonProperty },
        // {fieldType: "select", placeholder: "单位类型", label: "单位类型", vModel: "orgType", orgType: '',options:[],},
        { fieldType: 'select', width: '66%', placeholder: '单位分类', label: '单位分类', required: true, vModel: 'orgCategories', orgCategories: [], multiple: true, options: [] },
        { fieldType: 'select', placeholder: '对应任务（无数据，不可选）', label: '对应任务', vModel: 'tasks', multiple: true, tasks: [], options: [], disabled: false },
        { fieldType: 'select', placeholder: '专业类型（无数据，不可选）', label: '对应专业', vModel: 'major', major: '', options: [], disabled: false },
        { fieldType: 'select', placeholder: '对应勤务（无数据，不可选）', label: '对应勤务', vModel: 'serviceReqs', serviceReqs: [], multiple: true, options: [], disabled: false },
        { fieldType: 'input-number', required: true, placeholder: '昼训(小时)', label: '昼训(小时)', vModel: 'hoursInDay' },
        { fieldType: 'input-number', required: true, placeholder: '夜训(小时)', label: '夜训(小时)', vModel: 'hoursAtNight' }
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
    'schemaObj.standardIdSchema.standardId': {
      async handler(newVal) {
        if (!newVal) return (this.schemaObj.sectionIdSchema.options = [])
        this.schemaObj.sectionIdSchema.options = await queryList('standard/trainsection', {
          where: {
            'standardId': newVal
          }
        })
        !this._temConst && this.$EventBus.$emit('finished')
        this._temConst = true
      }
      // immediate: true
    },
    'schemaObj.sectionIdSchema.sectionId': {
      async handler(newValue) {
        if (!newValue) {
          this.schemaObj.personPropertiesSchema.personProperties = []
          this.schemaObj.personPropertiesSchema.options = []
          this.schemaObj.orgCategoriesSchema.orgCategories = []
          this.schemaObj.orgCategoriesSchema.options = []
          this.schemaObj.courseIdsSchema.options = []
          this.schemaObj.courseIdsSchema.courseIds = []
        } else {
          const section = this.schemaObj.sectionIdSchema.options.find(item => item.id === newValue) || this._editSection
          const isEdit = this.$refs.formAndTable.id
          !isEdit && (this.schemaObj.personPropertiesSchema.personProperties = [...section.personProperties])
          this.schemaObj.personPropertiesSchema.options = [...section.personProperties]
          !isEdit && (this.schemaObj.orgCategoriesSchema.orgCategories = [...section.orgCategories])
          this.schemaObj.orgCategoriesSchema.options = [...section.orgCategories]
          this.schemaObj.courseIdsSchema.options = await queryList('standard/course', {
            where: { sectionId: newValue }
          })
        }
      }
    },
    'schemaObj.courseIdsSchema.courseIds': {
      handler(newValue) {
        if (newValue && newValue.length && this.schemaObj.courseIdsSchema.options.length) {
          newValue.forEach(id => {
            const course = this.schemaObj.courseIdsSchema.options.find(item => item.id === id)
            this.schemaObj.tasksSchema.tasks = this.$tools.uniq([
              ...course.tasks,
              ...this.schemaObj.tasksSchema.tasks
            ])
            this.schemaObj.tasksSchema.options = this.$tools.uniq([
              ...course.tasks,
              ...this.schemaObj.tasksSchema.options
            ])
            this.schemaObj.serviceReqsSchema.serviceReqs = this.$tools.uniq([
              ...course.serviceReqs,
              ...this.schemaObj.serviceReqsSchema.serviceReqs
            ])
            this.schemaObj.serviceReqsSchema.options = this.$tools.uniq([
              ...course.serviceReqs,
              ...this.schemaObj.serviceReqsSchema.options
            ])
            this.schemaObj.majorSchema.major = course.major
          })
        }
      }
    }
  },
  methods: {
    // reBeforeSubmit(target) {
    //   target.sectionId = toPointer('TrainSection', target.sectionId)
    //   target.courses = target.courses.map(id => {
    //     return {
    //       id,
    //       className: 'Course',
    //       __type: 'Pointer'
    //     }
    //   })
    // },
    // reBeforeEdit(target) {
    //   this._editSection = { ...target.sectionId }
    //   target.sectionId = target.sectionId.id
    //   target.courses = target.courses.map(item => item.id)
    // }
  }
}
</script>
