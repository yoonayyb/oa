import { h } from 'vue';
import { Tag } from 'ant-design-vue';
const sourceOptions = [
  { label: '均衡代谢管理', value: 0 },
  { label: '粤来粤营养', value: 1 },
];
const headerSchema = [
  {
    field: 'categoryName',
    label: '商品名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];
const columns = [
  {
    align: 'center',
    title: '商品代号',
    dataIndex: 'goodsNo',
    width: '100px',
  },
  {
    align: 'center',
    title: '商品来源',
    dataIndex: 'source',
    customRender: ({ record }) => {
      return sourceOptions.find((v) => v.value === record.source)?.label;
    },
    width: '100px',
  },
  {
    align: 'center',
    title: '商品名称',
    dataIndex: 'goodsName',
    width: '150px',
  },
  {
    align: 'center',
    title: '外部商品ID',
    dataIndex: 'externalId',
    width: '100px',
  },
  {
    align: 'center',
    title: '产品信息',
    dataIndex: 'list',
    width: '200px',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status === 0;
      const color = status ? 'green' : 'red';
      const text = status ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    align: 'center',
    title: '创始人',
    dataIndex: 'createdUsername',
    width: '60px',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'createdTime',
    width: '80px',
  },
];

const formSchema = [
  {
    field: 'source',
    label: '商品来源',
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      options: sourceOptions,
    },
    required: true,
  },
  {
    field: 'goodsNameObj',
    label: '外部商品名称',
    slot: 'goodsNameObj',
    required: true,
  },
  {
    field: 'externalId',
    label: '外部商品ID',
    // slot: 'externalId',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },

  {
    field: 'goodsNo',
    label: '商品代号',
    component: 'Input',
    required: true,
  },

  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'list',
    label: '产品表格',
    defaultValue: [{}],
    slot: 'table',
    required: true,
  },

];

const schemas = [
  {
    field: 'goodsName',
    label: '商品名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'pinyin',
    label: '商品拼音',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'goodsNo',
    label: '内部商品ID',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'externalId',
    label: '外部商品ID',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'source',
    label: '商品来源',
    component: 'Select',
    componentProps: {
      options: [{ label: '均衡代谢管理', value: 10 }],
    },
    colProps: { span: 6 },
  },

  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
      ],
    },
    colProps: { span: 6 },
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
export { columns, schemas, modelTableColumns, headerSchema, formSchema, sourceOptions };
