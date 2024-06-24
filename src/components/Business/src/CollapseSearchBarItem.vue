<template>
  <a-form-item class="ant-form-item-cunstom" :label="item.label"
    :style="{width:item.component === 'Button'?'':`${item.width || 240}px`}" :label-col="item.labelCol">
    <component :disabled="yybdisabled" v-model:value="formState[item.field]" v-bind="{...item.bind}"
      :placeholder='getPla(item.placeholder,item.component)' :is="getComponent(item.component)">
      {{item.text}}
    </component>
  </a-form-item>
</template>
<script setup>
  import { componentMap } from '/@/components/Form/src/componentMap';
  const props = defineProps({
    formState: {
      type: Object,
      default: {},
    },
    item: {
      type: Object,
      default: {},
    },
    clickComp: {
      type: Function,
      default: () => {},
    },
  });
  const yybdisabled = computed(() => {
    let flag = false
    let arr = ['hospital_id', 'referrer', 'member_id', 'sponsor', ]
    const { field } = props.item
    // console.log('props.item: ', props.item)
    // console.log('props.formState', props.formState)
    if (field === 'hospital_id') props.item.bind.options = props.formState.hospitalPersonOptions

    if (arr.includes(field) && typeof props.formState.from_type !== 'number') flag = true
    return flag
  })
  watch(() => props.formState.from_type, val => {


  })
  const getPla = (placeholder, component) => {
    return placeholder || (component.includes('Input') ? '请输入' : '请选择');
  };
  const getComponent = (componentName) => {
    return componentMap.get(componentName);
  };
</script>
<style lang="less" scoped>
  .ant-form-item-cunstom {
    // margin-bottom: 6px !important
  }
</style>
