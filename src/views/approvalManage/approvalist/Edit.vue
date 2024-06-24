<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { isArray } from '/@/utils/is';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  let addressLabel = ref('');

  let { formSchema } = userSchemaFn(addressLabel);
  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    let saveUrl = unref(isUpdate) ? '/erp-ware/warehouse/update' : '/erp-ware/warehouse/save';
    let result = await window.http.post({
      url: saveUrl,
      data: {
        ...data,
      },
    });
    return result;
  };

  const getAreaRecordInfo = async (params) => {
    let data = await window.http.get({
      url: '/gp_mini/erp_oa/api/address/info',
      params,
    });
    return data;
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
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      setFieldsValue({
        ...data.record,
        areaCode: data.record.areaCode?.split('-'),
      });
      echoAddress(data.record);
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    let areaCode = values.areaCode;
    let data = {
      ...values,
      area: addressLabel.value,
      areaCode: isArray(areaCode) ? areaCode?.join('-') : areaCode,
      company_id: localStorage.getItem('companyId'),
      id: unref(isUpdate) ? rowId.value : '',
    };
    let result = await saveApi(data);
    return data;
  };
  const echoAddress = async (record) => {
    let areaCodeSplit = record.areaCode.split('-');
    let { full_name } = await getAreaRecordInfo({ id: areaCodeSplit[areaCodeSplit.length - 1] });
    addressLabel.value = full_name;
    updateSchema({
      field: 'areaCode',
      componentProps: {
        displayRenderArray: full_name?.split('-'),
      },
    });
  };
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      // TODO custom api
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
