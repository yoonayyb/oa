<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :destroyOnClose="true">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { isArray } from '/@/utils/is';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  import { message } from 'ant-design-vue';
  let addressLabel = ref('');
  let isFirstLoaded = ref(false);
  let isChangeFirstLoaded = ref(false);
  let { formSchema } = userSchemaFn(addressLabel, isFirstLoaded, isChangeFirstLoaded);
  const emits = defineEmits(['success', 'register']);

  const getInfo = async (id) => {
    let result = await window.http.get({
      url: '/erp-ware/warehouse/' + id,
    });
    return result;
  };
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
      url: '/basic_center/address_api/info',
      params,
    });
    return data;
  };
  const isUpdate = ref(true);
  const rowId = ref('');
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate, getFieldsValue }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    isFirstLoaded.value = false;
    isChangeFirstLoaded.value = false;
    if (unref(isUpdate)) {
      const result = await getInfo(data.record.id);
      rowId.value = data.record.id;
      let areaCode = data.record.areaCode?.split('-');

      await echoAddress(data.record, areaCode);
      setFieldsValue({
        // ...data.record,
        ...result,
        areaCode,
        listId: result.listId.map((v) => Number(v)),
      });
    }
  });

  const echoAddress = async (record, areaCode) => {
    let { full_name } = await getAreaRecordInfo({ id: areaCode[areaCode.length - 1] });
    addressLabel.value = full_name;
    updateSchema({
      field: 'areaCode',
      componentProps: {
        displayRenderArray: full_name?.split('-'),
      },
    });
  };

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    let areaCode = values.areaCode;
    console.log('[ addressLabel ]-119', addressLabel.value);
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
