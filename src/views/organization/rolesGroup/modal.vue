<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './config';
  const emits = defineEmits(['success', 'register'])
  const saveApi = async (data) => {
    let result = await window.http.post({
      url: '/company_center/company_role_api/save',
      data,
    });
    return result;
  };
  const isUpdate = ref(true);
  const rowId = ref('');
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ data ]-34', data);

    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));
  const submit = async (values) => {
    console.log('[ rowId.value ]-53', rowId.value);
    let data = {
      ...values,
      company_id: localStorage.getItem('companyId'),
      id: unref(isUpdate) ? rowId.value : '',
    };
    let result = await saveApi(data);
    return result;
  };
  async function handleSubmit() {
    try {
      const values = await validate();
      // TODO custom api
      let result = await submit(values);
      console.log('[ result ]-61', result);
      closeModal();
      emits('success', { isUpdate: unref(isUpdate), values: { ...result } });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
