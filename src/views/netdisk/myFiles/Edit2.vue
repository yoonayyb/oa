<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="编辑主要发货人" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  let { formSchema2 } = userSchemaFn();
  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    console.log('data: ', data)
    let saveUrl = '/order_center/warehouse_address_map_api/save'
    let result = await window.http.post({
      url: saveUrl,
      data,
    });
    return result;
  };
  const isUpdate = ref(true);
  const rowId = ref('');
  const type0id = ref('');
  const type1id = ref('');
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema2,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ data ]-34', data);


    let result = await window.http.get({
      url: '/order_center/warehouse_address_map_api/default',

    });
    console.log('result: ', result)

    resetFields();
    setModalProps({ confirmLoading: false });
    if (result.length) {
      type0id.value = result.find(v => v.type === 0) && result.find(v => v.type === 0).id,
        type1id.value = result.find(v => v.type === 1) && result.find(v => v.type === 1).id,
        setFieldsValue({
          type0: result.find(v => v.type === 0) && result.find(v => v.type === 0).warehouse_id,
          type1: result.find(v => v.type === 1) && result.find(v => v.type === 1).warehouse_id,
        });
    }


  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    const { type0, type1 } = values
    let data0 = {
      is_enable: 1,
      type: 0,
      warehouse_id: type0,
      is_default: 1,
      id: type0id.value || 0,
    };
    let data1 = {
      is_enable: 1,
      type: 1,
      warehouse_id: type1,
      is_default: 1,
      id: type1id.value || 0,
    };
    console.log(data0, data1)
    if (type0) await saveApi(data0);
    if (type1) await saveApi(data1);

    return
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
