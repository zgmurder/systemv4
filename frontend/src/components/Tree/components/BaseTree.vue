
<template>
  <el-tree
    :props="props"
    v-bind="$attr"
    :load="loadNode"
    :render-content="renderContent"
    node-key="objectId"
    lazy
    @check-change="handleCheckChange"
  />
</template>
<script>
export default {
  props: {
    loadNode: {
      type: Function,
      required: true
    }
  },
  data() {
    // return {
    //     props: {
    //         label: 'name',
    //         isLeaf:'isLeaf'
    //     },
    //     defaultExpanded:'',
    //     maxHeight: 700,
    //     isClickExpand:true,
    //     rootOrg:this.$backendService.getCurrentOrganization(),
    //     showSortBtn:false,
    //     isFirst: true,
    // }
    return {
      props: {
        label: 'name',
        isLeaf: 'isLeaf'
      },
      count: 1
    }
  },
  computed: {
    // tree(){
    //     return this.$refs.tree
    // },
    // isAdmin() {
    //     return this.$backendService.isAdmin();
    // }
  },
  mounted() {
    console.log(this.$attrs)

    // this.$nextTick(_=>{
    //     this.maxHeight = document.body.clientHeight - 180 + this.height;
    // });
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>
            {node.label}
            <el-tag type='success' size='mini' class='tag'>团级支队</el-tag>
            <el-tag type='info' size='mini' class='tag'>部队</el-tag>
            <el-tag type='warning' size='mini' class='tag' >执勤支队</el-tag>
          </span>
          <span>
            <el-button size='mini' on-click={ () => this.append(data) }>添加下级单位</el-button>
            <el-button size='mini' on-click={ () => this.remove(node, data) }>查看编辑</el-button>
          </span>
        </span>)
    }

    // handleNodeClick(data) {
    //     if(this.rootOrg.objectId === data.objectId){
    //         this.isClickExpand = false;
    //         setTimeout(()=>this.isClickExpand = true,100);
    //     }
    //     if(this._objectId === data.objectId)return;
    //     this._objectId = data.objectId;
    //     this.$emit('tree-click',data)
    // },
    // async loadNode(node, resolve) {
    //     this.$units._isEmpty(this.rootOrg) &&
    //     (this.rootOrg = (await this.$units.queryItemByKeyValue('Organization','orgCategory','武警总部')).list[0]);

    //     this.defaultExpanded = this.rootOrg.objectId;
    //     if (node.level === 0)resolve([this.rootOrg]);
    //     else{
    //         let childOrgs = (await this.$backendService.orgService.getChildOrganizationsByParentId(node.data.objectId)).list;
    //         childOrgs = childOrgs.map(item=>{
    //             const toSequence = this.toSequence === 4 ? 3 : this.toSequence;
    //             const isLeaf = (item.childrenIds||[]).length && item.orgSequence < toSequence;
    //             return {...item, isLeaf:!isLeaf }
    //         });
    //         if(this.isLocal)childOrgs = childOrgs.filter(org=>org.orgSequence === node.data.orgSequence);
    //         if(this.noNeedOffice)childOrgs = childOrgs.filter(org=>org.orgSequence !== node.data.orgSequence);
    //         setTimeout(()=>resolve(childOrgs),100);
    //     }
    // },
    // renderContent(h, { node, data, store }) {
    //     return (
    //         <div class="custom-tree-node">
    //             <span>{node.label}</span>
    //             { this.needHandle &&

    //             <div>
    //                 {this.rootOrg.objectId === data.objectId &&
    //                 <el-button  style="color:#67C23A" size="mini" type="text" on-click={ (e) => {e.stopPropagation();this.showSortBtn = !this.showSortBtn}}>{this.showSortBtn ? '关闭排序' : '修改排序'}</el-button>}

    //                 {this.$units._isEmpty(data.childrenIds) && this.rootOrg.objectId !== data.objectId &&
    //                 <el-button  style="color:#F56C6C" size="mini" type="text" on-click={ (e) => {e.stopPropagation();this.$emit('delete',node,data)}}>删除</el-button>}

    //                 <el-button size="mini" type="text" on-click={ (e) => {e.stopPropagation();this.$emit('change',node,data,true) }}>查看编辑</el-button>

    //                 <el-button size="mini" type="text" style="color:#E6A23C" on-click={ (e) => {e.stopPropagation();this.$emit('change',node,data)}}>添加下级单位</el-button>

    //                 {this.rootOrg.objectId !== data.objectId && this.showSortBtn &&
    //                 <span>
    //                     <i class="el-icon-upload2" on-click={ (e) => {e.stopPropagation();this.$emit('sort',node,data,true)}}> </i>
    //                     <i class="el-icon-download" on-click={ (e) => {e.stopPropagation();this.$emit('sort',node,data,false)}}> </i>
    //                 </span>
    //                 }
    //             </div>}
    //         </div>);
    // },
    // /*{(this.rootOrg.objectId !== data.objectId || this.rootOrg.orgSequence === 1) &&
    //                 <el-button size="mini" type="text" on-click={ (e) => {e.stopPropagation();this.$emit('change',node,data,true) }}>查看编辑</el-button>}*/
    // allowDrop(draggingNode, dropNode, type) {
    //     if (dropNode.data.label === '二级 3-1') {
    //         return type !== 'inner';
    //     } else {
    //         return true;
    //     }
    // },
    // allowDrag(draggingNode) {
    //     return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    // }
  }
}
</script>
<style scope lang="scss">
.custom-tree-node{
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding-right: 10px;
  .tag{
    margin-left: 10px;
  }
}

</style>
