const userFormData = (formData) => {
  return [];
};
const fcMap = new Map();
export const btnClick = (nameStr, fn) => {
  // if (nameStr === '') return
  // let arr = nameStr.split(',')
  // arr.forEach((v, index) => {
  //   fcMap.set(v, fn)
  // })
  fcMap.set(nameStr, fn);
};
const schema = [
  {
    field: 'order_no',
    label: '物料名称',
    placeholder: '请输入',
    component: 'Input',
  },
  {
    field: 'order_from',
    label: '批号',
    placeholder: '请输入',
    component: 'Select',
  },
];
const btnSchema = [
  {
    component: 'Button',
    bind: {
      type: 'primary',
      onClick: () => {
        console.log('查询');
        fcMap.get('btn')('select');
      },
    },
    text: '查询',
  },
  {
    component: 'Button',
    bind: {
      type: 'primary',
      onClick: () => {
        console.log('新增');
        fcMap.get('btn')('add');
      },
    },
    text: '新增物料',
  },
];
const dataSource = [
  {
    key: 1,
    order_no: '南沙粗盐（326554226655）',
    order_from: '原料',
    info: '粗制品',
    inventory: '100kg/袋',
    take_info: '袋',
    send_status: '1002',
    send_person: '860',
    logistics: '200',
    editTime: '123',
    price: '245.5',
  },
];
const columns = [
  {
    align: 'center',
    title: '物料名称',
    dataIndex: 'order_no',
    key: 'order_no',
    width: '100px',
  },
  {
    align: 'center',
    title: '物料类型',
    dataIndex: 'order_from',
    width: '100px',
  },
  {
    align: 'center',
    title: '物料类别',
    dataIndex: 'info',
    width: '100px',
  },
  {
    align: 'center',
    title: '物料规格',
    dataIndex: 'inventory',
    width: '100px',
  },
  {
    align: 'center',
    title: '包装单位',
    dataIndex: 'take_info',
    width: '100px',
  },
  {
    align: 'center',
    title: '库存总重量',
    dataIndex: 'send_person',
    width: '100px',
  },
  {
    align: 'center',
    title: '可用库存',
    dataIndex: 'send_status',
    width: '100px',
  },
  // {
  //   align: 'center',
  //   title: '待检库存',
  //   dataIndex: 'logistics',
  //   width: '100px',
  // },
  {
    align: 'center',
    title: '冻结库存',
    dataIndex: 'editTime',
    width: '100px',
  },
  {
    align: 'center',
    title: '进货单价',
    dataIndex: 'price',
    width: '100px',
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'dell',
    width: '150px',
    fixed: 'right',
  },
];
export { columns, dataSource, userFormData, schema, btnSchema };
