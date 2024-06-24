<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :showCancelBtn="false" :showOkBtn="false">
    <BasicForm @register="registerForm">
      <template #btn>
        <a-radio-group @change="radioChange" v-model:value="shipmentType" :options="shipmentOptions"> </a-radio-group>
      </template>
    </BasicForm>
    <div class="btn_msg" v-if="shipmentType === 'b'"> 请确认货物已被物流公司揽收，点击确认后库存会进行扣减！ </div>
    <div class="btn">
      <a-button v-if="shipmentType === 'a'" type="primary">确认出仓</a-button>
      <a-button v-if="shipmentType === 'b'" type="primary">确认已揽收</a-button>
      <a-button>在等等</a-button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';

  const shipmentOptions: RadioGroupProps['options'] = [
    { label: '物流发货', value: 'a' },
    { label: '手动发货', value: 'b' },
  ];

  let isFirstLoaded = ref(false);
  let { warehouseOutSchema } = userSchemaFn({ isFirstLoaded });
  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    let saveUrl = unref(isUpdate) ? '/erp-ware/locationManage/update' : '/erp-ware/locationManage/save';
    let result = await window.http.post({
      url: saveUrl,
      data,
    });
    return result;
  };

  const isUpdate = ref(true);
  const type = ref('');
  const shipmentType = ref('a');
  const rowId = ref('');
  const schemas = ref([...warehouseOutSchema]);
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    console.log('[ data ]-34', data);
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    type.value = data.type;

    if (unref(isUpdate)) {
      rowId.value = data.record.id;
      setFieldsValue({
        ...data.record,
      });
    }
  });
  const radioChange = (val) => {
    if (unref(shipmentType) === 'a') {
      schemas.value = [...warehouseOutSchema];
    } else {
      schemas.value = [
        {
          field: 'shipmentType',
          label: ' ',
          slot: 'btn',
        },
      ];
    }
  };
  const getTitle = computed(() => (!unref(type) === 'warehouseOut' ? '出仓发货' : '新增'));
  const submit = async (values) => {
    let data = {
      ...values,
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
<style lang="less" scoped>
  .btn {
    padding-left: 92px;
  }
  .btn_msg {
  }
</style>
