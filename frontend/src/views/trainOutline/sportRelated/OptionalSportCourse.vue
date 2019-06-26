
<template>
  <div class="OptionalSportCourse">
    <form-and-table ref="formAndTable" url="standard/optionalsportcourse" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryList } from '@/api/baseApi'
import { Gender, PhysicalLevel, TroopCategory } from '@/const/index'
import standardMixin from '../standardMixin'
// class OptionalSportCourse {
//   private String id;
//   private String standardId;
//   private List<String> courseIds;       // 体育课目列表，或者的关系
//   private int groupId;                  // 课目组编号
//   private int itemSeq;                  // 课目序号
//   private String physicalLevel;         // 体能训练等级
//   private String troopCategory;         // 军兵种类型
//   private String gender;                // 性别要求
// }
export default {
  name: 'OptionalSportCourse',
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        { prop: 'groupId', label: '编号', width: '50' },
        { prop: 'courses', label: '体育课目', handleValue: value => value.map(item => item.name).join('、') },
        { prop: 'physicalLevel', label: '体能训练等级', filterConfig: true },
        { prop: 'troopCategory', label: '军兵种类型', filterConfig: true },
        { prop: 'gender', label: '性别要求', filterConfig: true }
      ],
      schema: [
        { fieldType: 'select', width: '66%', required: true, placeholder: '体育课目', label: '体育课目', vModel: 'courseIds', courseIds: [], options: [], optValue: 'id', multiple: true },
        { fieldType: 'input-number', required: true, placeholder: '课目组编号', label: '课目组编号', vModel: 'groupId', groupId: 1, min: 0 },
        { fieldType: 'input-number', required: true, placeholder: '课目序号', label: '课目序号', vModel: 'itemSeq', itemSeq: 1, min: 0 },
        { fieldType: 'select', placeholder: '训练等级', required: true, label: '训练等级', vModel: 'physicalLevel', physicalLevels: '', options: PhysicalLevel },
        { fieldType: 'select', placeholder: '军兵种类型', required: true, label: '军兵种类型', vModel: 'troopCategory', troopCategories: '', options: Object.values(TroopCategory) },
        { fieldType: 'select', placeholder: '性别要求', required: true, label: '性别要求', vModel: 'gender', gender: '', options: Object.values(Gender) }
      ]
    }
  },
  computed: {
    schemaPhysicalLevel() {
      return this.schema.find(item => item.vModel === 'physicalLevel')
    },
    schemaCourse() {
      return this.schema.find(item => item.vModel === 'courseIds')
    }

  },
  async created() {
    setTimeout(async _ => {
      // this.schemaPhysicalLevel.options = await queryList('PhysicalLevel')
      this.schemaCourse.options = await queryList('standard/course', { where: { category: 1 }})
      // this.schema[0].standard = this.$parent.standard.name;
      // let sportCourseQuery = new this.$Client.Query(this.$Client['Course']);
      // let $standard = this.$backendService.getParseObject('TrainStandard' , this.$parent.standard.objectId);
      // sportCourseQuery.equalTo('standard', $standard);
      // sportCourseQuery.equalTo('category', CourseCategory.Sport);
      // this.schemaCourse.options = (await this.$backendService.queryList('Course', sportCourseQuery)).list;
    }, 500)
  },
  methods: {
    reBeforeSubmit(formData) {
      // let deleteList = ['course'];
      // let $coursesArr = [];
      // this.schemaCourse.options.forEach(item=>{
      //     if (formData.course.includes(item.name)) $coursesArr.push(item.objectId);
      // });
      formData.courseIds = formData.courseIds.map(item => ({ __type: 'Pointer', objectId: item, className: 'SportCourse' }))
      // Object.keys(formData).forEach(item=>{
      //     if (deleteList.includes(item)) delete formData[item]
      // });
    },
    reBeforeEdit(row) {
      row.courseIds = [...row.courseIds].map(item => item.objectId)
    },
    filterCourse(row) {
      if (this.$tools.isEmpty(row.courseIds)) return ''
      const names = row.courseIds.map(item => item.name)
      return `${row.itemSeq}. ${names.join('; ')}`
    }
  }
}
</script>

