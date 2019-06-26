
<template>
  <div class="SportTime">
    <form-and-table ref="formAndTable" url="standard/sporttime" :columns="columns" :schema="schema" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { PhysicalLevel } from '@/const/index'
import { queryList } from '@/api/baseApi'
import standardMixin from '../standardMixin'
// 体育课目时间表
// const SportTimeSchema = new Schema({
//  standard: { type: Schema.Types.ObjectId, ref: 'TrainStandard' },    // 训练大纲
// 	sportCategory: String,                                  // 体育科目分类
//  physicalLevel: String,                                  // 体能训练等级
//  hours: Number,                                          // 时间要求
// });
export default {
  name: 'Category',
  components: {
    formAndTable
  },
  mixins: [standardMixin],
  data() {
    return {
      columns: [
        { prop: 'sportCategory', label: '课目分类', filterConfig: true },
        { prop: 'physicalLevel', label: '训练等级', filterConfig: true },
        { prop: 'hours', label: '时间要求（小时）' }
      ],
      schema: [
        { fieldType: 'select', required: true, placeholder: '课目分类', label: '课目分类', vModel: 'sportCategory', sportCategory: '', options: [] },
        { fieldType: 'select', required: true, placeholder: '训练等级', label: '训练等级', vModel: 'physicalLevel', physicalLevel: '', options: PhysicalLevel },
        { fieldType: 'input-number', required: true, placeholder: '时间要求(小时)', label: '时间要求', vModel: 'hours' }
      ]
    }
  },
  computed: {
    schemaPhysicalLevel() {
      return this.schema.find(item => item.vModel === 'physicalLevel')
    },
    schemaSportCategory() {
      return this.schema.find(item => item.vModel === 'sportCategory')
    }
  },
  created() {
    // setTimeout(_=>{this.schema[0].standard = this.$parent.standard.name},500);
    // this.schemaPhysicalLevel.options = (await queryList('PhysicalLevel')).list;
    // this.schemaSportCategory.options = (await queryList('SportCategory')).list;
    setTimeout(async() => {
    //   this.schemaPhysicalLevel.options = await queryList('dictionary/physicallevel')
      this.schemaSportCategory.options = await queryList('dictionary/sportcategory')
      this.$EventBus.$emit('finished')
    }, 500)
  },
  methods: {
    // beforeSubmit(formData) {
    //     formData.standard = this.$parent.standard.objectId;
    // },
    // beforeEdit(row){
    //     row.standard = this.$parent.standard.name;
    // }
  }
}
</script>

