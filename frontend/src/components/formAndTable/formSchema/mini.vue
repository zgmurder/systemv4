<template>
  <div class="table-filter-container">
    <component
      :is="'el-'+field.fieldType"
      v-for="(field, index) in schema"
      :key="index"
      v-model="field[field.vModel]"
      :default-first-option="true"
      v-bind="field"
      class="container-item"
      clearable
    >
      <template v-if="field.fieldType === 'select'">
        <el-option
          v-for="(item,i) in field.options||[]"
          :key="i"
          :disabled="item.disabled"
          :label="handleLabel(item,field)"
          :value="handleValue(item,field,i)"
        />
      </template>
      <template v-if="field.fieldType === 'radio-group'">
        <el-radio
          v-for="(item,i) in field.options"
          :key="i"
          :disabled="item.disabled"
          :label="handleValue(item,field,i)"
        >{{ handleLabel(item,field,i) }}</el-radio>
      </template>
    </component>
  </div>
</template>

<script>
export default {
  props: {
    schema: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleValue(item, field, index) {
      const { optValue, valueKey } = field
      if (optValue === 'index') return index
      else if (valueKey) return item
      else { return typeof item === 'object' ? (optValue ? item[optValue] : item.name) : item }
    },
    handleLabel(item, field, index) {
      const { optLabel } = field
      return typeof item === 'object' ? (optLabel ? item[optLabel] : item.name) : item
    }
  }
}
</script>

<style lang="scss" scoped>
.table-filter-container{
  width: 100%;
  flex: 1;
  display: flex;
  // justify-content: space-between;
  .container-item{
    margin-left:10px;
    max-width: 120px;
  }
}
</style>
