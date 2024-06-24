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
    let saveUrl = '/order_center/warehouse_address_map_api/save'
    let result = await window.http.post({
      url: saveUrl,
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

      updateSchema({
        field: 'system_address_id',
        componentProps: {
          displayRenderArray: [data.record.address_info]
        },
      });
      setFieldsValue({
        ...data.record,
        system_address_id: [data.record.system_address_id],
      });

    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    let data = {
      ...values,
      system_address_id: values.system_address_id[values.system_address_id.length - 1],
      id: unref(isUpdate) ? rowId.value : 0,
      is_enable: 1,
    };
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
