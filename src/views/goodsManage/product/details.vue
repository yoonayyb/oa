<template>
  <div class="page">
    <a-spin :spinning="spinning">
      <BasicForm class="disabled_form" @register="registerForm" @field-value-change="valueChange">
        <template #packageSpecs="{ model }">
          <a-row class="hide_bottom" :gutter="8">
            <a-col :span="6">
              <a-form-item name="packageSpecs" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number :min="0" v-model:value="model.packageSpecs" placeholder="请输入" clearable />
              </a-form-item>
            </a-col>
            <a-col class="min-w-6 unit_col flex_aic_jcc"> {{ model.dosageUnit }} * </a-col>
            <a-col :span="6">
              <a-form-item name="packageQuantity" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number :min="0" v-model:value="model.packageQuantity" placeholder="请输入" clearable />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item name="packageUnit" :rules="[{ required: true, message: '请输入' }]">
                <a-select v-model:value="model.packageUnit" placeholder="请选择" clearable :options="unitOptions" />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <template #boxingQuantity="{ model }">
          <a-row class="hide_bottom" :gutter="8">
            <a-col :span="6">
              <a-form-item name="boxingQuantity" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number :min="0" v-model:value="model.boxingQuantity" placeholder="请输入" clearable />
              </a-form-item>
            </a-col>
            <a-col class="min-w-6 unit_col flex_aic_jcc"> {{ model.packageUnit }} / </a-col>
            <a-col :span="6">
              <a-form-item name="boxingUnit" :rules="[{ required: true, message: '请输入' }]">
                <a-select v-model:value="model.boxingUnit" placeholder="请选择" clearable :options="unitOptions" />
              </a-form-item>
            </a-col>
          </a-row>
        </template>
        <template #packingQuantity="{ model }">
          <a-row class="hide_bottom" :gutter="8">
            <a-col :span="6">
              <a-form-item name="packingQuantity" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number :min="0" v-model:value="model.packingQuantity" placeholder="请输入" clearable />
              </a-form-item>
            </a-col>
            <a-col class="min-w-6 unit_col flex_aic_jcc"> {{ model.boxingUnit }} /</a-col>
            <a-col :span="6">
              <a-form-item name="packingUnit" :rules="[{ required: true, message: '请输入' }]">
                <a-select v-model:value="model.packingUnit" placeholder="请选择" clearable :options="unitOptions" />
              </a-form-item>
            </a-col>
          </a-row>
        </template>

        <template #price="{ model }">
          <a-row class="hide_bottom" :gutter="8">
            <a-col :span="14">
              <a-input-number :min="0" v-model:value="model.price" placeholder="请输入" clearable />
            </a-col>
            <a-col class="min-w-6 flex_aic_jcc">
              <span>元 / {{ model.boxingUnit }}</span>
            </a-col>
          </a-row>
        </template>
        <template #validPeriod="{ model }">
          <a-row class="hide_bottom" :gutter="8">
            <a-col :span="14">
              <a-form-item name="validPeriod" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number :min="0" v-model:value="model.validPeriod" placeholder="请输入" clearable />
              </a-form-item>
            </a-col>
            <a-col class="min-w-30 flex_jcc">
              <a-form-item-rest>
                <a-select v-model:value="model.validPeriodUnit" placeholder="请选择" clearable :options="dayOption"> </a-select>
              </a-form-item-rest>
            </a-col>
          </a-row>
        </template>
      </BasicForm>
    </a-spin>

    <div class="flex_aic_jcc mt-10">
      <a-button v-if="is_disable === 'disable'" type="primary">返回上一页</a-button>
      <a-button v-else size="large" type="primary" @click="submit">保存</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { userSchemaFn } from './config';
  import { message } from 'ant-design-vue';

  import { useConfigStore } from '@/store/modules/config';
  let { unitOptions, dayOption } = useConfigStore();
  let { detailsFormSchema } = userSchemaFn();

  const emits = defineEmits(['success', 'register']);
  const saveApi = async (data) => {
    let saveUrl = queryId ? '/erp-ware/product/update' : '/erp-ware/product/save';
    let result = await window.http.post({
      url: saveUrl,
      data,
    });
    return result;
  };
  let queryId = router.currentRoute.value.query?.id || '';

  const is_disable = computed(() => {
    return router.currentRoute.value.query?.status;
  });

  const configRes = ref({});
  const getDetail = async () => {
    let data = await window.http.get({
      url: '/erp-ware/product/' + queryId,
    });
    return data;
  };

  const [registerForm, { setProps, resetFields, setFieldsValue, getFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 12 },
    schemas: detailsFormSchema,
    disabled: is_disable.value === 'disable',
    showActionButtonGroup: false,
  });

  const spinning = ref(false);

  const valueChange = (key, val) => {};
  const requestFn = async (values) => {
    let data = {
      ...values,
      company_id: localStorage.getItem('companyId'),
      id: queryId,
    };
    let result = await saveApi(data);
    return data;
  };
  const submit = async () => {
    try {
      const values = await validate();
      spinning.value = true;
      const result = await requestFn(values);
      message.success('成功');
      window.go('/goodsManage/product');
    } catch (err) {
      console.log('[ err ]-156', err);
    } finally {
      spinning.value = false;
    }
  };

  onMounted(async () => {
    if (queryId) {
      configRes.value = await getDetail();
      setFieldsValue(configRes.value);
    }
  });
</script>
<style lang="less" scoped>
  .page {
    padding: 20px;
    background-color: #fff;
  }

  .unit_col {
    height: 30px;
  }

  .hide_bottom :deep(.ant-form-item) {
    margin-bottom: 0 !important;
  }
</style>
