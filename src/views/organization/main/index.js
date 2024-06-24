const userFormData = (formData) => {
  return [];
};
const fcMap = new Map();
export const btnClick = (nameStr, fn) => {
  fcMap.set(nameStr, fn);
};
const schemas = [
  {
    field: 'title',
    label: '主体名称',
    placeholder: '请输入',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'is_enable',
  //   label: '是否启用',
  //   placeholder: '请输入',
  //   component: 'Select',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     options: [
  //       { value: '', label: '全部' },
  //       { value: 1, label: '启用' },
  //       { value: 0, label: '停用' },
  //     ],
  //   },
  // },
];

const columns = [
  {
    align: 'center',
    title: '主体名称',
    dataIndex: 'title',
    // key: 'order_no',
    width: '120px',
  },
  {
    align: 'center',
    title: '组织机构代码',
    dataIndex: 'code',
    width: '100px',
  },
  {
    align: 'center',
    title: '地址',
    dataIndex: 'address',
    width: '100px',
  },
  {
    align: 'center',
    title: '电话',
    dataIndex: 'landline',
    width: '80px',
  },
  {
    align: 'center',
    title: '开户银行',
    dataIndex: 'bank_name',
    width: '100px',
  },
  {
    align: 'center',
    title: '账号',
    dataIndex: 'bank_num',
    width: '100px',
  },
  {
    align: 'center',
    title: '是否启用',
    dataIndex: 'is_enable',
    width: '60px',
  },
  {
    align: 'center',
    title: '创建人',
    dataIndex: 'created_userName',
    width: '60px',
  },
  {
    align: 'center',
    title: '创建时间',
    dataIndex: 'created_at',
    width: '100px',
  },
  {
    align: 'center',
    title: '更新人',
    dataIndex: 'updated_userName',
    width: '60px',
  },
  {
    align: 'center',
    title: '更新时间',
    dataIndex: 'updated_at',
    width: '100px',
  },
  {
    align: 'center',
    title: '操作',
    dataIndex: 'dell',
    width: '100px',
    fixed: 'right',
  },
];
export { columns, userFormData, schemas };
