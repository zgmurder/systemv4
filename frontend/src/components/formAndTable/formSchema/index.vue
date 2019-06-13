<template>
  <el-form
    ref="form"
    :class="{'form-flex':schema.length>2}"
    class="com-form"
    label-width="100px"
  >
    <slot name="title" />
    <el-form-item
      v-for="(field, index) in schema"
      v-show="handleControl(field.controlBy) && !field.hidden"
      :key="index"
      :label="field.label"
      :required="field.required"
      :error="field.error"
      :style="{width: field.width}"
      class="schema-form-item"
    >
      <component
        :is="'el-'+field.fieldType"
        v-model="field[field.vModel]"
        :default-first-option="true"
        v-bind="field"
        style="width: 100%"
        clearable
        @input="handleInput($event,field)"
        @change="handleChange($event,field,index)"
        @select="handleChange($event,field,index)"
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
      <!-- <component v-if="field.component" :is="field.component"></component>
      <component
        clearable
        v-else
        :type="field.type"
        :multiple="field.multiple"
        :no-data-text="field.emptyText"
        :is="'el-'+field.fieldType"
        v-model="field[field._name]"
        style="width: 100%"
        :label="field.label"
        :allow-create="field.allowCreate"
        :default-first-option="field.allowCreate||field.filterable"
        :border="field.border"
        :filterable="field.allowCreate||field.filterable"
        :disabled="!!field.disabled"
        @change="(value)=>field.change && field.change(value,field)"
        :placeholder="field.placeholder"
      >
        <el-option
          v-if="field.options"
          v-for="(item,index) in field.options"
          :key="index"
          :label="item"
          :value="field.valueIsIndex ? index : item"
        ></el-option>
        <el-option
          v-if="field.keyOptions"
          v-for="(item,index) in field.keyOptions"
          :key="index"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </component>-->
    </el-form-item>

    <el-form-item class="btn-box">
      <el-button v-if="!editing" type="primary" @click="onSubmit">立即创建</el-button>
      <el-button v-else type="warning" plain @click="onSubmit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isEmpty } from '../units'
import ElDivider1 from '@/components/Divider/main'
export default {
  name: 'ComForm',
  components: {
    ElDivider1
  },
  props: {
    schema: {
      type: Array,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMessage: false
    }
  },
  computed: {
    // newSchema() {
    //   this.schema.forEach(item => {
    //     this.$set(item, item.vModel, item[item.vModel]);
    //     if (item.required) this.$set(item, "error", "");
    //   });
    //   console.log(2)
    //   return this.schema;
    // }
  },
  watch: {},
  created() {
    this._initValues = this.schema.map(item => [item.hidden, item[item.vModel]])
    this.schema.forEach(item => {
      this.$set(item, item.vModel, item[item.vModel])
      if (item.required) this.$set(item, 'error', '')
    })
    console.log(this._initValues)
  },
  methods: {
    onSubmit() {
      const obj = {}
      this.schema.forEach(item => {
        // if (typeof item[item.vModel] === "string")
        //   item[item.vModel] = item[item.vModel].tirm();
        if (item.required && isEmpty(item[item.vModel]) && item[item.vModel] !== 0) item.error = item.errorMassage || '此项必填'
        else if (item.validate && !item.validate(item)) item.error = item.errorMassage || '不合规则'
        else item.error = ''
        obj[item.vModel] = item[item.vModel]
      })
      const dataIsOk = !this.schema.some(item => !!item.error)
      if (dataIsOk) {
        delete obj.underfine
        this.$emit('formFinish', obj)
      }
    },
    initForm() {
      this.schema.splice(this._initValues.length, this.schema.length - this._initValues.length)
      this.schema.forEach((item, index) => {
        item[item.vModel] = this._initValues[index][1]
        item.hidden = this._initValues[index][0]
        item.error = ''
      })
    },
    handleInput(value, item) {
      if (item.required && !item[item.vModel]) item.error = item.errorMassage
      else item.error = ''
      item.onInput && item.onInput(value, item)
    },
    handleChange($event, field, index) {
      const found = Array.isArray(field.options) && field.options.find(item => item.name === $event)
      field.onChange && field.onChange(field, $event, found, index)
    },
    // handleLabel(item, field) {
    //   if (labelOrValue === 'index') return index
    //   return typeof item === 'object' ? (labelOrValue ? item[labelOrValue] : item.name) : item
    // },
    handleValue(item, field, index) {
      const { optValue, valueKey } = field
      if (optValue === 'index') return index
      else if (valueKey) return item
      else { return typeof item === 'object' ? (optValue ? item[optValue] : item.name) : item }
    },
    handleLabel(item, field, index) {
      const { optLabel } = field
      return typeof item === 'object' ? (optLabel ? item[optLabel] : item.name) : item
    },
    handleControl(controlBy) {
      if (!controlBy || isEmpty(controlBy)) return true
      const found = this.schema.find(item => item.vModel === controlBy.name)
      return found ? (controlBy.handle && controlBy.handle(found[found.vModel])) : true
    }
  }
}
</script>

<style scoped lang="scss">
.com-form {
  position: relative;
  &.form-flex {
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 33%;
    }
  }
  & > .btn-box {
    width: 100% !important;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
