<template>

  <div class="page1">
    <BasicForm @register="registerForm">
      <template #formFooter="data">
        <a-button style="margin-left:120px" type="primary" @click="submit(data)">保存</a-button>
        <!-- <a-button style="margin-left:120px" type="primary" @click="open">打开联系人</a-button> -->
      </template>
    </BasicForm>
    <Modal @register="register" />
  </div>

</template>
<script lang='ts' setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/components/Business/src/contactsModal/index.vue';
  import { formSchema } from './index';
  const router = useRouter();
  const emit = defineEmits(['handleFormSave']);
  const props = defineProps({
    configRes: {
      type: Object,
      default: {},
    },
  });
  const [register, { openModal }] = useModal();
  const open = () => {
    openModal(true);
  };
  watch(
    () => props.configRes,
    (newVal) => {
      setFieldsValue(newVal);
      console.log('[ newVal ]-29', newVal);
    },
  );
  const [registerForm, { setFieldsValue, updateSchema, resetFields, validate, getFieldsValue }] =
  useForm({
    labelWidth: 120,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const submit = async () => {
    const values = await validate();
    emit('handleFormSave', { ...values, stepNum: 2 });
  };

  defineExpose({
    getFieldsValue,
  });
</script>
<style lang='less' scoped>
  .page1 {
    width: 80%;
    padding: 40px 80px;
    background-color: #fff;
  }
</style>
