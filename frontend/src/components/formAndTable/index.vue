<template>
  <div class="property">
    <tableSchema
      :data="tableList"
      v-bind="$attrs"
      :columns="columns"
      border
      stripe
      @deleteItem="deleteItem"
      @editItem="editItem"
      v-on="$listeners"/>
    <!--
      @filter-change="handleTableFilter"

       -->
    <div :style="{'justify-content':btnShow?'space-between':'flex-end'}" class="btn-and-page">
      <el-button v-show="btnShow" class="btn" type="primary" icon="el-icon-plus" circle @click="dialogVisible = true"/>
      <el-pagination
        :current-page.sync ="options.skip"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="options.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="fetchTableList"/>
    </div>
    <el-dialog
      :title="id?'修改数据':'添加数据'"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      @close="dialogIsClose">
      <formSchema ref="formSchema" :schema="schema" :editing="!!id" @formFinish="formFinish"/>
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
// import { saveItem, deleteItem, toPointer, queryListAndTotal } from '@/api/baseApi'
import { cloneDeep } from './units'
export default {
  name: 'TableAndForm',
  components: {
    tableSchema,
    formSchema
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
    handler: {
      type: Object,
      required: true
    },
    btnShow: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      tableList: [],
      curPage: 1,
      dialogVisible: false,
      id: undefined,
      total: 0,
      filterOptions: {
        contains: ['', ''],
        equalTo: {}
      },
      options: {
        skip: 1,
        limit: 10,
        contains: {}
      },
      isDim: false,
      filterName: ''
    }
  },
  // computed: {
  //   className() {
  //     if (this.$parent.className) return this.$parent.className
  //     const arr = this.$route.path.split('/')
  //     const className = arr[arr.length - 1]
  //     return className.slice(0, 1).toUpperCase() + className.slice(1)
  //   },
  //   searchColumns() {
  //     return this.columns.filter(item => !item.noFilter)
  //   }
  // },
  // watch: {
  //   'filterName': {
  //     handler(newValue, oldValue) {
  //       if (oldValue) {
  //         this.options.contains[oldValue] = ''
  //         this.fetchTableList()
  //       }
  //     },
  //     immediate: false
  //   }
  // },
  created() {
    // this.filterName = this.columns[0].prop
    this.fetchTableList()
    // setTimeout(() => {
    //   this.$refs.search && (this.$refs.search.style['z-index'] = 5)
    // }, 1000)
  },
  // beforeDestroy() {
  //   this.$refs.search.style['z-index'] = -1
  // },
  methods: {
    handleSearch() {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        this.fetchTableList()
      }, 500)
    },
    fetchTableList(curPage, filterArr) {
      // const skip = (this.options.skip - 1) * this.options.limit
      this.handler.queryListAndTotal({ option: {
        sort: { updatedTime: -1 }
      }}).then(({ list, total }) => {
        this.tableList = list
        this.total = total
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
      if (this.id) {
        formData.id = this.id
        await this.handler.updateItem(formData)
      } else {
        await this.handler.saveItem(formData)
      }

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
      await this.handler.deleteItem(row.id)
      this.$message({ showClose: true, type: 'success', message: '删除成功' })
      this.fetchTableList()
    },
    editItem(row) {
      this.dialogVisible = true
      this.id = row.id
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
    }
  }
}
</script>
<style lang="scss">
.btn-and-page{
  display: flex;
  justify-content:space-between;
  padding:10px;
  }
.search{
    position:fixed;
    top:0;
    left:50%;
    display:flex;
    z-index: -1;
    padding: 10px;
}
</style>
