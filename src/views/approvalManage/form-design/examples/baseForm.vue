<template>
  <div>
    <div style="margin: 20px">
      <a-button @click="handleSubmit">提交</a-button>
    </div>

    <a-form ref="formRef" :model="formState">
      <a-form-item class="item" name="list">
        <a-table bordered style="width: 100%" :dataSource="formState.list" :columns="modelTableColumns" :pagination="false">
          <template #bodyCell="{ column, text, record, index }">
            <template v-if="column.dataIndex === 'productQuantity'">
              <a-form-item
                class="item"
                :name="['list', index, 'productQuantity']"
                :rules="[{ required: true, message: '请选择营养商品', trigger: ['blur', 'change'] }]"
              >
                <a-input placeholder="请输入" :controls="false" v-model:value="record.productQuantity" />
              </a-form-item>
            </template>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable } from '/@/components/Table';

  import { Calendar, Field, TextEllipsis } from 'vant';
  import VFormCreate from '../components/VFormCreate/index.vue';
  const rules = {
    productQuantity: [{ required: true, message: '请选择营养商品', trigger: ['blur', 'change'] }],
    // list: [{ required: true, message: '表格', trigger: ['blur', 'change'] }],
  };
  const formRef = ref();
  // const tableSource = ref([{}, {}, {}]);
  const formState = reactive({
    list: [{}, {}],
  });

  const list = [{}, {}];
  const schemas = [
    {
      field: 'list',
      label: '产品表格',
      defaultValue: [{}],
      slot: 'table',
      // required: true,
    },
  ];
  const modelTableColumns = [
    {
      align: 'center',
      title: '产品编号',
      dataIndex: 'productNo',
      width: '160px',
    },
    {
      align: 'center',
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: '数量',
      dataIndex: 'productQuantity',
    },
    {
      align: 'center',
      title: '操作',
      dataIndex: 'dell',
      width: '120px',
      fixed: 'right',
    },
  ];
  const [registerForm, { setProps, resetFields, getFieldsValue, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas,
    rules,
    showActionButtonGroup: false,
  });

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '商品列表',
    rowKey: 'id',
    columns: modelTableColumns,
    bordered: true,
  });
  const fApi = ref();
  const formModel = reactive({});
  const formConfig = reactive({
    schemas: [
      //   {
      //   "component": "VanInput",
      //   "label": "单行输入框",
      //   "field": "_van_input_1",
      //   "colProps": {
      //     "span": 24
      //   },
      // },
    ],
    layout: 'horizontal',
    labelLayout: 'flex',
    labelWidth: 100,
    labelCol: {},
    wrapperCol: {},
  });

  async function handleSubmit() {
    // const values = await validate();
    // console.log('[ values ]-87', values);
    // let result = await submit(values);
    // emits('success', { isUpdate: unref(isUpdate), values: { ...result } });

    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }
  const submit = () => {
    // const data = await this.fApi.submit()
    console.log(formModel, formModel.value);
  };
  const fieldValueChange = () => {
    // const data = await this.fApi.submit()
    console.log(formModel, formModel.value);
  };
</script>
