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
const schema = [{
    field: 'order_no',
    label: '姓名',
    placeholder: '请输入',
    component: 'Input',
  },
  // {
  //   field: 'order_from',
  //   label: '批号',
  //   placeholder: '请输入',
  //   component: 'Select',
  // },
];
const btnSchema = [{
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      console.log('查询');
      fcMap.get('btn')('select');
    },
  },
  text: '查询',
}, {
  component: 'Button',
  bind: {
    type: 'primary',
    onClick: () => {
      console.log('新增');
      fcMap.get('btn')('add');
    },
  },
  text: '新增',
}, ];
const dataSource = [{
  key: 1,
  order_no: '001245',
  order_from: 'yyb',
  info: '14777286145',
  inventory: '243952806@qq.com',
  take_info: '技术部',
  send_status: '前端',
  send_person: '2022-12-08',
  logistics: '无',
  editTime: '正式员工',
}, ];
const columns = [{
  align: 'center',
  title: '工号',
  dataIndex: 'order_no',
  key: 'order_no',
  width: '100px',
}, {
  align: 'center',
  title: '姓名',
  dataIndex: 'order_from',
  width: '100px',
}, {
  align: 'center',
  title: '手机号',
  dataIndex: 'info',
  width: '100px',
}, {
  align: 'center',
  title: '邮箱',
  dataIndex: 'inventory',
  width: '100px',
}, {
  align: 'center',
  title: '部门',
  dataIndex: 'take_info',
  width: '100px',
}, {
  align: 'center',
  title: '职位',
  dataIndex: 'send_person',
  width: '100px',
}, {
  align: 'center',
  title: '入职类型',
  dataIndex: 'send_status',
  width: '100px',
}, {
  align: 'center',
  title: '类型',
  dataIndex: 'logistics',
  width: '100px',
}, {
  align: 'center',
  title: '状态',
  dataIndex: 'editTime',
  width: '100px',
}, {
  align: 'center',
  title: '操作',
  dataIndex: 'dell',
  width: '150px',
  fixed: 'right',
}, ];
export { columns, dataSource, userFormData, schema, btnSchema };