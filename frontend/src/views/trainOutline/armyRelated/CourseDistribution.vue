
<template>
  <div class="property">
    <formAndTable
      ref="formAndTable"
      url="standard/coursedistribution"
      :schema="schema"
      :columns="columns"
      @dialogIsClose="dialogIsClose"
    />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
// import newComSubCourse from '@/pages/common/new-com-subCourse'
import { PersonProperty } from '@/const'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'

// class CourseDistribution {
//   private String id;
//   private String courseId;                  // 军事课目ID
//   private String standardId;                // 大纲标准ID
//   private String sectionId;                 // 大纲分册ID
//   private List<String> orgCategories;       // 课目适用的单位分类列表
//   private List<String> personProperties;    // 课目适用的人员属性列表
//   private String serviceReq;                // 勤务类型(可选)
//   private String task;                      // 训练任务
//   private List<String> subjects;            // 训练课题列表
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
          prop: 'course',
          label: '课目名称',
          style: { color: '#F56C6C' },
          handleValue: course => (course || {}).name
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
          prop: 'task',
          label: '对应任务'
          // handleValue: value => value.join("、")
        },
        {
          prop: 'subjects',
          label: '训练课题',
          handleValue: value => value && value.join('、'),
          style: { color: '#67C23A' }
        }
      ],
      schema: [
        // {fieldType: "input",width:'50%', placeholder: "训练大纲", label: "训练大纲", vModel: "standard", standard: '',disabled:true},
        { fieldType: 'select', placeholder: '大纲分册', label: '大纲分册', vModel: 'sectionId', optValue: 'id', width: '66%', sectionId: '', options: [], required: true, filterable: true, onChange: (obj, value) => (this._section = value) },
        { fieldType: 'select', width: '50%', placeholder: '课目名称', label: '课目名称', vModel: 'courseId', filterable: true, required: true, optValue: 'id', options: [] },
        // {fieldType: "input-number", placeholder: "课目序号", label: "课目序号", vModel: "seq", seq: 0},
        { fieldType: 'select', placeholder: '人员属性', label: '人员属性', width: '50%', required: true, vModel: 'personProperties', personProperties: [], multiple: true, options: PersonProperty },
        // {fieldType: "select", placeholder: "单位类型", label: "单位类型", vModel: "orgType", orgType: '',options:[],},
        { fieldType: 'select', width: '66%', placeholder: '单位分类', label: '单位分类', required: true, vModel: 'orgCategories', orgCategories: [], multiple: true, options: [] },
        { fieldType: 'select', placeholder: '对应任务', label: '对应任务', vModel: 'task', required: true, task: '', options: [], disabled: false },
        { fieldType: 'select', placeholder: '训练课题', label: '训练课题', vModel: 'subjects', width: '66%', subjects: [], options: [], multiple: true, disabled: false },
        { fieldType: 'select', placeholder: '对应勤务', label: '对应勤务', vModel: 'serviceReq', serviceReq: '', options: [], disabled: false }
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
          where: { 'standardId': newVal }
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
          this.schemaObj.courseIdSchema.options = []
          this.schemaObj.courseIdSchema.courseId = ''
        } else {
          const section = this.schemaObj.sectionIdSchema.options.find(item => item.id === newValue)
          const isEdit = this.$refs.formAndTable.id
          !isEdit && (this.schemaObj.personPropertiesSchema.personProperties = [...section.personProperties])
          this.schemaObj.personPropertiesSchema.options = [...section.personProperties]
          !isEdit && (this.schemaObj.orgCategoriesSchema.orgCategories = [...section.orgCategories])
          this.schemaObj.orgCategoriesSchema.options = [...section.orgCategories]
          this.schemaObj.courseIdSchema.options = await queryList('standard/course', {
            where: { sectionId: newValue }
          })
        }
      }
    },
    'schemaObj.courseIdSchema.courseId': {
      async handler(newValue) {
        const course = this.schemaObj.courseIdSchema.options.find(item => item.id === newValue)
        if (course) {
          //   this.schemaObj.taskSchema.task = this.$tools.uniq([
          //     ...courseId.tasks,
          //     ...this.schemaObj.taskSchema.task
          //   ]);

          this.schemaObj.taskSchema.options = this.$tools.uniq([
            ...course.tasks,
            ...this.schemaObj.taskSchema.options
          ])
          //   this.schemaObj.serviceReqSchema.serviceReq = this.$tools.uniq([
          //     ...courseId.serviceReq,
          //     ...this.schemaObj.serviceReqSchema.serviceReq
          //   ]);
          this.schemaObj.serviceReqSchema.options = this.$tools.uniq([
            ...course.serviceReqs,
            ...this.schemaObj.serviceReqSchema.options
          ])
          // this.schemaObj.majorReqSchema.majorReq = courseId.majorReq;
        } else {
          this.schemaObj.courseIdSchema.options = await queryList('standard/course', {
            where: { sectionId: this.schemaObj.sectionIdSchema.sectionId }
          })
        }
      }
    },
    'schemaObj.taskSchema.task': {
      async handler(newValue) {
        if (newValue) {
          const categoryArr = this.schemaObj.orgCategoriesSchema.orgCategories
          const orgCategory = await queryList('dictionary/orgcategory', {
            where: { name: { $in: categoryArr }, 'optionalTasks.name': newValue }
          })
          let arr = []
          orgCategory.forEach(item => {
            const tasks = item.optionalTasks.find(el => el.name === newValue).optionalSubjects
            arr = [...arr, ...tasks]
          })
          arr = this.$tools.uniq(arr)
          const isEdit = this.$refs.formAndTable.id
          !isEdit && (this.schemaObj.subjectsSchema.subjects = [...arr])
          this.schemaObj.subjectsSchema.options = [...arr]
        }
      }
    }
  },
  methods: {
    // reBeforeSubmit(target) {
    //   target.sectionId = toPointer('TrainSection', target.sectionId)
    //   target.courseId = toPointer('courseId', target.courseId)
    // },
    beforeEdit(target) {
      // this._editSection = { ...target.sectionId }
      // target.sectionId = target.sectionId.objectId
      // target.courseId = target.courseId.objectId
      // queryList('standard/course', {
      //   where: { sectionId: target.sectionId }
      // }).then(list => {
      //   this.schemaObj.courseIdSchema.options = list
      //   // target.courseId = target.courseId
      // })
    }
  }
}
</script>
