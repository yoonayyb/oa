<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" @field-value-change="formChange" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  let { formSchema } = userSchemaFn();
  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    let saveUrl = unref(isUpdate) ? '/erp-ware/bracketManage/update' : '/erp-ware/bracketManage/save';
    let result = await window.http.post({
      url: saveUrl,
      data: {
        ...data,
      },
    });
    return result;
  };
  const isUpdate = ref(true);
  const rowId = ref('');
  let upDatelocationObj = {};
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
      upDatelocationObj = {
        //保存编辑时 一开始传入的仓库id和库位id
        //在提交时需要提交给后端
        locationId: data.record.locationId,
        warehouseId: data.record.warehouseId,
        //下面三个是用来复现的
        label: data.record.locationName,
        id: data.record.locationId,
        value: data.record.locationId,
      };

      setFieldsValue({
        ...data.record,

        locationObj: upDatelocationObj,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));
  const submit = async (values) => {
    console.log('[ upDatelocationObj ]-63', upDatelocationObj);
    let data = {
      ...upDatelocationObj,
      ...values,
      company_id: localStorage.getItem('companyId'),
      id: unref(isUpdate) ? rowId.value : '',
    };
    delete data.locationObj;
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

  const formChange = (field, { option }) => {
    if (field === 'locationObj') {
      upDatelocationObj = {
        warehouseId: option.warehouseId,
        locationId: option.value,
      };
    }
  };
</script>
