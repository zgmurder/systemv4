<template>
  <div class="property">
    <formAndTable :schema="schema" :columns="columns" url="dictionary/ordnancetype" @dialogVisible="dialogVisible" />
  </div>
</template>

<script>
import formAndTable from '@/components/formAndTable'
import { OrdnanceCategory } from '@/const/index'
export default {
  components: {
    formAndTable
  },
  data() {
    return {
      columns: [
        { prop: 'order', label: '序号', width: '50', noFilter: true },
        { prop: 'name', label: '军械类型' },
        { prop: 'category', label: '军械分类' },
        { prop: 'weaponUnit', label: '计量单位' },
        { prop: 'bulletUnit', label: '弹药单位' }
      ],
      schema: [
        { fieldType: 'input', placeholder: '军械类型', label: '军械类型', vModel: 'name', name: '', required: true },
        { fieldType: 'select', placeholder: '军械分类', label: '军械分类', vModel: 'category', category: '', options: Object.values(OrdnanceCategory), required: true },
        { fieldType: 'input', placeholder: '计量单位', label: '计量单位', vModel: 'weaponUnit', weaponUnit: '' },
        { fieldType: 'input', placeholder: '弹药单位', label: '弹药单位', vModel: 'bulletUnit', bulletUnit: '', required: true },
        { fieldType: 'input-number', placeholder: '排序码', label: '排序码', vModel: 'order', order: 0 }
      ]
    }
  },
  methods: {
    dialogVisible(count = 0) {
      const obj = this.schema.find(item => item.vModel === 'order')
      obj.order = count + 1
    }
  }
}
</script>
