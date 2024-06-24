<template>
  <!-- 表单联系人专属插槽定制 -->

  <a-select v-bind="getProps" labelInValue @search="onSearch" :filter-option="false" @popupScroll="handleScroll"
    v-model:value="$attrs.model[$attrs.field]" mode="multiple" style="width: 100%"
    :placeholder=" '请选择'+$attrs.schema.label" :options="contactsOptions"
    @change="change($attrs.model[$attrs.field],$attrs.field,$attrs.schema)"
    :fieldNames="{label:'name',value:'id'}"></a-select>

</template>

<script setup>
  import { useContactsSelect } from '@/utils/common.js';
  const [pagetions, contactsOptions, searchParams, onSearch, handleScroll, requireApi] = useContactsSelect()
  import { useAttrs } from '@vben/hooks';
  const emits = defineEmits(['contactsChange'])
  const attrs = useAttrs()
  const props = defineProps({
    formProps: {
      type: Object,
      default: () => ({}),
    },
  })
  const getProps = computed(() => {
    return { ...props.formProps, ...attrs.value }
  });
  const change = (val, field, schema) => {
    console.log('getProps ', getProps)
    val.forEach(v => v.field = field)
    emits('contactsChange', field, val, schema)

  }
  onMounted(() => {

    requireApi()
  })
</script>
<style lang='less' scoped>

</style>
