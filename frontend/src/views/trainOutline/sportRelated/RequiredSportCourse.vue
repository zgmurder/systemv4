
<template>
  <div class="SportAssessReq">
    <form-and-table ref="formAndTable" url="standard/requiredsportcourse" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'
import { Gender, PhysicalLevel, TroopCategory } from '@/const/index'

//     class RequiredSportCourse {
//   private String id;
//   private String courseId;
//   private String standardId;
//   private List<String> physicalLevels;    // 体能训练等级列表
//   private List<String> troopCategories;   // 军兵种类型列表
//   private List<String> genders;           // 性别要求列表(男/女)
//   private Boolean civilServant;         // 是否适用于文职人员
//   private Boolean ageEnabled;           // 是否启用年龄条件
//   private int fromAge;                    // 年龄条件
//   private int toAge;
// }
export default {
  name: 'Category',
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        { prop: 'course', label: '体育课目', handleValue: val => val.name },
        // {prop: 'required', label: '是否必考', handleValue: (val=>{return !val ? '选考' : '必考'})},
        { prop: 'physicalLevels', label: '体能训练等级', handleValue: (value) => value && value.join('、'), filterConfig: true },
        { prop: 'troopCategories', label: '军兵种类型', handleValue: (value) => value && value.join('、'), filterConfig: true },
        { prop: 'genders', label: '性别要求', handleValue: (value) => value && value.join('、'), filterConfig: true },
        { prop: 'civilServant', label: '适用于文职人员', handleValue: val => { return !val ? '否' : '是' } },
        { prop: 'ageEnabled', label: '年龄要求', handleValue: (val, row) => { return !row.ageEnabled ? '' : `${row.fromAge}-${row.toAge}` } }
      ],
      schema: [
        { fieldType: 'select', required: true, placeholder: '体育课目', filterable: true, label: '体育课目', vModel: 'courseId', courseId: '', options: [], optValue: 'id' },
        { fieldType: 'select', required: true, placeholder: '训练等级', label: '训练等级', vModel: 'physicalLevels', physicalLevels: [], options: PhysicalLevel, multiple: true },
        { fieldType: 'select', required: true, placeholder: '军兵种类型', label: '军兵种类型', vModel: 'troopCategories', troopCategories: [], options: Object.values(TroopCategory), multiple: true },
        { fieldType: 'select', required: true, placeholder: '性别要求', label: '性别要求', vModel: 'genders', genders: [], options: Object.values(Gender), multiple: true },
        { fieldType: 'checkbox', placeholder: '文职人员', label: '文职人员', vModel: 'civilServant', civilServant: false, border: true },
        { fieldType: 'checkbox', placeholder: '启用年龄条件', label: '启用年龄条件', vModel: 'ageEnabled', ageEnabled: false, border: true },
        { fieldType: 'input-number', placeholder: '最低年龄', label: '最低年龄', vModel: 'fromAge', fromAge: undefined, disabled: true },
        { fieldType: 'input-number', placeholder: '最高年龄', label: '最高年龄', vModel: 'toAge', toAge: undefined, disabled: true }
      ]
    }
  },
  computed: {
    schemaPhysicalLevel() {
      return this.schema.find(item => item.vModel === 'physicalLevels')
    },
    schemaCourse() {
      return this.schema.find(item => item.vModel === 'courseId')
    },
    schemaAgeEnabled() {
      return this.schema.find(item => item.vModel === 'ageEnabled')
    },
    schemaFromAge() {
      return this.schema.find(item => item.vModel === 'fromAge')
    },
    schemaToAge() {
      return this.schema.find(item => item.vModel === 'toAge')
    }
  },
  watch: {
    'schemaAgeEnabled.ageEnabled': {
      handler(val) {
        this.schemaFromAge.disabled = !val
        this.schemaToAge.disabled = !val
        this.schemaFromAge.fromAge = !val ? '' : this.schemaFromAge.fromAge
        this.schemaToAge.toAge = !val ? '' : this.schemaToAge.toAge
      },
      immediate: true
    }
  },
  async created() {
    setTimeout(async _ => {
      // this.schemaPhysicalLevel.options = await queryList('PhysicalLevel')
      this.schemaCourse.options = await queryList('standard/course', { where: { category: 1 }})
      this.$EventBus.$emit('finished')
      // this.schemaSportCategory.options = await queryList("SportCategory");
      // this.schemaPhysicalLevel.options = (await this.$backendService.queryList('PhysicalLevel')).list;
      // this.schema[0].standard = this.$parent.standard.name;
      // this.schema[0].standard = this.$parent.standard.name;
      // let sportCourseQuery = new this.$Client.Query(this.$Client['courseId']);
      // let $standard = this.$backendService.getParseObject('TrainStandard' , this.$parent.standard.objectId);
      // sportCourseQuery.equalTo('standard', $standard);
      // sportCourseQuery.equalTo('category', CourseCategory.Sport);
      // this.schemaCourse.options = (await this.$backendService.queryList('courseId', sportCourseQuery)).list;
    }, 500)
  },
  methods: {
    reBeforeEdit(row) {
      row.courseId = row.courseId && row.courseId.objectId
      row.fromAge = !row.ageEnabled ? '' : row.ageCondition.fromAge
      row.toAge = !row.ageEnabled ? '' : row.ageCondition.toAge
    }
  }
}
</script>

