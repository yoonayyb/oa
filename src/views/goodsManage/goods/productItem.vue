<template>
  <a-form-item :name="['list', index, 'productObj']" :rules="[{ required: true, message: '请输入数量', trigger: ['blur', 'change'] }]">
    <a-select
      style="width: 150px"
      @change="productChange($event, record, list)"
      v-model:value="record.productObj"
      placeholder="请选择"
      allowClear
      show-search
      label-in-value
      :options="productOptions"
      :field-names="{ label: 'productName', value: 'id' }"
    >
    </a-select>
  </a-form-item>
</template>

<script lang="ts" setup>
  import { Form } from 'ant-design-vue';

  const props = defineProps({
    index: {
      type: Number,
      default: () => 0,
    },
    list: {
      type: Array,
      default: () => [],
    },
    productOptions: {
      type: Array,
      default: () => [],
    },
    record: {
      type: Object,
      default: () => {},
    },
  });
  const emits = defineEmits(['productChange']);
  const formItemContext = Form.useInjectFormItemContext();
  const productChange = (e, record, list) => {
    emits('productChange', e, record, list);
  };
</script>
<style lang="less" scoped></style>
