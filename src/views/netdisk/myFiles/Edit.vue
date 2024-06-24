<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  let addressLabel = ref('');

  let { formSchema } = userSchemaFn(addressLabel);

  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    
    let result = await window.http.post({
      url: saveUrl.value,
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
  const saveUrl = ref('/Netdisk/File/dir_save')
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ data ]-34', data);
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    parent_id.value = data.parent_id
    saveUrl.value = data.saveUrl
    rowId.value = 0
    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      
      // updateSchema({
      //   field: 'system_address_id',
      //   componentProps: {
      //     displayRenderArray: [data.record.address_info]
      //   },
      // });
      setFieldsValue({
        ...data.record,
        
      });

    }
  });
  const parent_id = ref(0)
  const getTitle = computed(() => (!unref(isUpdate) ? '新建' : '重命名'));
  const submit = async (values) => {
    let data = {
      ...values,
      parent_id:parent_id.value,
    };
    if(rowId.value) data.id = rowId.value
    let result = await saveApi(data);
    return data;
  };

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      let result = await submit(values);
      closeModal();
      emits('success', { isUpdate: unref(isUpdate), values: { ...result } });
    } catch (error) {
      console.log('[ error ]-63', error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
