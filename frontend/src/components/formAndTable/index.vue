
<template>
  <div class="form-and-table">
    <div ref="search" class="search" :style="{'justify-content':!filterSchema.length && 'flex-end'}">
      <!-- <div>
        <el-input v-model="where[filterName]" size="mini" placeholder="请输入内容" clearable @input="handleSearch">
          <el-select slot="prepend" v-model="filterName" closed style="width:120px" placeholder="请选择">
            <el-option v-for="(item,index) in searchColumns" :key="index" :label="item.searchLabel || item.label" :value="item.prop" />
          </el-select>
        </el-input>

      </div> -->
      <minformSchema v-if="filterSchema.length" :schema="filterSchema" @formFinish="formFinish" />
      <el-button v-show="btnShow" class="btn" size="small" type="primary" icon="el-icon-plus" @click="handleAddBtn" />
    </div>

    <tableSchema
      v-loading="loading"
      :data="tableList"
      v-bind="$attrs"
      :columns="columns"
      border
      stripe
      @deleteItem="deleteItem"
      @editItem="editItem"
      v-on="$listeners"
    ><slot slot="moreHandle" slot-scope="{data}" :data="data" name="moreHandle" /></tableSchema>
    <!--
      @filter-change="handleTableFilter"

       -->
    <!--  :style="{'justify-content':btnShow?'space-between':'flex-end'}" -->
    <div class="btn-and-page">
      <el-pagination
        :current-page.sync="options.skip"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="options.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="fetchTableList"
      />
    </div>
    <el-dialog
      class="my-dialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="60%"
      @close="dialogIsClose"
    >
      <div slot="title">{{ id?'修改数据':'添加数据' }}</div>
      <formSchema ref="formSchema" :schema="schema" :editing="!!id" @formFinish="formFinish" />
    </el-dialog>
    <!-- <div ref="search" class="search">
      <el-input v-model="options.contains[filterName]" size="mini" placeholder="请输入内容" clearable @input="handleSearch">
        <el-select slot="prepend" v-model="filterName" style="width:70px" placeholder="请选择">
          <el-option v-for="(item,index) in searchColumns" :label="item.searchLabel || item.label.slice(-2)" :value="item.prop" :key="index"/>
        </el-select>
      </el-input>
    </div> -->

  </div>
</template>

<script>
import tableSchema from './tableSchema'
import formSchema from './formSchema'
import minformSchema from './formSchema/mini'
import { saveItem, deleteItem, queryListAndTotal, updateItem } from '@/api/baseApi'
import { cloneDeep, type } from './units'
export default {
  name: 'FormAndTable',
  components: {
    tableSchema,
    formSchema,
    minformSchema
  },
  provide: function(params) {
    return {
      parentSlots: this.$slots
    }
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    schema: {
      type: Array,
      // required: true
      default: () => []
    },
    hasTree: {
      type: Boolean,
      required: false
    },
    btnShow: {
      type: Boolean,
      default: true
    },
    url: {
      required: true,
      type: String,
      default: ''
    },
    beforeClickAdd: {
      type: Function,
      default: () => {}
    },
    defaultWhere: {
      type: Object,
      default: () => {}
    },
    defaultOption: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableList: [],
      dialogVisible: false,
      id: undefined,
      total: 0,
      options: {
        skip: 1,
        limit: 10
      },
      where: {},
      filterName: '',
      filterSchema: [],
      loading: false
    }
  },
  computed: {
    searchColumns() {
      return this.columns.filter(item => !item.noFilter)
    }

  },
  watch: {
    'filterName': {
      handler(newValue, oldValue) {
        if (oldValue) {
          this.$delete(this.where, oldValue)
          // this.options.contains[oldValue] = ''
          this.fetchTableList()
        }
      },
      immediate: false
    },
    'defaultWhere': {
      handler(newValue, oldValue) {
        this.fetchTableList()
      }
      // immediate: false
    },
    'filterSchema': {
      handler(newValue, oldValue) {
        this.where = newValue.reduce((prev, curr) => {
          const value = curr.vModel
          if (!type.isEmpty(curr[value])) {
            prev[value] = type.isFunction(curr.filterConfig) && curr.filterConfig(curr[value]) || curr[value]
          }
          return prev
        }, {})
        this.options.skip = 1
        this.handleSearch()
      },
      deep: true
    }
  },
  created() {
    this.filterName = this.searchColumns[0].prop
    this.fetchTableList()
    this.handleFilter()
    this.$EventBus.$on('finished', () => {
      this.handleFilter()
    })
  },
  mounted() {

  },
  methods: {
    handleFilter() {
      const columns = this.columns.filter(item => !!item.filterConfig)
      this.filterSchema = columns.map(item => {
        if (type.isObject(item.filterConfig)) return item.filterConfig
        const found = this.schema.find(subItem => subItem.vModel === item.prop || subItem.vModel === item.prop + 'Id')
        const obj = { ...found, filterConfig: item.filterConfig, required: false, multiple: false, fieldType: type.isEmpty(found.options) ? 'input' : found.fieldType }
        this.$set(obj, obj.vModel, item.defaultValue ? obj[obj.vModel] : undefined)
        return obj
      })
      // this.$EventBus.$off('finished')
    },
    handleSearch() {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        this.fetchTableList()
      }, 500)
    },
    fetchTableList() {
      // eslint-disable-next-line no-unused-vars
      this.loading = true
      const { limit, skip } = this.options
      const num = (skip - 1) * limit
      // const where = cloneDeep(this.where)
      // Object.assign(where, this.$attrs.where || {})
      // if (where[this.filterName]) {
      //   where[this.filterName] = {
      //     '$regex': where[this.filterName]
      //   }
      // } else {
      //   delete where[this.filterName]
      // }

      queryListAndTotal(this.url, { option: {
        // sort: { updatedTime: -1 },
        skip: num,
        limit,
        ...this.defaultOption
      }, where: { ...this.where, ...this.defaultWhere }}).then(({ list, total }) => {
        this.tableList = list
        this.total = total
        this.loading = false
      })
      // this.handler.queryList(this.className, { ...this.options, skip }).then(({ list, total }) => {
      //   this.tableList = list
      //   this.total = total
      // })
    },
    dialogIsClose() {
      this.$refs.formSchema.initForm()
      this.id = undefined
      this.$emit('dialogIsClose')
    },
    async formFinish(formData) {
      this.$parent.beforeSubmit && this.$parent.beforeSubmit(formData)
      // const url = this.url.slice(0, this.url.length - 1)
      let isOk
      if (this.id) {
        formData.id = this.id
        isOk = await updateItem(this.url, formData)
      } else {
        isOk = await saveItem(this.url, formData)
      }
      if (!isOk) return
      this.dialogVisible = false
      this.$message({ showClose: true, type: 'success', message: this.id ? '修改成功' : '添加成功' })
      this.fetchTableList()
    },
    async deleteItem(row) {
      const isOk = await this.$confirm('确定要删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => false)
      if (!isOk) return
      await deleteItem(this.url, row.id || row._id)
      this.$message({ showClose: true, type: 'success', message: '删除成功' })
      this.fetchTableList()
    },
    editItem(row) {
      this.dialogVisible = true
      this.id = row.id || row._id
      const target = cloneDeep(row)
      this.$parent.beforeEdit && this.$parent.beforeEdit(target)
      setTimeout(() => {
        this.schema.forEach(item => {
          item[item.vModel] = target[item.vModel]
        })
      }, 100)
      setTimeout(() => {
        this.$parent.afterEdit && this.$parent.afterEdit(target)
      }, 200)
    },
    handleTableFilter(value) {
      console.log(value)
    },
    handleAddBtn() {
      if (this.beforeClickAdd()) return
      this.dialogVisible = true
      this.$emit('dialogVisible', this.total)
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-and-page{
  display: flex;
  justify-content:flex-end;
  padding:10px;
  }
.search{
    // position:fixed;
    // top:0;
    // left:50%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 44px;
    background: #eee
    // float: right;
}
</style>
