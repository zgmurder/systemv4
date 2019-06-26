import { queryList } from '@/api/baseApi'

export default {
  data() {
    return {
      standardForm: {
        fieldType: 'select',
        placeholder: '训练大纲',
        label: '训练大纲',
        vModel: 'standardId',
        standardId: '',
        options: [],
        // valueKey: 'id',
        required: true,
        optValue: 'id',
        noDataText: '请录入大纲',
        onChange: (obj, value) => (this._standard = value)
      },
      standardTable: {
        prop: 'standard',
        label: '大纲',
        // noFilter: true,
        width: '100',

        handleValue: value => (value || {}).name,
        filterConfig: true,
        defaultValue: true
        // filterMethod: this.filterHandler,
        // filterMultiple: false
      },
      temJson: {}
    }
  },
  async created() {
    this.standardForm.options = await queryList('standard/trainstandard')

    this._standard = (this.standardForm.options[0] || {}).id
    this.standardForm.standardId = this._standard
    // this.standardTable.filters = this.standardForm.options.map(item => ({
    //   text: item.name,
    //   value: `${item.id}_${item.className}`
    // }))

    // this.$set(this.standardTable,'filterMethod',this.filterHandler)
    // this.standardTable.filterMethod = this.filterHandler;
    const index = this.schema[0].fieldType === 'divider1' ? 1 : 0
    this.schema.splice(index, 0, this.standardForm)
    this.columns.unshift(this.standardTable)
    this.$nextTick(() => {
      this.$EventBus.$emit('finished')
    })
    // this.standardForm = null;
    // this.standardTable = null;
  },
  methods: {
    // beforeSubmit(target) {
    //   target.standard = toPointer('TrainStandard', target.standard)
    //   this.reBeforeSubmit && this.reBeforeSubmit(target)
    // },
    // beforeEdit(target) {
    //   target.standard = target.standard.id
    //   this.reBeforeEdit && this.reBeforeEdit(target)
    // },
    filterHandler(value, row, column) {
      this.temJson[column.id] = column.property
      return true
    },
    dialogIsClose() {
      const found = this.schema.find(item => item.vModel === 'standardId')
      found[found.vModel] = this._standard
      this.dialogIsCloseAfter && this.dialogIsCloseAfter()
    }
  }
}
